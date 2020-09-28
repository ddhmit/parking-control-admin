import React, { useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { TableListItem } from './data.d';
import { ChargingStandardTable, ChargingStandard } from '../../data';
import { Select, Button, Divider, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const { Option } = Select;
interface tableListProsp {
  onFinish: (value: ChargingStandardTable[]) => Promise<any>;
  data: TableListItem[];
  onrefresh: () => void;
  loading: boolean;
  type: string;
  initialvalue: ChargingStandardTable[] | undefined;
  openModal: () => void;
  modify: (value: ChargingStandard) => void;
}
const TableList: React.FC<tableListProsp> = (props: tableListProsp) => {
  let { onFinish, data, onrefresh, loading, initialvalue, type, openModal, modify } = props;
  const actionRef = useRef<ActionType>();
  //删除收费标准的方法
  const cancel = (record: any) => {
    if (initialvalue) {
      let obj = initialvalue.filter((item, index) => item.id !== record.id);
      onFinish(obj);
    }
  };
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '车型',
      dataIndex: 'type',
      valueType: 'option',
      align: 'center',
    },
    {
      title: '免费时长(分)',
      dataIndex: 'freeDuration',
      valueType: 'option',
      align: 'center',
    },
    {
      title: '起步时长(分)',
      dataIndex: 'startTime',
      valueType: 'option',
      align: 'center',
    },
    {
      title: '起步金额(元)',
      dataIndex: 'startMoney',
      valueType: 'option',
      align: 'center',
    },
    {
      title: '计费周期(分)',
      dataIndex: 'billingCycle',
      valueType: 'option',
      align: 'center',
    },
    {
      title: '周期收费金额(元)',
      dataIndex: 'cycleChargeAmount',
      valueType: 'option',
      align: 'center',
    },
    {
      title: '封顶金额',
      align: 'center',
      dataIndex: 'capMoney',
      valueType: 'option',
    },
    {
      title: '生效时间',
      dataIndex: 'time',
      align: 'center',
      valueType: 'option',
    },
    {
      title: '当前状态',
      dataIndex: 'enable',
      align: 'center',
      render: (val: any, record: any, row) => {
        return (
          <Select
            value={data && data[row].enable === true ? '启用' : '未启用'}
            style={{
              width: 120,
              color: data && data[row].enable === true ? '#FD9541' : 'blue',
            }}
            onChange={(e) => {
              if (initialvalue) {
                let obj = e === '启用' ? true : false;
                initialvalue = initialvalue.map((item: any, index) => {
                  delete item.time;
                  if (item.id === record.id) {
                    return { ...item, enable: obj };
                  }
                  return { ...item };
                });
                onFinish(initialvalue);
              }
            }}
          >
            <Option value="启用">启用</Option>
            <Option value="废弃">未启用</Option>
          </Select>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      width: '100px',
      render: (_, record: any) => {
        return (
          <>
            <Popconfirm
              title="是否要删除该记录"
              onCancel={() => {
                return;
              }}
              key={record.key}
              onConfirm={async () => {
                cancel(record);
              }}
            >
              <a>删除</a>
            </Popconfirm>
            <Divider key="divider" type="vertical" />
            <a
              onClick={() => {
                modify(record);
              }}
            >
              修改
            </a>
          </>
        );
      },
    },
  ];
  return (
    <ProTable<TableListItem>
      headerTitle={`${type}收费标准`}
      actionRef={actionRef}
      rowKey="id"
      search={false}
      columns={columns}
      dataSource={data}
      bordered
      pagination={{ defaultPageSize: 10 }}
      options={{
        reload: () => {
          onrefresh();
        },
        fullScreen: true,
        setting: true,
        density: true,
      }}
      loading={loading}
      toolBarRender={(action, { selectedRows }) => [
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={openModal}>
          新增{type}收费标准
        </Button>,
      ]}
    />
  );
};
export default TableList;
