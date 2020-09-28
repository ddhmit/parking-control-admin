import React, { memo, useEffect, useState, useRef, useCallback } from 'react';
import { Card, Col, Button, Badge, Descriptions, Tooltip } from 'antd';
import classNames from 'classnames';
import LightBoxImg from '@/components/LightBoxImg';
import styles from './CameraCard.less';
import { IHeartbeatRes, IAlarmInfoPlate } from '../data';
import customEE, { CustomEventTypes } from '@/utils/customEventEmitter';
import { formatCameraTime, formatShotTime, getPlateType } from '../util/index';
import { addBase64Prefix } from '@/utils/format';
import { formatDeviceName, isValidDeviceName } from '../util/deviceName';
const { Meta } = Card;

const Timeout = 30 * 1000; // 离线超时更改为 30

interface CameraCardProps {
  onOpen: () => void;
  // disabled: boolean;
  camera: IHeartbeatRes;
  car?: IAlarmInfoPlate;
  // timeoutDisabled: boolean;
}

const CameraCard: React.FC<CameraCardProps> = (props) => {
  const { onOpen, camera, car } = props;
  const [offline, setOffline] = useState(false);
  const [opening, setOpening] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timer = useRef<NodeJS.Timeout>();
  const prevCar = useRef<IAlarmInfoPlate | undefined>(car);
  // 倒计时相关
  const closeCountdown = useCallback(() => {
    timer.current && clearInterval(timer.current);
  }, []);

  // 点击后 5s 才能继续点击
  const startCountdown = useCallback(() => {
    closeCountdown();
    setCountdown(5);
    timer.current = setInterval(() => {
      setCountdown((timeout: number) => {
        if (timeout > 0) {
          return timeout - 1;
        } else {
          closeCountdown();
          return timeout;
        }
      });
    }, 1000);
  }, [closeCountdown]);

  // 如果有新的车辆进来，清除倒计时效果和定时器
  useEffect(() => {
    if (!!car && prevCar.current === undefined) {
      closeCountdown();
      setCountdown(0);
    } else if (
      car &&
      prevCar.current &&
      car.result.PlateResult.license !== prevCar.current.result.PlateResult.license
    ) {
      closeCountdown();
      setCountdown(0);
    }
  }, [car, closeCountdown]);
  // 防止组件卸载未关闭定时器
  useEffect(() => {
    return () => {
      closeCountdown();
    };
  }, []);

  // 监听开门事件
  useEffect(() => {
    const onOpen = (serialno: string) => {
      if (!camera) return;
      if (camera.serialno === serialno) {
        // 确认开门时打开 loading 效果
        setOpening(true);
        // 确认开门时打开倒计时效果
        startCountdown();
      }
    };
    const onFinish = (serialno: string) => {
      if (!camera) return;
      if (camera.serialno === serialno) {
        // 开门请求结束后关闭 loading 效果
        setOpening(false);
      }
    };
    customEE.addListener(CustomEventTypes.openGate, onOpen);
    customEE.addListener(CustomEventTypes.openGateFinished, onFinish);

    return () => {
      customEE.removeListener(CustomEventTypes.openGate, onOpen);
      customEE.removeListener(CustomEventTypes.openGateFinished, onFinish);
    };
  }, [camera, startCountdown]);

  useEffect(() => {
    setOffline(false);
    customEE.emit(CustomEventTypes.cameraStatusChange, {
      serialno: camera.serialno,
      offline: false,
    });
    let timer = setTimeout(() => {
      customEE.emit(CustomEventTypes.cameraStatusChange, {
        serialno: camera.serialno,
        offline: true,
      });
      setOffline(true);
    }, Timeout);
    return () => {
      clearTimeout(timer);
    };
  }, [camera]);

  return (
    <Col lg={6} md={8} sm={12} xs={24}>
      <Card
        title={
          <CameraCardTitle
            title={camera.serialno}
            offline={offline}
            timestamp={camera.timeStamp.Timeval.sec}
          />
        }
        bordered={false}
        actions={[
          <Button
            type="primary"
            onClick={onOpen}
            disabled={countdown > 0}
            className={styles.cameraCardOpenBtn}
            loading={opening}
          >
            {countdown > 0 ? `${countdown}秒后可再次点击` : '开闸'}
          </Button>,
        ]}
      >
        <Meta
          title={null}
          description={
            <CameraCardDesc
              info={car}
              placeholder="暂无车辆"
              cameraTime={camera.timeStamp.Timeval.sec}
            />
          }
        />
      </Card>
    </Col>
  );
};

/* 标题区 */
const CameraCardTitle: React.FC<{ title: string; offline?: boolean; timestamp: number }> = (
  props,
) => {
  const { title, offline, timestamp } = props;
  let handledTimestamp = timestamp * 1000;
  return (
    <Tooltip placement="topLeft" title={title}>
      <section className={styles.cameraCardTitleWrapper}>
        <h3 className={styles.cameraCardTitle}>抓拍机：{title.slice(-5)}</h3>
        {offline ? (
          <Badge status="error" text={`${formatCameraTime(handledTimestamp)} 相机离线`} />
        ) : (
          <Badge status="success" text={`${formatCameraTime(handledTimestamp)} 相机正常`} />
        )}
      </section>
    </Tooltip>
  );
};

/* 内容区 */
const CameraCardDesc: React.FC<{
  info?: IAlarmInfoPlate;
  placeholder: string;
  cameraTime: number;
}> = (props) => {
  const { info, placeholder, cameraTime } = props;
  // 拼接图片 base64 字符串
  let src = info && addBase64Prefix(info.result.PlateResult.imageFile);
  let thumbsrc = info && addBase64Prefix(info.result.PlateResult.imageFragmentFile);
  let statusRes = isValidDeviceName(info && info.deviceName);
  return (
    <section className={styles.cameraCardDesc}>
      <div className="info">
        {info ? (
          <Descriptions title={null} layout="vertical" column={1}>
            <Descriptions.Item label="车牌号" className="car-license">
              {info.result.PlateResult.license}
            </Descriptions.Item>
            <Descriptions.Item label="拍摄时间">
              {formatShotTime(
                info.result.PlateResult.timeStamp.Timeval.sec * 1000,
                cameraTime * 1000,
              )}
              {/* {formatCameraTime(info.result.PlateResult.timeStamp.Timeval.sec * 1000)} */}
            </Descriptions.Item>
            <Descriptions.Item
              label="当前机位"
              className={classNames({
                'car-status--out': statusRes.out,
                'car-status--in': statusRes.in,
              })}
            >
              {/* {formatDeviceName(info.deviceName)}&nbsp;{info.deviceName} */}
              {formatDeviceName(info.deviceName)}
            </Descriptions.Item>
            {/*  <Descriptions.Item label="车牌颜色">
              {getPlateColorType(info.result.PlateResult.colorType)}
            </Descriptions.Item> */}
            <Descriptions.Item label="车牌类型">
              {getPlateType(info.result.PlateResult.type)}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          placeholder
        )}
      </div>
      {src && (
        <div className="img-wrapper">
          <LightBoxImg
            src={src}
            // wrapperClassName="img-wrapper"
            className="img"
            wrapperClassName="light-box"
            alt="机位拍摄照片（大）"
          />
          <LightBoxImg
            src={thumbsrc}
            // wrapperClassName="img-wrapper"
            className="img"
            wrapperClassName="light-box"
            alt="机位拍摄照片（小）"
          />
        </div>
      )}
    </section>
  );
};

export default memo(CameraCard);
