import React, { useRef, useState, useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { queryReviewShops as queryRule, reviewShop } from '../service';
import ShopDetailModal from '@/pages/shop/components/ShopDetailModal';
import { RefuseModal, AggreeModal } from '../components';
import { ShopTableListItem, ShopReviewParams } from '../data';
import { ShopReviewStatus } from '@/config/shop';
import { message } from 'antd';

const ReviewTableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [shopData, setShopData] = useState<ShopTableListItem | null>(null);
  const [refuseVisible, setRefuseVisible] = useState(false);
  const [aggreeVisible, setAggreeVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      valueEnum: {
        [ShopReviewStatus.Reviewing]: { text: ShopReviewStatus.Reviewing, status: 'Processing' },
        [ShopReviewStatus.Refused]: { text: ShopReviewStatus.Refused, status: 'Warning' },
      },
      filterDropdown: false,
      filterDropdownVisible: false,
      onHeaderCell: () => {
        return { className: 'close-sorter-icon' };
      },
    },
    // { // 余额显示在车辆上
    //   title: '当前余额',
    //   dataIndex: 'balance',
    //   hideInSearch: true,
    //   sorter: true,
    // },
    {
      title: '当前积分',
      dataIndex: 'integral',
      hideInSearch: true,
      sorter: (a: ShopTableListItem, b: ShopTableListItem) => a.integral - b.integral,
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      hideInSearch: true,
      // render: formatTime,
    },
    {
      title: '最近状态更改时间',
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
      hideInSearch: true,
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
              setShopData(record);
            }}
          >
            审核
          </a>
        </>
      ),
    },
  ].map((item): any => ({ ...item, align: 'center' }));
  const closeDetailModal = useCallback(() => {
    setShopData(null);
  }, []);
  const onAggree = useCallback(async () => {
    if (shopData) {
      setIsLoading(true);
      let res = await handleReview({ merchant: shopData._id, status: ShopReviewStatus.Success });
      setIsLoading(false);
      if (res) {
        setAggreeVisible(false);
        closeDetailModal();
        actionRef.current && actionRef.current.reload();
      }
    }
  }, [shopData, closeDetailModal]);

  const onRefuse = useCallback(
    async (value?: string) => {
      if (!value || !value.trim()) {
        message.error('请填写不予通过理由');
        return;
      }
      if (shopData && value) {
        setIsLoading(true);
        let res = await handleReview({
          merchant: shopData._id,
          status: ShopReviewStatus.Refused,
          remark: value,
        });
        setIsLoading(false);

        if (res) {
          closeDetailModal();
          setRefuseVisible(false);
          actionRef.current && actionRef.current.reload();
        }
      }
    },
    [shopData, closeDetailModal],
  );

  return (
    <PageHeaderWrapper>
      <ProTable<ShopTableListItem>
        actionRef={actionRef}
        rowKey="_id"
        tableAlertRender={false}
        request={(params) => queryRule(params)}
        columns={columns}
        rowSelection={false}
        pagination={{ pageSize: 20 }}
      />
      <ShopDetailModal
        shopData={shopData}
        onCancel={closeDetailModal}
        isReviewModal={true}
        okText="审核通过"
        cancelText="不予通过"
        wrapClassName="review-shop-detail-modal"
        onOk={() => {
          setAggreeVisible(true);
        }}
        cancelButtonProps={{
          onClick: () => {
            setRefuseVisible(true);
          },
        }}
      />
      <AggreeModal
        visible={aggreeVisible}
        onCancel={() => {
          if (isLoading) return;
          setAggreeVisible(false);
        }}
        onOk={onAggree}
        confirmLoading={isLoading}
      />
      <RefuseModal
        visible={refuseVisible}
        onCancel={() => {
          if (isLoading) return;
          setRefuseVisible(false);
        }}
        onRefuse={onRefuse}
        confirmLoading={isLoading}
      />
    </PageHeaderWrapper>
  );
};

export default ReviewTableList;

async function handleReview(params: ShopReviewParams) {
  if (!params) return false;
  const hide = message.loading('提交中...');
  try {
    await reviewShop(params);
    hide();
    message.success('提交成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('提交失败，请重试');
    return false;
  }
}
