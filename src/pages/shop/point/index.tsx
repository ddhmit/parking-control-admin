// import { message } from 'antd';
import React, { useRef, useState, useCallback } from 'react';
import { message, Divider } from 'antd';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { queryShopsRule as queryRule, changeShopPoint } from '../service';
import { connect } from 'dva';
import { LoginAccount } from 'umi';
import { UserRole } from '@/config/role';

import ClearPointModal from './components/ClearPointModal';
import ManualPointModal from './components/ManualPointModal';
// import { ShopReviewStatus } from '@/config/shop';
import { ShopTableListItem, ChangeShopPointParams } from '@/pages/shop/data';

const PointTableList: React.FC<{ user: LoginAccount }> = (props) => {
  const { user } = props;
  const actionRef = useRef<ActionType>();
  const [shopData, setShopData] = useState<ShopTableListItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const columns: ProColumns<ShopTableListItem>[] = [
    {
      title: '商户名称',
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

      /*  valueEnum: {
        [ShopReviewStatus.Success]: { text: ShopReviewStatus.Success, status: 'Success' },
        [ShopReviewStatus.Reviewing]: { text: ShopReviewStatus.Reviewing, status: 'Processing' },
        [ShopReviewStatus.Refused]: { text: ShopReviewStatus.Refused, status: 'Warning' },
      }, */
    },
    {
      title: '商铺积分',
      dataIndex: 'integral',
      hideInSearch: true,
      sorter: (a: ShopTableListItem, b: ShopTableListItem) => a.integral - b.integral,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          {user.identity[UserRole.admin] && (
            <>
              <a
                onClick={() => {
                  setShopData(record);
                  setShowManualModal(true);
                }}
              >
                增减积分
              </a>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  setShopData(record);
                  setShowClearModal(true);
                }}
              >
                积分清空
              </a>
            </>
          )}
        </>
      ),
    },
  ];

  // const onConfirmClear = useCallback(async () => {
  //   if (!shopData) return;
  //   setLoading(true);
  //   // TODO 清空积分请求
  //   let res = await handleManualChangePoint({ merchant: shopData._id,  });
  //   if (res) {
  //     setShopData(null);
  //     setShowClearModal(false);
  //     actionRef.current && actionRef.current.reload();
  //   }
  //   setLoading(false);
  // }, [shopData]);

  const onConfirmChange = useCallback(async (shopID: string, value: number) => {
    setLoading(true);
    let res = await handleManualChangePoint({ merchant: shopID, integral: value });
    if (res) {
      setShopData(null);
      setShowManualModal(false);
      actionRef.current && actionRef.current.reload();
    }
    setLoading(false);
  }, []);

  return (
    <PageHeaderWrapper>
      <ProTable<ShopTableListItem>
        actionRef={actionRef}
        rowKey="_id"
        tableAlertRender={false}
        request={(params) => queryRule(params)}
        columns={columns.map((item) => ({ ...item, align: 'center' }))}
        rowSelection={false}
      />
      <ClearPointModal
        visible={showClearModal}
        onCancel={() => {
          if (loading) return;
          setShopData(null);
          setShowClearModal(false);
        }}
        shopData={shopData}
        confirmLoading={loading}
        onOk={onConfirmChange}
      />
      <ManualPointModal
        visible={showManualModal}
        onCancel={() => {
          if (loading) return;
          setShopData(null);
          setShowManualModal(false);
        }}
        shopData={shopData}
        confirmLoading={loading}
        onOk={onConfirmChange}
      />
    </PageHeaderWrapper>
  );
};

export default connect(({ user }: { user: LoginAccount }) => ({ user }))(PointTableList);

async function handleManualChangePoint(params: ChangeShopPointParams) {
  if (!params) return false;
  const hide = message.loading('更改积分中...');
  try {
    await changeShopPoint(params);
    hide();
    message.success('更改积分成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('更改积分失败，请重试');
    return false;
  }
}
