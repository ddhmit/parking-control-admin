import React from 'react';
import { Modal } from 'antd';

interface DelShopModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  confirmLoading: boolean;
}

const DelShopModal: React.FC<DelShopModalProps> = (props) => {
  const { visible, onCancel, onOk, confirmLoading } = props;
  return (
    <Modal
      destroyOnClose
      title="删除商户提示"
      onCancel={onCancel}
      visible={visible}
      onOk={onOk}
      confirmLoading={confirmLoading}
      okText="确认删除"
    >
      <p>
        请再次确认是否删除该商户，删除后将清除该商户的所有数据，若该商户再次使用APP将重新进行身份信息审核。
      </p>
    </Modal>
  );
};

export default DelShopModal;
