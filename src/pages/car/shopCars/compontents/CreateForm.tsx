import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Modal, Select, message, Radio, InputNumber } from 'antd';
import { letter, licensePlateNumber, regux } from './data';
const { Option } = Select;
import styles from './form.less';
import moment from 'moment';
interface CreateFormProps {
  modalVisible: boolean; //模态层的状态
  onSubmit: (fieldsValue: any) => Promise<boolean>; //确定提交的函数
  onCancel: () => void; //点击取消时候的函数
  confirmLoading: boolean; //点击确定按钮时候的状态
  data?: any; //传递下来的车辆数据
}
const CreateForm: React.FC<CreateFormProps> = (props: CreateFormProps) => {
  const { modalVisible, onSubmit, onCancel, confirmLoading, data } = props;
  const [form] = Form.useForm(); //表单
  const [status, setStatus] = useState(false); //点击是否免费的状态
  const [expired, setExpired] = useState<string>(); //修改之后的过期时间
  const [selectStatus, setSelecttatus] = useState<string>('months'); //选择的状态
  const [month, setMonth] = useState<number>(1); //月卡的数据
  const [year, setYear] = useState<number>(1); //年卡的数据
  //表单提交完成之后清除数据
  const clearForm = useCallback(() => {
    form.setFieldsValue({
      shop: {
        province: '云',
        city: 'A',
        label: '',
      },
      expired: 'months',
    }); //清除车牌数据
    setStatus(false); //设置是否免费的状态
    setExpired(''); //清除过期时间
    setYear(1); //设置月卡为默认的时间
    setMonth(1); //设置年卡为默认的时间
  }, [form]);
  //点击确定按钮之后的数据提交
  const okHandle = useCallback(async () => {
    try {
      const fieldsValue = await form.validateFields();
      if (regux.test(fieldsValue.shop.province + fieldsValue.shop.city + fieldsValue.shop.label)) {
        //车牌号的格式的验证regux
        let obj: any = await onSubmit({
          num: fieldsValue.shop.province + fieldsValue.shop.city + fieldsValue.shop.label,
          expired: status ? expired : '',
        });
        if (obj) {
          clearForm();
        }
      } else {
        message.error('车牌号格式错误');
      }
    } catch (err) {
      console.log(err);
    }
  }, [form, clearForm, status, expired]);
  //下拉选择框的组件
  let children = letter.map((item, index) => {
    return (
      <Option key={index} value={item}>
        {item}
      </Option>
    );
  });
  //默认的form表单的值初始化车牌
  useEffect(() => {
    let initvalue = {
      shop: {
        province: data ? data.num.slice(0, 1) : '云',
        city: data ? data.num.slice(1, 2) : 'A',
        label: data ? data.num.slice(2) : '',
      },
      expired: 'months',
    };
    form && form.setFieldsValue(initvalue); //初始化表单数据
    setStatus(data && data.expired !== '' ? true : false);
  }, [data, form]);
  //选择状态改变之后更改过期时间以及初始化过期时间
  useEffect(() => {
    let obj: any = {
      select: selectStatus,
      time: selectStatus === 'months' ? month : year,
    };
    setExpired(
      data && data.expired !== ''
        ? moment(data.expired).add(obj.time, obj.select).format('YYYY-MM-DD HH:mm:ss')
        : moment().add(obj.time, obj.select).format('YYYY-MM-DD HH:mm:ss'),
    );
  }, [selectStatus, year, month]);
  //判断数字输入框的值是否超出js计算的最大值
  const enterIntegerFunction = (value: any) => {
    if (value > 999) {
      return 999;
    } else if (value < -999) {
      return -999;
    } else {
      return value;
    }
  };
  return (
    <Modal
      destroyOnClose
      title={data ? '修改车辆信息' : '新增车辆'}
      visible={modalVisible}
      onOk={okHandle}
      getContainer={false}
      onCancel={() => {
        clearForm();
        onCancel();
      }}
      confirmLoading={confirmLoading}
      width={'50%'}
    >
      <Form
        form={form}
        onFieldsChange={(err) => {
          return err;
        }}
      >
        <Form.Item label="输入车牌" required={true}>
          <Input.Group compact>
            <Form.Item
              name={['shop', 'province']}
              noStyle
              rules={[{ required: true, message: '请选择省份' }]}
            >
              <Select placeholder="请选择省份" style={{ width: '100px' }}>
                {licensePlateNumber.map((item, index) => {
                  return (
                    <Option value={item} key={index}>
                      {item}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              name={['shop', 'city']}
              noStyle
              rules={[{ required: true, message: '请选择城市' }]}
            >
              <Select placeholder={'请选择城市'} style={{ width: '100px' }}>
                {children}
              </Select>
            </Form.Item>
            <Form.Item
              name={['shop', 'label']}
              noStyle
              rules={[{ required: true, message: '请输入车牌' }]}
            >
              <Input style={{ width: '24%' }} placeholder="请输入车牌" maxLength={5} />
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item label={'是否免费'} required={true}>
          <Radio.Group
            onChange={(e: any) => {
              setStatus(!status);
            }}
            value={status ? '否' : '是'}
          >
            <Radio value={'是'}>是</Radio>
            <Radio value={'否'}>否</Radio>
          </Radio.Group>
        </Form.Item>
        {status ? (
          <>
            <p>
              当前车辆的过期时间：
              <span>{data && data.expired !== '' ? data.expired : '无'}</span>
            </p>
            <p>
              充值之后的过期时间：<span>{expired}</span>
            </p>
            <p>选择年/月卡</p>
            <Form.Item name={'expired'}>
              <Radio.Group
                onChange={(e: any) => {
                  setSelecttatus(e.target.value);
                }}
              >
                <Radio value="months" style={{ width: '200px' }}>
                  <div className={styles.forms}>
                    <Form.Item>
                      月卡:{' '}
                      <InputNumber
                        max={999}
                        min={-999}
                        type="number"
                        defaultValue={1}
                        value={month}
                        onChange={(value: any) => {
                          setMonth(value);
                        }}
                        parser={(value: any) => enterIntegerFunction(value)}
                        formatter={(value: any) => enterIntegerFunction(value)}
                      />
                      月
                    </Form.Item>
                  </div>
                </Radio>
                <Radio value="years">
                  <div className={styles.forms}>
                    <Form.Item>
                      年卡:{' '}
                      <InputNumber
                        max={999}
                        min={-999}
                        defaultValue={1}
                        type="number"
                        value={year}
                        onChange={(value: any) => {
                          setYear(value);
                        }}
                        parser={(value: any) => enterIntegerFunction(value)}
                        formatter={(value: any) => enterIntegerFunction(value)}
                      />
                      年
                    </Form.Item>
                  </div>
                </Radio>
              </Radio.Group>
            </Form.Item>
          </>
        ) : null}
      </Form>
    </Modal>
  );
};

export default CreateForm;
