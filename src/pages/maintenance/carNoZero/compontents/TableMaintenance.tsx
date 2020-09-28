import React, { useRef, useState, useEffect } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { TableListItem } from '../data';
import { formatDeviceName } from '@/pages/switch/util/deviceName';
import { Checkbox } from 'antd';
interface TableMaintenanceProps {
  listData: any;
  onSelectChange: (params: any) => void;
  loading: boolean;
  rowStatus: boolean;
  total: number | undefined;
  pageChange: (page: number) => void;
}
export default (props: TableMaintenanceProps) => {
  let { listData, onSelectChange, loading, rowStatus, total, pageChange } = props;
  const [row, setRow] = useState();
  const actionRef = useRef<ActionType>();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '车牌识别码',
      valueType: 'option',
      dataIndex: 'carNo',
    },
    {
      title: '抓拍机位置',
      dataIndex: ['info', 'deviceName'],
      valueType: 'option',
      renderText: (text: string) => formatDeviceName(text),
    },
    {
      title: 'IP',
      dataIndex: ['info', 'ipaddr'],
      valueType: 'option',
    },
    {
      title: '车辆类型',
      dataIndex: 'type',
      align: 'center',
      valueType: 'option',
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
    },
  ];
  //根据status状态去判断是否清除选中的这几条数据
  useEffect(() => {
    if (rowStatus) {
      let obj: any = [];
      setRow(obj);
      setIndeterminate(false);
      setChecked(false);
    }
  }, [rowStatus]);
  return (
    <ProTable<TableListItem>
      headerTitle="删除车辆记录"
      loading={loading}
      actionRef={actionRef}
      rowKey="key"
      tableAlertRender={false}
      tableAlertOptionRender={false}
      dataSource={listData}
      columns={columns}
      bordered
      search={false}
      pagination={{
        defaultPageSize: 10,
        total: total,
        onChange: (page: number, pagesize: number | undefined) => {
          setChecked(false);
          setIndeterminate(false);
          setRow(undefined);
          pageChange(page);
        },
      }}
      rowSelection={{
        columnTitle: () => {
          return (
            <>
              <Checkbox
                onChange={(e) => {
                  if (listData) {
                    let obj = listData.map((item: any, index: any) => index);
                    setChecked(e.target.checked);
                    setIndeterminate(false);
                    setRow(e.target.checked ? obj : []);
                    if (e.target.checked) {
                      onSelectChange(listData);
                    }
                  }
                }}
                indeterminate={indeterminate}
                checked={checked}
              >
                {' '}
              </Checkbox>
            </>
          );
        },
        columnWidth: '100px',
        type: 'checkbox',
        selections: true,
        hideSelectAll: false,
        selectedRowKeys: row,
        onChange: (col: any, row) => {
          setRow(col);
          onSelectChange(row);
          if (col.length >= listData.length) {
            setChecked(true);
            setIndeterminate(false);
          } else if (col.length < listData.length) {
            if (col.length === 0) {
              setChecked(false);
              setIndeterminate(false);
            } else {
              setChecked(false);
              setIndeterminate(true);
            }
          }
        },
      }}
    />
  );
};
