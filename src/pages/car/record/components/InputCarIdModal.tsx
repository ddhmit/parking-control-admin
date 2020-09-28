import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';
import { regux } from '../../shopCars/compontents/data';
import { PlateType } from '../../../switch/util';
interface ModalProps {
  visible: boolean;
  closeModal: () => void;
  submit: (obj: any) => Promise<boolean>;
}
const { Option } = Select;
export default (props: ModalProps) => {
  let { visible, closeModal, submit } = props;
  let [form] = Form.useForm();
  const onFinish = async (obj: any) => {
    let upload = {
      car: {
        type: '非三轮车',
        license: obj.license,
        info: {
          deviceName: '手动录入',
          ipaddr: '192.168.0.10',
          result: {
            PlateResult: {
              type: obj.type,
              license: obj.license,
            },
          },
        },
      },
    };
    let boolean: any = await submit(upload);
    if (boolean) {
      form.setFieldsValue({
        license: '',
        deviceName: '手动录入',
        ipaddr: '192.168.0.10',
        carType: '非三轮车',
        type: '',
      });
    }
  };
  useEffect(() => {
    form.setFieldsValue({
      license: '',
      deviceName: '手动录入',
      ipaddr: '192.168.0.10',
      carType: '非三轮车',
      type: '',
    });
  }, []);
  const selections = Array.from(new Set(PlateType));
  return (
    <Modal
      visible={visible}
      onCancel={() => {
        form.setFieldsValue({
          license: '',
          deviceName: '手动录入',
          ipaddr: '192.168.0.10',
          carType: '非三轮车',
          type: '',
        });
        closeModal();
      }}
      footer={null}
      title="手动录入进场记录"
      getContainer={false}
    >
      <Form onFinish={onFinish} form={form}>
        <Form.Item
          label={'车牌识别码'}
          name="license"
          required={true}
          rules={[
            { required: true, message: '请输入车牌识别码' },
            { pattern: regux, message: '请输入正确的车牌号码' },
          ]}
        >
          <Input placeholder="禁止输入三轮车车牌"></Input>
        </Form.Item>
        <Form.Item label={'抓拍机位置'} name="deviceName" required={true}>
          <Input disabled={true}></Input>
        </Form.Item>
        <Form.Item label={'IP地址'} name="ipaddr" required={true}>
          <Input disabled={true}></Input>
        </Form.Item>
        <Form.Item label={'车辆类型'} name="carType" required={true}>
          <Input disabled={true}></Input>
        </Form.Item>
        <Form.Item
          label={'车辆识别类型'}
          name="type"
          required={true}
          rules={[{ required: true, message: '请选择车辆识别类型' }]}
        >
          <Select>
            {selections.map((item, index) => {
              return (
                <Option value={item[0]} key={index}>
                  {item[1]}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button htmlType={'submit'} type="primary" style={{ width: '100%' }}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
