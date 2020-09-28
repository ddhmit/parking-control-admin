import React from 'react';
import { Modal } from 'antd';
interface SwitchModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  confirmLoading?: boolean;
  toOpen: boolean;
}

const SwitchModal: React.FC<SwitchModalProps> = (props) => {
  const { visible, onCancel, onOk, toOpen, confirmLoading } = props;
  return (
    <Modal
      destroyOnClose
      title={toOpen ? '开闸提示' : '关闸提示'}
      onCancel={onCancel}
      visible={visible}
      onOk={onOk}
      confirmLoading={confirmLoading}
      okText={toOpen ? '确认开启' : '确认关闭'}
      // cancelButtonProps={{ style: { display: 'none' } }}
      cancelText="关闭提示"
    >
      <p>{toOpen ? '请再次确认是否开启闸门' : '请再次确认是否关闭闸门'}</p>
    </Modal>
  );
};

export default SwitchModal;
