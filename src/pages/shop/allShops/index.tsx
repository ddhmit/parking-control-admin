import { message, Divider } from 'antd';
import React, { useRef, useState, useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

// 注释的批量删除功能的需要组件
// import { DownOutlined } from '@ant-design/icons';
// import {Button, Dropdown, Menu,} from 'antd'

import { ShopTableListItem } from '../data';
import { queryShopsRule as queryRule, removeShopsRule as removeRule } from '../service';
import DelShopModal from './components/DelShopModal';
import ShopDetailModal from '@/pages/shop/components/ShopDetailModal';
/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: ShopTableListItem[]) => {
  if (!selectedRows) return true;
  const hide = message.loading('正在删除');
  try {
    await removeRule(selectedRows.map((row) => row._id));
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
  const actionRef = useRef<ActionType>();
  const [delModalVisible, setDelModalVisible] = useState(false);
  const [detailShop, setDetailShop] = useState<ShopTableListItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectItems, setSelectItems] = useState<ShopTableListItem[]>([]);
  //等待支付系统接入
  const columns: ProColumns<ShopTableListItem>[] = [
    {
      title: '商铺名称',
      dataIndex: 'name',
    },
    {
      title: '姓名',
      dataIndex: ['user', 'name'],
      hideInSearch: true,
    },
    {
      title: '手机号',
      dataIndex: ['user', 'phone'],
      hideInSearch: true,
    },
    {
      title: '当前状态',
      dataIndex: 'status',
      hideInSearch: true,
      // valueEnum: {
      //   [ShopReviewStatus.Success]: { text: ShopReviewStatus.Success, status: 'Success' },
      //   [ShopReviewStatus.Reviewing]: { text: ShopReviewStatus.Reviewing, status: 'Processing' },
      //   [ShopReviewStatus.Refused]: { text: ShopReviewStatus.Refused, status: 'Warning' },
      // } ,
    },
    // { // 余额显示在车辆上
    //   title: '当前余额',
    //   dataIndex: 'balance',
    //    hideInSearch: true,
    //   sorter: true,
    // },
    {
      title: '当前积分',
      dataIndex: 'integral',
      hideInSearch: true,
      sorter: (a: ShopTableListItem, b: ShopTableListItem) => a.integral - b.integral,
    },
    {
      title: '入驻时间',
      dataIndex: 'createdAt',
      hideInSearch: true,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      // @ts-ignore
      render: (_, record: ShopTableListItem) => (
        <>
          <a
            key="shop-detail"
            onClick={() => {
              setDetailShop(record);
            }}
          >
            查看详情
          </a>
          <Divider key="divider" type="vertical" />
          <a
            key="shop-delete"
            onClick={() => {
              setSelectItems([record]);
              setDelModalVisible(true);
            }}
          >
            删除
          </a>
        </>
      ),
    },
  ].map((item): any => ({ ...item, align: 'center' }));
  const onConfirmDel = useCallback(async () => {
    setDeleting(true);
    let res = await handleRemove(selectItems);
    setDeleting(false);
    setDelModalVisible(false);
    if (res) {
      actionRef.current!.reload();
    }
  }, [selectItems]);
  return (
    <PageHeaderWrapper>
      <ProTable<ShopTableListItem>
        actionRef={actionRef}
        rowKey="_id"
        /* 之后可以选择打开的批量删除功能 */
        /*  toolBarRender={(action, { selectedRows }) => [
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async (e) => {
                    if (e.key === 'remove') {
                      setSelectItems(selectedRows);
                      setDelModalVisible(true);
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量删除</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]} */
        /* tableAlertRender={({ selectedRowKeys, selectedRows }) => (
          <div>
            已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
          </div>
        )} */
        tableAlertRender={false}
        // rowSelection={{}}
        request={(params) => queryRule(params)}
        columns={columns}
        rowSelection={false}
      />
      <DelShopModal
        visible={delModalVisible}
        confirmLoading={deleting}
        onCancel={() => {
          if (deleting) return;
          setDelModalVisible(false);
        }}
        onOk={onConfirmDel}
      />
      <ShopDetailModal
        onCancel={() => {
          setDetailShop(null);
        }}
        shopData={detailShop}
      />
    </PageHeaderWrapper>
  );
};

export default TableList;
