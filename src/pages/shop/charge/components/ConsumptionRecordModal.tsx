import React from 'react';
import { Modal } from 'antd';
import RecordList from './RecordList';
import styles from './modal.less';

interface ConsumptionRecordModalProps {
  modalVisible: boolean;
  onCancel: () => void;
}

const ConsumptionRecordModal: React.FC<ConsumptionRecordModalProps> = (props) => {
  const { modalVisible, onCancel } = props;
  return (
    <Modal
      destroyOnClose
      title="消费记录"
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

export default ConsumptionRecordModal;
