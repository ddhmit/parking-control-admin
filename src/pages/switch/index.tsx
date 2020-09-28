import React, { useState, useCallback, useEffect } from 'react';
import { message, Row, Button, Empty, Col } from 'antd';
import produce from 'immer';
import { connect, ConnectProps } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Pageloading from '@/components/PageLoading';
import SwitchModal from './components/SwitchModal';
import CameraCard from './components/CameraCard';
import styles from './index.less';
import {
  ipCameraSocketHeartbeat,
  ipCameraSocketCar,
  ipCameraSocketOpenGate,
  ipCameraSocketConnect,
  removeCameraSocketListener,
} from './service';
import { IHeartbeatRes, IAlarmInfoPlate, IResEventRes } from './data';
import appUrl from '@/config/appUrl';
import customEE, { CustomEventTypes } from '@/utils/customEventEmitter';
import { ConnectState, UserModelState } from '@/models/connect';
import { refreshToken } from '@/services/refreshToken';

interface SwitchPageProps extends ConnectProps {
  user: UserModelState;
}

const SwitchPage: React.FC<SwitchPageProps> = (props) => {
  let accessToken = props.user && props.user.accessToken;
  let dispatch = props.dispatch;
  const [switchModalVisible, setSwitchModalVisible] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [reconnecting, setReconnecting] = useState(false);
  const [connectError, setConnectError] = useState(false);
  const [cameras, setCameras] = useState<IHeartbeatRes[]>([]);
  const [offlineCameras, setOfflineCameras] = useState<string[]>([]); // 记录编号数组
  const [cars, setCars] = useState<{ [s: string]: IAlarmInfoPlate }>({});
  const [targetGate, setTargetGate] = useState<IHeartbeatRes | null>(null);

  // 监听 heartbeat
  const addHeartBeatListener = useCallback(() => {
    ipCameraSocketHeartbeat((heartbeat) => {
      if (!heartbeat) return;
      setCameras(
        produce((draft: IHeartbeatRes[]) => {
          let index = draft.findIndex((item) => item.serialno === heartbeat.serialno);
          if (index === -1) {
            draft.push(heartbeat);
          } else {
            draft[index] = heartbeat;
          }
        }),
      );
    });
  }, []);

  // 监听车辆数据
  const addAlarmInfoListener = useCallback(() => {
    ipCameraSocketCar((car) => {
      if (!car) return;
      setCars(
        produce((draft: { [s: string]: IAlarmInfoPlate }) => {
          draft[car.serialno] = car;
        }),
      );
    });
  }, []);

  // 连接 socket 和相关 loading
  const onConnect = useCallback(async () => {
    setConnecting(true);
    // reconnect && reconnect();
    let res = await handleConnect(accessToken, (err: any) => {
      // 超时错误不关闭 loading
      if (err === appUrl.Timeout) return;
      setConnecting(false);
      if (err === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        setConnectError(true);
      }
    });

    let timer: NodeJS.Timeout;

    if (res) {
      addHeartBeatListener();
      addAlarmInfoListener();
      setConnectError(false);
      timer = setTimeout(() => {
        setConnecting(false);
      }, 3000);
    }
    return () => {
      timer && clearTimeout(timer);
    };
  }, [accessToken, addAlarmInfoListener, addHeartBeatListener]);

  // 全局 disconnect 监听

  // 监听连接情况
  useEffect(() => {
    const listener = () => {
      setConnecting(false);
      setConnectError(true);
    };
    customEE.addListener(CustomEventTypes.socketInstanceDisconnect, listener);
    onConnect();
    return () => {
      removeCameraSocketListener();
      customEE.removeListener(CustomEventTypes.socketInstanceDisconnect, listener);
    };
  }, [onConnect]);

  // 重连
  const onReconnect = async () => {
    try {
      setReconnecting(true);
      let token = await refreshToken();
      if (dispatch && token) {
        dispatch({ type: 'user/updateToken', payload: token });
      } else {
        throw new Error();
      }
    } catch (err) {
      onConnect();
    } finally {
      setReconnecting(false);
    }
  };

  // 开闸
  const onOpen = useCallback(async () => {
    if (!targetGate) return;
    customEE.emit(CustomEventTypes.openGate, targetGate.serialno);
    let res = await handleOpen(targetGate);
    /* let res = await new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('测试开门目标： ', targetGate);
        resolve(true);
      }, 2000);
    }); */
    customEE.emit(CustomEventTypes.openGateFinished, targetGate.serialno);
    setTargetGate(null);
    if (res) {
      setSwitchModalVisible(false);
    }
  }, [targetGate]);

  // 监听机位状态
  useEffect(() => {
    /* {
        serialno: camera.serialno,
        offline: true,
      } */
    const onCameraStatusChange = ({
      serialno,
      offline,
    }: {
      serialno: string;
      offline: boolean;
    }) => {
      setOfflineCameras(
        produce((draft) => {
          let index = draft.findIndex((no: string) => no === serialno);
          if (offline) {
            // 离线机位，如果不存在的话加入记录数组
            index === -1 && draft.push(serialno);
          } else {
            // 在线机位如果存在的话，从记录数组中删除
            index !== -1 && draft.splice(index, 1);
          }
        }),
      );
    };
    customEE.addListener(CustomEventTypes.cameraStatusChange, onCameraStatusChange);
    return () => {
      customEE.removeListener(CustomEventTypes.cameraStatusChange, onCameraStatusChange);
    };
  }, []);

  return (
    <PageHeaderWrapper
      className={styles.switchPageWrapper}
      subTitle={`机位数量: ${cameras.length} 正常机位数量: ${
        cameras.length - offlineCameras.length
      } 离线机位数量: ${offlineCameras.length}`}
    >
      {connecting ? (
        <Pageloading tip="服务连接中..." />
      ) : connectError ? (
        <Button loading={reconnecting} onClick={onReconnect}>
          点击重新连接服务
        </Button>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {cameras.length ? (
              cameras.map((item, index) => (
                <CameraCard
                  key={index}
                  onOpen={() => {
                    // console.log('开闸 Modal 打开 -- ', item);
                    setTargetGate(item);
                    setSwitchModalVisible(true);
                  }}
                  camera={item}
                  car={cars[item.serialno]}
                />
              ))
            ) : (
              <Col span={24}>
                <Empty />
              </Col>
            )}
          </Row>
          <SwitchModal
            visible={switchModalVisible}
            onCancel={() => {
              setSwitchModalVisible(false);
              setTargetGate(null);
            }}
            onOk={onOpen}
            toOpen
          />
        </>
      )}
    </PageHeaderWrapper>
  );
};

// export default SwitchPage;
export default connect(({ user }: ConnectState) => ({
  user,
}))(SwitchPage);

async function handleOpen(params: IHeartbeatRes) {
  if (!params) return false;
  const hide = message.loading('开闸中...');
  try {
    let res: IResEventRes = await ipCameraSocketOpenGate(params.serialno);
    // console.log('-- openGate -- res: ', res);
    hide();
    message.info(
      <div>
        <p>{`机位： ${res.serialno}`}</p>
        <p>{`开闸结果： ${res.msg}`}</p>
      </div>,
    );
    return true;
  } catch (error) {
    hide();
    message.error('开闸失败');
    return false;
  }
}

async function handleConnect(
  token: string | undefined,
  errHandler: (err: any) => void,
): Promise<boolean> {
  try {
    await ipCameraSocketConnect(token);
    message.success('连接成功');
    return true;
  } catch (err) {
    message.error('连接失败');
    errHandler(err);
    return false;
  }
}
