import React from 'react';
import { Modal, Card, Descriptions, message } from 'antd';
import { ShopTableListItem } from '../../data';

interface ClearPointModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (id: string, val: number) => void;
  confirmLoading: boolean;
  shopData: ShopTableListItem | null;
}

const ClearPointModal: React.FC<ClearPointModalProps> = (props) => {
  const { visible, onCancel, onOk, confirmLoading, shopData } = props;
  if (!shopData) return null;
  return (
    <Modal
      destroyOnClose
      title="清空积分提示"
      onCancel={onCancel}
      visible={visible}
      confirmLoading={confirmLoading}
      onOk={() => {
        if (shopData.integral === 0) {
          message.info('此商铺积分已清空');
          return;
        }
        onOk(shopData._id, -shopData.integral);
      }}
      okText="确认清空"
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <Card bordered={false}>
        <Descriptions title="是否清空该商铺积分" column={{ sm: 2, xs: 1 }}>
          <Descriptions.Item label="商铺名称">{shopData.name}</Descriptions.Item>
          {/* <Descriptions.Item label="商铺老板电话">18888888888</Descriptions.Item> */}
          <Descriptions.Item label="当前积分">{shopData.integral}</Descriptions.Item>
        </Descriptions>
      </Card>
    </Modal>
  );
};

export default ClearPointModal;
