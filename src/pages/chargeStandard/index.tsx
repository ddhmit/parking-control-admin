import React, { useState, useCallback, useEffect } from 'react';
import { Tabs } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ChargingStandardTable, ChargingStandard } from './data';
import { setChargingStandard, requestChargingStandard } from './serves';
import RecordTable from './compontents/RecordList';
import CardCharge from './compontents/DataForm';
// import { BorderBottomOutlined } from '@ant-design/icons';
import styles from './index.less';
const { TabPane } = Tabs;
const chargeType = [
  {
    type: '小车',
    id: 0,
    dataType: 'smallCar',
  },
  {
    type: '大车',
    id: 1,
    dataType: 'largeCar',
  },
  {
    type: '三轮车',
    id: 2,
    dataType: 'tricycle',
  },
];
export default () => {
  const [data, setData] = useState<ChargingStandard[]>(); //初始数据
  const [loading, setLoading] = useState<boolean>(false); //表格的loading状态;
  const [carData, setCarData] = useState({
    smallCar: [],
    largeCar: [],
    tricycle: [],
  });
  const [type, setType] = useState('小车'); //车辆的类型;
  const [recordRow, setRecordRow] = useState<ChargingStandard>();
  const [modalStatus, setModalStatus] = useState<boolean>(false);
  //打开Modal方法
  const openModal = () => {
    setRecordRow(undefined);
    setModalStatus(true);
  };
  //关闭弹出层的方法
  const closeModal = () => {
    setModalStatus(false);
  };
  //请求收费标准的数据方法
  const requestData = useCallback(async () => {
    try {
      setLoading(true);
      let res = await requestChargingStandard();
      let smallCar = res.filter((item: any, index: number) => item.type === '小车');
      let largeCar = res.filter((item: any, index: number) => item.type === '大车');
      let tricycle = res.filter((item: any, index: number) => item.type === '三轮车');
      setData(res);
      setCarData({
        smallCar: smallCar,
        largeCar: largeCar,
        tricycle: tricycle,
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, [requestChargingStandard]);
  useEffect(() => {
    requestData();
  }, [requestData]);
  //提交收费标准的数据方法
  const CreateChargingStandards = useCallback(
    async (value: ChargingStandardTable[]) => {
      try {
        setLoading(true);
        await setChargingStandard({ key: '收费标准', value: value });
        requestData();
        setModalStatus(false);
        setLoading(false);
        return true;
      } catch (err) {
        setLoading(false);
        return false;
      }
    },
    [requestData],
  );
  //点击刷新按钮的操作
  const refresh = useCallback(() => {
    requestData();
  }, [requestData]);
  //设置收费标准的车辆类型
  const setCarType = (number: number) => {
    setType(chargeType[number].type);
  };
  //点击修改时候的功能
  const changeRecord = (recordRow: ChargingStandard) => {
    setRecordRow(recordRow);
    setModalStatus(true);
  };
  return (
    <PageHeaderWrapper>
      <div className={styles.antTab}>
        <Tabs
          onChange={(value: any) => {
            setCarType(value);
          }}
        >
          {chargeType.map((item, index) => {
            return (
              <TabPane tab={item.type} key={item.id}>
                <RecordTable
                  onFinish={CreateChargingStandards}
                  data={carData[item.dataType]}
                  onrefresh={refresh}
                  loading={loading}
                  initialvalue={data}
                  type={item.type}
                  openModal={openModal}
                  modify={changeRecord}
                ></RecordTable>
              </TabPane>
            );
          })}
        </Tabs>
      </div>
      {modalStatus ? (
        <CardCharge
          type={type}
          data={recordRow}
          initValue={data}
          status={modalStatus}
          cancel={closeModal}
          sureFunction={CreateChargingStandards}
        ></CardCharge>
      ) : null}
    </PageHeaderWrapper>
  );
};
