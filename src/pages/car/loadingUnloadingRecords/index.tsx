import React, { useRef, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { TableListItem, LoadingUnloadingRecordStatus, OperationStatus, dataRegux } from './data.d';
import { VehicleAccessRecord } from './service';
import { CarRecordPaginationConfig, onCarRecordTableLoad } from '../utils';
import styles from '../index.less';
import { Input } from 'antd';
import usePaginationBackButton from '@/hooks/usePaginationBackButton';

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const inputRef = useRef<HTMLInputElement>();
  // 获取分页返回按钮的函数
  const getButton = usePaginationBackButton(actionRef);
  const [rowCarNo, setRowCarNo] = useState<string>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '车牌识别码',
      dataIndex: 'carNo',
      // align: 'center',
      sorter: (a: any, b: any) => {
        return a.carNo.length - b.carNo.length;
      },
      renderFormItem: () => {
        return (
          <Input
            onChange={(e) => {
              e.persist();
              setRowCarNo(e.target.value);
            }}
          ></Input>
        );
      },
    },
    {
      title: '司机手机号',
      dataIndex: 'phone',
      valueType: 'option',
      align: 'center',
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
      title: '途径商户',
      dataIndex: 'merchant',
      align: 'center',
      valueType: 'option',
    },
    {
      title: '操作人手机号',
      dataIndex: 'operatorPhone',
      align: 'center',
      valueType: 'option',
    },
    {
      title: '操作人姓名',
      dataIndex: 'operator',
      align: 'center',
      valueType: 'option',
    },
    {
      title: '当前操作',
      dataIndex: 'operation',
      align: 'center',
      valueType: 'option',
      valueEnum: {
        [LoadingUnloadingRecordStatus.LoadingStatus]: {
          text: LoadingUnloadingRecordStatus.LoadingStatus,
          status: 'Warning',
        },
        [LoadingUnloadingRecordStatus.UnloadStatus]: {
          text: LoadingUnloadingRecordStatus.UnloadStatus,
          status: 'Success',
        },
      },
      filtered: false,
      filterDropdown: false,
      filterDropdownVisible: false,
      onHeaderCell: () => {
        return { className: 'close-sorter-icon' };
      },
    },
    {
      title: '当前状态',
      dataIndex: 'status',
      valueType: 'option',
      align: 'center',
      valueEnum: {
        [OperationStatus.RuningStatus]: {
          text: OperationStatus.RuningStatus,
          status: 'Processing',
        },
        [OperationStatus.ReleaseStatus]: { text: OperationStatus.ReleaseStatus, status: 'Default' },
      },
      filtered: false,
      filterDropdown: false,
      filterDropdownVisible: false,
      onHeaderCell: () => {
        return { className: 'close-sorter-icon' };
      },
      sorter: (a: any, b: any) => {
        return a.status.length - b.status.length;
      },
    },
    {
      title: '进场时间',
      dataIndex: 'createdAt',
      valueType: 'option',
      align: 'center',
    },
    {
      title: '出场时间',
      dataIndex: 'outAt',
      valueType: 'option',
      align: 'center',
      sorter: (a: any, b: any) => {
        let checkA = dataRegux.test(a.outAt);
        let checkB = dataRegux.test(b.outAt);
        let obja = checkA ? new Date(a.outAt).getTime() : 0;
        let objb = checkB ? new Date(b.outAt).getTime() : 0;
        return obja - objb;
      },
    },
    {
      title: '操作时间',
      dataIndex: 'operationAt',
      valueType: 'option',
      align: 'center',
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="车辆装卸货记录表格"
        actionRef={actionRef}
        rowKey="key"
        tableAlertRender={false}
        request={(params) => {
          let obj = {
            ...params,
            carNo: rowCarNo ? rowCarNo : undefined,
          };
          return VehicleAccessRecord(obj);
        }}
        columns={columns}
        bordered
        pagination={CarRecordPaginationConfig}
        onLoad={onCarRecordTableLoad(inputRef, getButton)}
        className={styles.carRecordTable}
        options={{
          reload: async () => {
            setRowCarNo(undefined);
            actionRef && actionRef.current && actionRef.current.reload();
          },
          fullScreen: true,
          setting: true,
          density: true,
        }}
        onRow={(record: any) => {
          return {
            onDoubleClick: () => {
              let obj: any = window.getSelection;
              let empt: any = document.getSelection();
              obj ? obj().removeAllRanges() : empt.empty();
              setRowCarNo(record.carNo);
              actionRef && actionRef.current && actionRef.current.reload();
            },
          };
        }}
        onReset={() => {
          setRowCarNo(undefined);
        }}
      />
    </PageHeaderWrapper>
  );
};

export default TableList;
