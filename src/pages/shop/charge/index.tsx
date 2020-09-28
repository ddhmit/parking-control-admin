import React, { useRef, useState, useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

import ChargeRecordModal from './components/ChargeRecordModal';
import ConsumptionRecordModal from './components/ConsumptionRecordModal';
import ManualChargeModal from './components/ManualChargeModal';

import { queryShopsRule as queryRule } from '../service';
import { ShopTableListItem } from '../data';

enum VisibleModalType {
  ChargeRecord = 1,
  ConsumeRecord = 2,
  ManualCharge = 3,
}

const ChargeTableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [targetShop, setTargetShop] = useState<ShopTableListItem | null>(null);
  const [modalType, setModalType] = useState<VisibleModalType>();
  const columns: ProColumns<ShopTableListItem>[] = [
    {
      title: '商铺名称',
      dataIndex: 'name',
    },
    {
      title: '当前状态',
      dataIndex: 'status',
      valueType: 'option',
      /* valueEnum: {
        [ShopReviewStatus.Success]: { text: ShopReviewStatus.Success, status: 'Success' },
        // [ShopReviewStatus.Reviewing]: { text: ShopReviewStatus.Reviewing, status: 'Processing' },
        // [ShopReviewStatus.Refused]: { text: ShopReviewStatus.Refused, status: 'Warning' },
      }, */
    },
    {
      title: '当前余额',
      dataIndex: 'balance',
      valueType: 'option',
    },
    {
      title: '充值记录',
      dataIndex: 'charge',
      valueType: 'option',
      render: (_: any, record: ShopTableListItem) => (
        <>
          <a
            onClick={() => {
              setTargetShop(record);
              setModalType(VisibleModalType.ChargeRecord);
            }}
          >
            查看充值记录
          </a>
        </>
      ),
    },
    {
      title: '消费记录',
      dataIndex: 'consumption',
      valueType: 'option',
      render: (_: any, record: ShopTableListItem) => (
        <>
          <a
            onClick={() => {
              setTargetShop(record);
              setModalType(VisibleModalType.ConsumeRecord);
            }}
          >
            查看消费记录
          </a>
        </>
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_: any, record: ShopTableListItem) => (
        <>
          <a
            onClick={() => {
              setTargetShop(record);
              setModalType(VisibleModalType.ManualCharge);
            }}
          >
            人工充值
          </a>
        </>
      ),
    },
  ].map((item): any => ({ ...item, align: 'center' }));

  const closeModal = useCallback(() => {
    setTargetShop(null);
    setModalType(undefined);
  }, []);

  return (
    <PageHeaderWrapper>
      <ProTable<ShopTableListItem>
        actionRef={actionRef}
        rowKey="_id"
        tableAlertRender={false}
        request={(params) => queryRule(params)}
        columns={columns}
        rowSelection={false}
      />
      <ChargeRecordModal
        modalVisible={!!(targetShop && modalType === VisibleModalType.ChargeRecord)}
        onCancel={closeModal}
      />
      <ConsumptionRecordModal
        modalVisible={!!(targetShop && modalType === VisibleModalType.ConsumeRecord)}
        onCancel={closeModal}
      />
      <ManualChargeModal
        modalVisible={!!(targetShop && modalType === VisibleModalType.ManualCharge)}
        onCancel={closeModal}
        actionRef={actionRef.current}
      />
    </PageHeaderWrapper>
  );
};

export default ChargeTableList;
