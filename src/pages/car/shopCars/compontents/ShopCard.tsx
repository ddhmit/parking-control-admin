import React from 'react';
import { Card, Button, Popconfirm, Spin } from 'antd';
import { PlusOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';
// import style from './index.less';
interface ShopCardsProps {
  data: any;
  loading?: boolean;
  addFunction: (id: string) => void;
  buttonStatus: any;
  clearFunction: (id: string, num: string, key: number) => void;
}
const gridStyle: any = {
  width: '16.66666%',
  backgroundColor: 'blue',
  color: 'white',
  position: 'relative',
  fontSize: '15px',
  padding: '10px',
  // marginRight: '10px',
  marginTop: '10px',
  marginLeft: '10px',
};
const closeIcon: any = {
  position: 'absolute',
  right: '5px',
  top: '5px',
  color: 'rgb(242, 196, 121)',
  width: '20px',
  height: '20px',
};
export default (props: ShopCardsProps) => {
  let { data, loading, addFunction, buttonStatus, clearFunction } = props;
  return loading ? (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        justifyContent: 'center',
      }}
    >
      <Spin size="large"></Spin>
    </div>
  ) : (
    <>
      {data && data.length !== 0 ? (
        data.map((item: any, indx: number) => {
          return (
            <Card
              key={indx}
              style={{ marginTop: 16, padding: '10px' }}
              title={<p style={{ margin: 0 }}>商铺名称:{item.name}</p>}
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    addFunction(item._id);
                  }}
                >
                  新增车辆
                </Button>
              }
            >
              {item.car.length !== 0 ? (
                item.car.map((car: any, carIndex: number) => {
                  let splictarry = car.num.replace(/([\u4e00-\u9fa5A-Z]{2})/, '$1·');
                  return (
                    <Card.Grid style={gridStyle} key={carIndex}>
                      {!buttonStatus ? (
                        <Popconfirm
                          title="是否要删除该车辆"
                          onCancel={() => {
                            return;
                          }}
                          onConfirm={() => {
                            clearFunction(item._id, car.num, carIndex);
                          }}
                        >
                          <CloseCircleOutlined style={closeIcon} />
                        </Popconfirm>
                      ) : buttonStatus.id === item._id && buttonStatus.num === car.num ? (
                        <LoadingOutlined style={closeIcon}></LoadingOutlined>
                      ) : (
                        <Popconfirm
                          title="是否要删除该车辆"
                          onCancel={() => {
                            return;
                          }}
                          onConfirm={() => {
                            clearFunction(item._id, car.num, carIndex);
                          }}
                        >
                          <CloseCircleOutlined style={closeIcon} />
                        </Popconfirm>
                      )}
                      <p style={{ margin: 0, fontSize: '20px' }}>
                        {/* {splictarry.split('-')[0] + '·' + splictarry.split('-')[1]} */}
                        {splictarry}
                      </p>
                      <p style={{ float: 'right', margin: 0, opacity: 0.5, fontSize: '12px' }}>
                        绑定时间: {moment(car.createdAt).format('YYYY-MM-DD')}
                      </p>
                    </Card.Grid>
                  );
                })
              ) : (
                <p style={{ margin: 0 }}>暂无车辆</p>
              )}
            </Card>
          );
        })
      ) : (
        <p style={{ margin: 0 }}>暂无商户</p>
      )}
    </>
  );
};
