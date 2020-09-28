import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, Divider } from 'antd';
import React, { useState, useRef, useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { TableListItem } from './data.d';
import { getMarket as queryRole, bingMarketCar, clearMarketCar } from './service';
import { FreeAdmissionStatus } from '../shopCars/compontents/data';
import AddCarsModal from '../shopCars/compontents/CreateForm';
/**
 * 添加节点
 * @param fields
 */

/**
 * 更新节点
 * @param fields
 */

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await clearMarketCar({
      num: selectedRows.map((row) => row.num)[0],
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false); //弹出框status
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false); //点击创建的时按钮的状态
  const actionRef = useRef<ActionType>();
  const [dataMarketCar, setDataMartketCar] = useState<any>(); //保存修改传递到弹出框中的数据
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '车牌号码',
      dataIndex: 'num',
      align: 'center',
      valueType: 'option',
    },
    {
      title: '过期时间',
      dataIndex: 'expired',
      valueType: 'option',
      align: 'center',
    },
    {
      title: '绑定时间',
      dataIndex: 'createdAt',
      align: 'center',
      valueType: 'option',
    },
    {
      title: '是否免费',
      dataIndex: 'text',
      valueType: 'option',
      align: 'center',
      valueEnum: {
        [FreeAdmissionStatus.Is]: { text: FreeAdmissionStatus.Is, status: 'Success' },
        [FreeAdmissionStatus.No]: { text: FreeAdmissionStatus.No, status: 'Warning' },
      },
      filtered: false,
      filterDropdown: false,
      filterDropdownVisible: false,
      onHeaderCell: () => {
        return { className: 'close-sorter-icon' };
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Popconfirm
            title="是否要删除该车牌"
            onCancel={() => {
              return;
            }}
            key={record.key}
            onConfirm={async () => {
              let obj = await handleRemove([record]);
              if (obj) {
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
          >
            <a>删除</a>
          </Popconfirm>
          <Divider key="divider" type="vertical" />
          <a
            onClick={() => {
              setDataMartketCar(record);
              handleModalVisible(true);
            }}
          >
            修改
          </a>
        </>
      ),
      align: 'center',
    },
  ];
  //绑定车辆
  const bindCardsFunction = useCallback(
    async (value: any) => {
      try {
        setConfirmLoading(true);
        let params: any = {
          num: value.num,
          expired: value.expired !== '' ? value.expired : '',
        };
        await bingMarketCar(params);
        message.success('车辆绑定成功');
        setConfirmLoading(false);
        handleModalVisible(false);
        if (actionRef.current) {
          actionRef.current.reload();
        }
        return true;
      } catch (err) {
        message.error('车辆绑定失败');
        setConfirmLoading(false);
        return false;
      }
    },
    [dataMarketCar],
  );
  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="市场车辆表格"
        actionRef={actionRef}
        rowKey="key"
        toolBarRender={(action, { selectedRows }) => [
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setDataMartketCar(undefined);
              handleModalVisible(true);
            }}
          >
            新建
          </Button>,
        ]}
        tableAlertRender={false}
        request={(params) => queryRole(params)}
        columns={columns}
        bordered
        // pagination={{ defaultPageSize: 10 }}
        pagination={false} // 暂不展示分页
        search={false} // 暂不展示查询
      />
      {createModalVisible ? (
        <AddCarsModal
          onSubmit={(value) => {
            let obj = bindCardsFunction(value);
            return obj;
          }}
          onCancel={() => handleModalVisible(false)}
          modalVisible={createModalVisible}
          confirmLoading={confirmLoading}
          data={dataMarketCar}
        ></AddCarsModal>
      ) : null}
    </PageHeaderWrapper>
  );
};

export default TableList;
