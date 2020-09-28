import React, { useCallback, useState, useEffect } from 'react';
import { Modal, Input, Tooltip, message, Descriptions, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { ShopTableListItem } from '../../data';
const { Text } = Typography;

interface ManualPointModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (id: string, value: number) => void;
  confirmLoading: boolean;
  shopData: ShopTableListItem | null;
}

const ManualPointModal: React.FC<ManualPointModalProps> = (props) => {
  const { visible, onCancel, onOk, confirmLoading, shopData } = props;
  const [value, setValue] = useState<string | undefined>(undefined);
  // 清空 value
  useEffect(() => {
    setValue(undefined);
  }, [visible]);

  const handledOk = useCallback(() => {
    if (!shopData) return;
    if (value && !Number.isNaN(Number(value))) {
      let num = parseInt(value);
      if (num < Number.MIN_SAFE_INTEGER || num > Number.MAX_SAFE_INTEGER) {
        message.warn('超出数值安全输入范围，请输入合理数值');
        return;
      }
      onOk(shopData._id, num);
    } else {
      message.error('请保证更改值存在并正确');
    }
  }, [onOk, value, shopData]);

  return (
    shopData && (
      <Modal
        destroyOnClose
        title="更改积分"
        visible={visible}
        onCancel={onCancel}
        onOk={handledOk}
        confirmLoading={confirmLoading}
        okText="确认更改"
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <Descriptions layout="vertical" title={null} column={2}>
          <Descriptions.Item label="商户名称">{shopData.name}</Descriptions.Item>
          <Descriptions.Item label="当前积分">{shopData.integral}</Descriptions.Item>
          <Descriptions.Item label={'请输入更改额度'}>
            <Input
              onChange={(e) => {
                setValue(e.target.value && e.target.value.trim());
              }}
              value={value}
              type="number"
              disabled={confirmLoading}
              suffix={
                <Tooltip title="请录入整数数字，小数数字将会自动取整">
                  <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                </Tooltip>
              }
            />
          </Descriptions.Item>
          {/* <Descriptions.Item label="增减积分">{Number(value)}</Descriptions.Item> */}
          <Descriptions.Item label="更改后积分">
            {!value ? shopData.integral : shopData.integral + parseInt(value)}
          </Descriptions.Item>
        </Descriptions>
        <Text type="secondary">提示：输入正整数添加积分，输入负整数减少积分</Text>
      </Modal>
    )
  );
};

export default ManualPointModal;
