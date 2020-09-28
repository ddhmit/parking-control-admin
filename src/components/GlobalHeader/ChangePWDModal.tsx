import React, { memo, useCallback } from 'react';
import { Modal, Form, Input } from 'antd';
interface ChangePWDModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (fields: any) => void;
  confirmLoading?: boolean;
}

const ChangePWDModal: React.FC<ChangePWDModalProps> = (props) => {
  const { visible, onCancel, onOk, confirmLoading } = props;
  const [form] = Form.useForm();
  const beforeOK = useCallback(async () => {
    try {
      let res = await form.validateFields();
      onOk(res);
    } catch (err) {}
  }, [onOk, form]);
  return (
    <Modal
      destroyOnClose
      title={'修改密码'}
      onCancel={onCancel}
      visible={visible}
      onOk={beforeOK}
      confirmLoading={confirmLoading}
      okText={'确认修改'}
      cancelText="取消"
      afterClose={() => {
        form.resetFields();
      }}
    >
      <Form form={form}>
        <Form.Item
          label="旧密码"
          name="password"
          validateTrigger="onBlur"
          rules={[{ required: true, message: '请输入旧密码' }]}
        >
          <Input disabled={confirmLoading} placeholder="请输入旧密码" type="password" />
        </Form.Item>
        <Form.Item
          label="新密码"
          name="newPassword"
          validateTrigger="onBlur"
          rules={[
            { required: true, message: '请输入新密码' },
            { type: 'string', min: 6, message: '请输入至少6位的新密码' },
          ]}
        >
          <Input disabled={confirmLoading} placeholder="请输入新密码" type="password" />
        </Form.Item>
        <Form.Item
          label="确认新密码"
          name="confirmPassword"
          validateTrigger={['onBlur', 'onChange']}
          rules={[
            { required: true, message: '请再次输入密码' },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('两次密码不一致');
              },
            }),
          ]}
        >
          <Input disabled={confirmLoading} placeholder="请再次输入密码" type="password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(ChangePWDModal);
