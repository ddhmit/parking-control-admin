import React, { useEffect } from 'react';
import { Button, Modal, Form, Input, Radio } from 'antd';
import style from './index.less';
import { ModalProps } from './ElasticLayer';

enum EmployeeRole {
  default = '普通员工',
  // 添加保安
  guard = '普通保安',
}

const CreateEmployeeModal: React.FunctionComponent<ModalProps> = (props: ModalProps) => {
  let {
    visiable,
    title,
    onFinishFunction,
    isEdit,
    cancelFunction,
    editNumber,
    isEditData,
    loading,
  } = props;
  //表单完成
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    if (values.password === values.nextpassword) {
      form.setFieldsValue({ account: '', password: '', nextpassword: '', role: '' });
      onFinishFunction(values, editNumber);
    } else {
      alert('两次输入的密码必须一致');
    }
  };
  //表单提示信息
  const onFieldsChange = (errors: any) => {
    // console.log(errors);
  };
  useEffect(() => {
    if (visiable && isEditData && form) {
      form.setFieldsValue({
        account: isEditData && isEditData.name ? isEditData.name : '',
        password: '',
        nextpassword: '',
        role: isEditData.role, // 角色初始值
      });
    }
    return () => {
      form && form.resetFields();
    };
  }, [form, isEditData, visiable]);
  return (
    <Modal
      title={title}
      visible={visiable}
      footer={null}
      onCancel={() => {
        cancelFunction();
      }}
      destroyOnClose
    >
      <Form
        onFinish={onFinish}
        onFieldsChange={onFieldsChange}
        form={form}
        // initialValues={initValue}
      >
        <Form.Item
          label="员工账号"
          name="account"
          rules={[{ required: true, message: '请输入员工账号' }]}
        >
          <Input placeholder="请输入员工账号" disabled={isEdit} />
        </Form.Item>
        <Form.Item
          name="role"
          label="员工角色"
          rules={[{ required: true, message: '请选择员工角色' }]}
        >
          <Radio.Group>
            <Radio value={EmployeeRole.default}>{EmployeeRole.default}</Radio>
            <Radio value={EmployeeRole.guard}>{EmployeeRole.guard}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="账号密码"
          name="password"
          rules={[{ required: true, message: '请输入员工账号密码' }]}
        >
          <Input placeholder="请输入员工账号密码" />
        </Form.Item>
        <Form.Item
          label="确认密码"
          name="nextpassword"
          rules={[{ required: true, message: '请再次输入密码' }]}
        >
          <Input placeholder="请再次输入密码" type="password" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            size="large"
            className={style.buttonStyle}
            htmlType="submit"
            loading={loading}
          >
            确认修改
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateEmployeeModal;
