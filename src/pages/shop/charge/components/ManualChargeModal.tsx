import React, { useState, useCallback } from 'react';
import { Modal, Card, Descriptions, Divider, Radio, Input, message } from 'antd';
import styles from './modal.less';
import { ActionType } from '@ant-design/pro-table';
interface ManualChargeModalProps {
  modalVisible: boolean;
  onCancel: () => void;
  actionRef?: ActionType;
}

const ManualChargeModal: React.FC<ManualChargeModalProps> = (props) => {
  const { modalVisible, onCancel, actionRef } = props;
  const [confirmModalVisibel, setConfirmModalVisibel] = useState(false);
  const [submiting, setSubmiting] = useState(false);
  const [chargeValue, setChargeValue] = useState<string | undefined>();
  const [inputFocus, setInputFocus] = useState(false);
  const onConfirm = useCallback(async () => {
    setSubmiting(true);
    let res = await handleConfirm({});
    if (res) {
      setConfirmModalVisibel(false);
      onCancel();
      actionRef && actionRef.reload();
    }
    setSubmiting(false);
  }, [onCancel, actionRef]);
  return (
    <Modal
      destroyOnClose
      title="人工充值"
      onCancel={onCancel}
      visible={modalVisible}
      width={'50%'}
      wrapClassName={styles.manualChargeModalWrapper}
      onOk={() => {
        if (chargeValue) {
          setConfirmModalVisibel(true);
        } else {
          message.error('请选择或者填写充值金额');
        }
      }}
    >
      {/* 人工充值 */}
      <Card bordered={false}>
        <Descriptions title="商铺信息" style={{ marginBottom: 32 }} column={{ sm: 2, xs: 1 }}>
          <Descriptions.Item label="商铺名称">xxdddx</Descriptions.Item>
          <Descriptions.Item label="商铺老板电话">18888888888</Descriptions.Item>
          <Descriptions.Item label="绑定车辆">川A123</Descriptions.Item>
          <Descriptions.Item label="当前余额">10.00</Descriptions.Item>
        </Descriptions>
        <Divider style={{ marginBottom: 32 }} />
        <Descriptions title="充值服务" style={{ marginBottom: 32 }} layout="vertical" colon={false}>
          <Descriptions.Item label="请选择充值金额">
            <div>
              <Radio.Group
                // defaultValue="10"
                size="large"
                style={{ marginBottom: 16 }}
                buttonStyle="solid"
                value={inputFocus ? undefined : chargeValue}
                onChange={(e) => {
                  setInputFocus(false);
                  setChargeValue(e.target.value);
                }}
              >
                <Radio.Button value="10">10.00</Radio.Button>
                <Radio.Button value="20">20.00</Radio.Button>
                <Radio.Button value="30">30.00</Radio.Button>
                <Radio.Button value="50">50.00</Radio.Button>
                <Radio.Button value="100">100.00</Radio.Button>
                <Radio.Button value="200">200.00</Radio.Button>
              </Radio.Group>
              <Input
                prefix="￥"
                type="number"
                placeholder="请输入自定义充值金额"
                style={{ maxWidth: '50%' }}
                onChange={(e) => {
                  setChargeValue(e.target.value);
                }}
                onFocus={(e) => {
                  setInputFocus(true);
                  // if (e.target.value) {
                  setChargeValue(e.target.value);
                  // }
                }}
              />
            </div>
          </Descriptions.Item>
        </Descriptions>
        <Divider style={{ marginBottom: 32 }} />
      </Card>
      <ConfirmModal
        visible={confirmModalVisibel}
        onCancel={() => {
          setConfirmModalVisibel(false);
        }}
        onOk={onConfirm}
        submiting={submiting}
        fee={chargeValue}
      />
    </Modal>
  );
};

interface ConfirmModalProps {
  visible: boolean;
  submiting: boolean;
  onCancel: () => void;
  onOk: () => void;
  fee?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = (props) => {
  const { visible, onCancel, onOk, submiting, fee } = props;
  return (
    <Modal
      destroyOnClose
      title="确认充值"
      onCancel={onCancel}
      visible={visible}
      onOk={onOk}
      okText="确认充值"
      confirmLoading={submiting}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <Descriptions title="充值信息" column={{ sm: 1, xs: 1 }}>
        {/*  <Descriptions.Item label="商铺名称">xxdddx</Descriptions.Item>
        <Descriptions.Item label="商铺老板电话">18888888888</Descriptions.Item>
        <Descriptions.Item label="绑定车辆">川A123</Descriptions.Item> */}
        <Descriptions.Item label="充值金额">{fee}元</Descriptions.Item>
        <Descriptions.Item label="提示">
          请再次确认该用户绑定车辆进行账号充值，确认充值后将会在24小时内到该用户账号上，XXXXXXXXXXXXXX
          XXXXXXXXXXXXXXXX。
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ManualChargeModal;

async function handleConfirm(params: any) {
  if (!params) return false;
  const hide = message.loading('充值中...');
  try {
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    hide();
    message.success('充值成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('充值失败，请重试');
    return false;
  }
}
