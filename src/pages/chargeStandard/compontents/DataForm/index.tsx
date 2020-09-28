import React, { useEffect } from 'react';
import { Form, Modal, InputNumber, TimePicker, Checkbox, Button } from 'antd';
import styles from './index.less';
import { ChargingStandard } from '../../data';
import moment from 'moment';
const { RangePicker } = TimePicker;
interface dataFormProps {
  type: string;
  data?: ChargingStandard;
  status: boolean;
  initValue?: ChargingStandard[];
  cancel: () => void;
  sureFunction: (value: any) => Promise<any>;
}
export default (props: dataFormProps) => {
  let { type, data, status, cancel, sureFunction, initValue } = props;
  //其他输入框取整的函数
  const enterIntegerFunction = (value: any) => {
    if (value) {
      let obj: any = Number.parseInt(value, 10);
      return obj;
    }
    if (isNaN(value)) {
      return 0;
    }
    return value;
  };
  //计费周期函数最小值为1的函数
  const countTime = (value: any) => {
    if (value) {
      let obj: any = Number.parseInt(value, 10);
      return obj;
    }
    if (isNaN(value)) {
      return 1;
    }
    return value;
  };
  const [form] = Form.useForm();
  //复选框的options
  const options = [
    { value: 0, label: '星期天' },
    { value: 1, label: '星期一' },
    { value: 2, label: '星期二' },
    { value: 3, label: '星期三' },
    { value: 4, label: '星期四' },
    { value: 5, label: '星期五' },
    { value: 6, label: '星期六' },
  ];
  const onFinish = () => {
    let obj: any = form.getFieldsValue();
    if (obj) {
      if (initValue && initValue.length !== 0) {
        if (data) {
          let upload = initValue.map((item: any, index) => {
            delete item.time;
            if (item.id === data?.id) {
              return {
                ...obj,
                type: type,
                effectTime: [
                  moment(obj.effectTime[0]).format('HH:mm:ss'),
                  moment(obj.effectTime[1]).format('HH:mm:ss'),
                ],
                enable: item.enable,
              };
            }
            return { ...item };
          });
          sureFunction(upload);
        } else {
          let upload = initValue.map((item: any, index) => {
            delete item.time;
            return item;
          });
          upload.push({
            ...obj,
            type: type,
            effectTime: [
              moment(obj.effectTime[0]).format('HH:mm:ss'),
              moment(obj.effectTime[1]).format('HH:mm:ss'),
            ],
            enable: false,
          });
          sureFunction(upload);
        }
      } else {
        sureFunction([
          {
            ...obj,
            type: type,
            effectTime: [
              moment(obj.effectTime[0]).format('HH:mm:ss'),
              moment(obj.effectTime[1]).format('HH:mm:ss'),
            ],
            enable: false,
          },
        ]);
      }
    }
  };
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        freeDuration: data.freeDuration, //免费时长
        billingCycle: data.billingCycle, //计费周期
        cycleChargeAmount: data.cycleChargeAmount, //周期收费金额
        startTime: data.startTime, //起步时长
        startMoney: data.startMoney, //起步金额;
        capMoney: data.capMoney, //封顶金额;
        effectTime: [
          moment('2020-12-31 ' + data.effectTime[0]), //为了给rangerpicker赋值给了一个初始值的年月日时间
          moment('2020-12-31 ' + data.effectTime[1]),
        ], //生效时间;
        effectCycle: data.effectCycle, //生效周期;
      });
    }
  }, []);
  //金额输入框去小数点后一位的函数
  const parseFloatF = (value: any) => {
    let str = value.toString();
    if (isNaN(value)) {
      return 0;
    } else if (str.indexOf('.') !== -1) {
      let obj = value.split('.');
      if (obj[1]) {
        let newValue = obj[0] + '.' + obj[1].slice(0, 1);
        return newValue;
      } else {
        return value;
      }
    } else {
      return value;
    }
  };
  return (
    <Modal
      title={data ? `修改${type}收费标准` : `设置${type}收费标准`}
      visible={status}
      onOk={onFinish}
      onCancel={cancel}
      footer={null}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="免费时长(分)"
          name="freeDuration"
          required={true}
          rules={[{ required: true, message: '请输入免费时长' }]}
        >
          <InputNumber
            className={styles.inputNumber}
            parser={(value: any) => enterIntegerFunction(value)}
            formatter={(value: any) => enterIntegerFunction(value)}
            min={0}
          ></InputNumber>
        </Form.Item>
        <Form.Item
          label="起步时长(分)"
          name="startTime"
          required={true}
          rules={[{ required: true, message: '请输入起步时长' }]}
        >
          <InputNumber
            className={styles.inputNumber}
            parser={(value: any) => enterIntegerFunction(value)}
            formatter={(value: any) => enterIntegerFunction(value)}
            min={0}
          ></InputNumber>
        </Form.Item>
        <Form.Item
          label="起步金额(元)"
          name="startMoney"
          required={true}
          rules={[{ required: true, message: '请输入起步金额' }]}
        >
          <InputNumber
            className={styles.inputNumber}
            min={0}
            parser={(value: any) => parseFloatF(value)}
            formatter={(value: any) => parseFloatF(value)}
            precision={1}
            step={0.1}
          ></InputNumber>
        </Form.Item>
        <Form.Item
          label="计费周期(分)"
          name="billingCycle"
          required={true}
          rules={[{ required: true, message: '请输入计费周期' }]}
        >
          <InputNumber
            className={styles.inputNumber}
            parser={(value: any) => countTime(value)}
            formatter={(value: any) => countTime(value)}
            min={1}
          ></InputNumber>
        </Form.Item>
        <Form.Item
          label="周期金额(元)"
          name="cycleChargeAmount"
          required={true}
          rules={[{ required: true, message: '请输入周期收费金额' }]}
        >
          <InputNumber
            className={styles.inputNumber}
            min={0}
            parser={(value: any) => parseFloatF(value)}
            formatter={(value: any) => parseFloatF(value)}
            precision={1}
            step={0.1}
          ></InputNumber>
        </Form.Item>
        <Form.Item
          label="封顶金额(元)"
          name="capMoney"
          required={true}
          rules={[
            { required: true, message: '请输入封顶金额' },
            {
              pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/,
              message: '封顶金额必须大于0',
            },
          ]}
        >
          <InputNumber
            className={styles.inputNumber}
            min={0}
            parser={(value: any) => parseFloatF(value)}
            formatter={(value: any) => parseFloatF(value)}
            precision={1}
            step={0.1}
          ></InputNumber>
        </Form.Item>
        <Form.Item
          label="生效时间"
          name="effectTime"
          required={true}
          rules={[{ required: true, message: '请输入生效时间' }]}
        >
          <RangePicker picker="time" className={styles.inputNumber} format="HH:mm:ss"></RangePicker>
        </Form.Item>
        <Form.Item
          label="生效周期"
          name="effectCycle"
          required={true}
          rules={[{ required: true, message: '请选择生效周期' }]}
        >
          <Checkbox.Group options={options}></Checkbox.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles.inputNumber}>
            确定
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
