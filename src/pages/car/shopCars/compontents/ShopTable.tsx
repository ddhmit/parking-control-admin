import React from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { TableListItem } from './RecordList/data';
import { getShop } from '../serves';
interface TableProps {
  onOk: (row: any) => void;
}
export default (props: TableProps) => {
  let { onOk } = props;
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '商户名称',
      dataIndex: 'name',
      // valueType: 'option',
    },
    {
      title: '车辆数量',
      dataIndex: 'length',
      align: 'center',
      valueType: 'option',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (text, record: any) => {
        return (
          <>
            <a
              onClick={() => {
                onOk(record);
              }}
            >
              查看车辆
            </a>
          </>
        );
      },
    },
  ];
  return (
    <ProTable<TableListItem>
      columns={columns}
      tableAlertOptionRender={false}
      tableAlertRender={false}
      bordered
      request={(params) => getShop(params)}
      pagination={{ defaultPageSize: 10 }}
    />
  );
};
