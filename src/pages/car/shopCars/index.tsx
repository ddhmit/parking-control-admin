import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { shopItem } from './shopCards';
import ShopTable from './compontents/ShopTable';
import VehicleShop from './compontents/CheckShop';
const TableList: React.FC<{}> = () => {
  const [checkModalShop, setCheckModalShop] = useState<boolean>(false); //打开查看车辆模态框的参数
  const [shopDetial, setShopDetail] = useState<shopItem>(); //每个商户的信息
  //打开查看车辆的模态框
  const openShopOnModal = (record: shopItem) => {
    setShopDetail(record);
    setCheckModalShop(true);
  };
  const onCancel = () => {
    setCheckModalShop(false);
  };
  //
  return (
    <PageHeaderWrapper>
      <ShopTable onOk={openShopOnModal}></ShopTable>
      {checkModalShop ? (
        <VehicleShop
          visible={checkModalShop}
          dataSource={shopDetial}
          onCancel={onCancel}
        ></VehicleShop>
      ) : null}
    </PageHeaderWrapper>
  );
};

export default TableList;
