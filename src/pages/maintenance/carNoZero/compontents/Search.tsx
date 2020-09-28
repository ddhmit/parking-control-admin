import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
interface SearchProps {
  onsubmit: (carNo: any) => void;
  cancel: () => void;
}
export default (props: SearchProps) => {
  let { onsubmit, cancel } = props;
  const [form] = Form.useForm(); //表单
  const onsubmitClick = () => {
    let obj: any = form.getFieldsValue();
    onsubmit(obj);
  };
  return (
    <div style={{ backgroundColor: 'white', padding: '20px 20px', position: 'relative' }}>
      <Form layout="inline" form={form} style={{ width: '100%' }}>
        <Row style={{ width: '100%' }}>
          <Col xs={24} sm={24} md={20} lg={20} xl={20}>
            <Form.Item name="carNo" label="请输入车牌号码" style={{ display: 'inline' }}>
              <Input style={{ width: '200px' }}></Input>
            </Form.Item>
            <Button type="primary" onClick={onsubmitClick}>
              搜索
            </Button>
          </Col>
          <Col xs={24} sm={24} md={4} lg={4} xl={4}>
            <Form.Item>
              <Button type="primary" onClick={cancel} danger style={{ float: 'right' }}>
                删除
              </Button>
            </Form.Item>
          </Col>
        </Row>
        {/* <Button type='primary'>删除</Button> */}
      </Form>
    </div>
  );
};
