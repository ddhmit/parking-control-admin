import React, { useState, useCallback } from 'react';
import { Modal, Input } from 'antd';

const TextArea = Input.TextArea;

interface AggreeModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  confirmLoading: boolean;
  role?: 'boss' | 'staff';
}

export const AggreeModal: React.FC<AggreeModalProps> = (props) => {
  const { visible, onCancel, onOk, confirmLoading, role = 'boss' } = props;
  return (
    <Modal
      destroyOnClose
      title="审核通过"
      onCancel={onCancel}
      visible={visible}
      onOk={onOk}
      confirmLoading={confirmLoading}
      okText="确认通过"
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <p>
        {role === 'boss'
          ? '请再次确认该用户审核通过，通过审核后，将绑定该商铺且为商铺老板身份并可进行车辆装卸货放行操作、邀请员工加入商铺。'
          : '请再次确认是否通过该商铺员工审核'}
      </p>
    </Modal>
  );
};

interface RefuseModalProps extends Omit<AggreeModalProps, 'onOk'> {
  onRefuse: (value?: string) => void;
}

export const RefuseModal: React.FC<RefuseModalProps> = (props) => {
  const { visible, onCancel, onRefuse, confirmLoading, role = 'boss' } = props;
  const [inputValue, setInputValue] = useState('');
  const onOk = useCallback(() => {
    onRefuse(inputValue);
  }, [inputValue, onRefuse]);
  return (
    <Modal
      destroyOnClose
      title="不予通过"
      onCancel={onCancel}
      visible={visible}
      onOk={onOk}
      confirmLoading={confirmLoading}
      okText="确认不予通过，并提交原因"
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <TextArea
        placeholder={
          role === 'boss' ? '请填写该商户审核不通过的原因' : '请填写该商铺员工审核不通过原因'
        }
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
    </Modal>
  );
};
