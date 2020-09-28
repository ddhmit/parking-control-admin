// import { PlusOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import React, { useState, useRef, useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { TableListItem, CarType } from './data.d';
import { VehicleAccessRecord, inputCarId } from './service';
import { formatDeviceName } from '@/pages/switch/util/deviceName';
import { onCarRecordTableLoad, CarRecordPaginationConfig } from '../utils';
import { DatePicker, Button, message } from 'antd';
import styles from '../index.less';
import usePaginationBackButton from '@/hooks/usePaginationBackButton';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import InputCarIdModal from './components/InputCarIdModal';
const { RangePicker } = DatePicker;
const NonMotorText = '三轮车道';
// import Icon from '@ant-design/icons';
/**
 * 添加节点
 * @param fields
 */
/**
 * 更新节点
 * @param fields
 */
// const handleUpdate = async (fields: FormValueType) => {
//   const hide = message.loading('正在配置');
//   try {
//     await updateRule({
//       name: fields.name,
//       desc: fields.desc,
//       key: fields.key,
//     });
//     hide();

//     message.success('配置成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('配置失败请重试！');
//     return false;
//   }
// };

/**
 *  删除节点
 * @param selectedRows
 */
// const handleRemove = async (selectedRows: TableListItem[]) => {
//   const hide = message.loading('正在删除');
//   if (!selectedRows) return true;
//   try {
//     await removeRule({
//       key: selectedRows.map((row) => row.key),
//     });
//     hide();
//     message.success('删除成功，即将刷新');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('删除失败，请重试');
//     return false;
//   }
// };

const TableList: React.FC<{}> = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const inputRef = useRef<HTMLInputElement>();
  // 获取分页返回按钮的函数
  const getButton = usePaginationBackButton(actionRef);
  const [time, setTime] = useState<any>([
    moment(new Date(), 'YYYY-MM-DD').add(-4, 'days'),
    moment(new Date(), 'YYYY-MM-DD'),
  ]);
  // const [rowCarNo, setRowCarNo] = useState<string>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '车牌识别码',
      dataIndex: 'carNo',
      renderFormItem: () => {
        return (
          <Input
          // value={rowCarNo}
          // onChange={(e) => {
          //   e.persist();
          //   console.log(e);
          // }}
          ></Input>
        );
      },
    },
    {
      title: '进口抓拍机位置',
      dataIndex: ['info', 'deviceName'],
      hideInSearch: true,
      renderText: (text: string, record: TableListItem) =>
        record.type === CarType.Motor ? formatDeviceName(text) : NonMotorText,
    },
    {
      title: 'IP',
      dataIndex: ['info', 'ipaddr'],
      hideInSearch: true,
    },
    {
      title: '车辆类型',
      dataIndex: 'type',
      align: 'center',
      valueType: 'option',
    },
    {
      title: '车辆识别类型',
      dataIndex: 'carType',
      align: 'center',
      valueType: 'option',
    },
    {
      title: '进场时间',
      dataIndex: 'createdAt',
      // valueType: 'dateRange',
      align: 'center',
      renderFormItem: () => {
        return (
          <>
            {/* <label>出入记录</label> */}
            <RangePicker
              disabledDate={(current) => {
                if (time.length === 0) {
                  return false;
                }
                const tooLate = time[0] && current.diff(time[0], 'days') >= 5;
                const tooEarly = time[1] && time[1].diff(current, 'days') >= 5;
                return tooEarly || tooLate;
              }}
              defaultValue={[
                moment(new Date(), 'YYYY-MM-DD').add(-4, 'days'),
                moment(new Date(), 'YYYY-MM-DD'),
              ]}
              onCalendarChange={(value: any, dateString) => {
                if (!value) {
                  setTime([]);
                  return;
                }
                return setTime(() => [
                  value[0] ? moment(value[0], 'YYYY-MM-DD') : undefined,
                  value[1] ? moment(value[1], 'YYYY-MM-DD') : undefined,
                ]);
              }}
              onChange={(value: any, dateString) => {
                if (!value) {
                  setTime([]);
                  return;
                }
                return setTime([moment(value[0], 'YYYY-MM-DD'), moment(value[1], 'YYYY-MM-DD')]);
              }}
              onOpenChange={(open) => {
                if (!open) {
                  return;
                }
                if (time.includes(undefined)) {
                  return setTime([]);
                }
              }}
              value={time}
            ></RangePicker>
          </>
        );
      },
    },
    {
      title: '出场时间',
      dataIndex: 'outAt',
      valueType: 'option',
      align: 'center',
    },
  ];
  //开启模态框
  const openModal = () => {
    setVisible(true);
  };
  //关闭模态框
  const closeModal = () => {
    setVisible(false);
  };
  //手动录入车牌的提交方法
  const onSubmit = useCallback(
    async (obj: any) => {
      try {
        await inputCarId(obj);
        message.success('手动录入车牌成功');
        setVisible(false);
        actionRef && actionRef.current && actionRef.current.reload();
        return true;
      } catch (err) {
        message.error('手动录入车牌失败');
        return false;
      }
    },
    [actionRef],
  );
  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="车辆出入记录表格"
        actionRef={actionRef}
        rowKey="key"
        tableAlertRender={false}
        toolBarRender={(action, { selectedRows }) => [
          <Button type="primary" size="large" icon={<PlusOutlined />} onClick={openModal}>
            手动录入进场记录
          </Button>,
        ]}
        request={(params: any) => {
          delete params._timestamp;
          let data: any = [];
          if (time.length !== 0) {
            if (time[0] && time[1]) {
              data = time;
            }
          }
          let obj = {
            ...params,
            createdAt:
              data && data.length !== 0
                ? [moment(data[0]).format('YYYY-MM-DD'), moment(data[1]).format('YYYY-MM-DD')]
                : undefined,
            // carNo: rowCarNo ? rowCarNo : undefined,
          };
          return VehicleAccessRecord(obj);
        }}
        columns={columns}
        bordered
        //分页器的开关
        pagination={CarRecordPaginationConfig}
        onLoad={onCarRecordTableLoad(inputRef, getButton)}
        className={styles.carRecordTable}
        options={{
          reload: async () => {
            // setRowCarNo(undefined);

            actionRef && actionRef.current && actionRef.current.reload();
          },
          fullScreen: true,
          setting: true,
          density: true,
        }}
        onReset={() => {
          // setRowCarNo(undefined);
          setTime([
            moment(new Date(), 'YYYY-MM-DD').add(-4, 'days'),
            moment(new Date(), 'YYYY-MM-DD'),
          ]);
        }}
        // onRow={(record: any) => {
        //   return {
        //     onDoubleClick: () => {
        //       let obj: any = window.getSelection;
        //       let empt: any = document.getSelection();
        //       obj ? obj().removeAllRanges() : empt.empty();
        //       setRowCarNo(record.carNo);
        //       actionRef && actionRef.current && actionRef.current.reload();
        //     },
        //   };
        // }}
      />
      <InputCarIdModal
        visible={visible}
        closeModal={closeModal}
        submit={onSubmit}
      ></InputCarIdModal>
    </PageHeaderWrapper>
  );
};

export default TableList;
