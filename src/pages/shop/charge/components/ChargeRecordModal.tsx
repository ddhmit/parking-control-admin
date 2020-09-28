import React from 'react';
import { Modal } from 'antd';
import RecordList from './RecordList';
import styles from './modal.less';

interface ChargeRecordModalProps {
  modalVisible: boolean;
  onCancel: () => void;
}

const ChargeRecordModal: React.FC<ChargeRecordModalProps> = (props) => {
  const { modalVisible, onCancel } = props;
  return (
    <Modal
      destroyOnClose
      title="充值记录"
      onCancel={onCancel}
      visible={modalVisible}
      footer={null}
      wrapClassName={styles.listModalWrapper}
      width={'88%'}
    >
      <RecordList />
    </Modal>
  );
};

export default ChargeRecordModal;
