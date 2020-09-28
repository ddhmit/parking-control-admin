import React, { useState, useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Search from './compontents/Search';
import TableMaintenance from './compontents/TableMaintenance';
import { VehicleAccessRecord } from '../../car/record/service';
import { clearMaintenance } from './serves';
import { Modal, message } from 'antd';
const { confirm } = Modal;
export default () => {
  const [listData, setListData] = useState();
  const [rowData, setRowData] = useState<string[]>();
  const [carNo, setCarNo] = useState();
  const [loading, setLoading] = useState(false);
  const [rowStatus, setRowStatus] = useState<any>(false);
  const [total, setTotal] = useState<number>();
  const getListData = useCallback(
    async (param: any) => {
      if (param.carNo) {
        setLoading(true);
        setRowStatus(rowData ? true : false);
        try {
          setCarNo(param.carNo);
          let obj = await VehicleAccessRecord({
            ...param,
            current: param.current ? param.current : 1,
            pageSize: param.pageSize ? param.pageSize : 10,
          });
          setListData(obj.data);
          setTotal(obj.total);
          setLoading(false);
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
      } else {
        message.info('请输入车牌号码');
      }
    },
    [rowData],
  );
  const onSelectRow = (row: any) => {
    let obj = row.map((item: any, index: any) => item.id);
    setRowData(obj);
  };
  const cancel = useCallback(async () => {
    if (rowData && rowData.length !== 0) {
      confirm({
        content: (
          <>
            <p>是否要删除这{rowData ? rowData.length : ''}条</p>
            <p>记录删除后的无法恢复</p>
          </>
        ),
        title: '提示',
        okText: '确定',
        okCancel: true,
        onOk: async () => {
          setRowStatus(false);
          try {
            if (rowData) {
              await clearMaintenance({ cars: rowData });
              setRowData(undefined);
              setRowStatus(true);
              getListData({ carNo: carNo });
            }
          } catch (err) {
            console.log(err);
          }
        },
        onCancel: () => {
          return;
        },
      });
    } else {
      message.info('未选择车辆记录');
    }
  }, [carNo, getListData, rowData]);
  const pageChange = (number: number) => {
    getListData({ carNo: carNo, current: number, pageSize: 10 });
  };
  return (
    <PageHeaderWrapper>
      <Search onsubmit={getListData} cancel={cancel}></Search>
      <TableMaintenance
        listData={listData}
        onSelectChange={onSelectRow}
        loading={loading}
        rowStatus={rowStatus}
        total={total}
        pageChange={pageChange}
      ></TableMaintenance>
    </PageHeaderWrapper>
  );
};
