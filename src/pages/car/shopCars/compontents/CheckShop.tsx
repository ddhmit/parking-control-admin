import React, { FC, useState, useCallback, useEffect } from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { TableListItem } from './RecordList/data';
import { Modal, Button, Input, message, Popconfirm, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { shopItem } from '../shopCards';
import { getShopCar } from '../serves';
import CreateForm from './CreateForm';
import BindCards from '../../../../services/ShopBindCards';
import DeletCards from '../../../../services/clearShopCards';
import { FreeAdmissionStatus } from './data';
interface CheckShopProps {
  dataSource: shopItem | undefined;
  visible?: boolean;
  onCancel?: () => void;
}
const CheckShop: FC<CheckShopProps> = (props: CheckShopProps) => {
  let { dataSource, visible, onCancel } = props;
  const [dataSourceShop, setDataSourceShop] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleForm, setVisibleForm] = useState(false);
  const [sureLoading, setSureLoading] = useState(false);
  const [rowShopCarData, setrowShopCarData] = useState<any>();
  //查询车辆的接口
  const findShopCar = useCallback(async () => {
    try {
      setDataSourceShop([]);
      setLoading(true);
      let res: any = await getShopCar({ search: { _id: dataSource ? [dataSource.id] : [] } });
      setDataSourceShop(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    setDataSourceShop([]);
    findShopCar();
  }, [findShopCar]);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '车牌号',
      dataIndex: 'num',
      valueType: 'option',
      renderFormItem: () => <Input placeholder="请输入车牌号码"></Input>,
    },
    {
      title: '过期时间',
      dataIndex: 'expired',
      valueType: 'option',
      align: 'center',
    },
    {
      title: '是否免费',
      dataIndex: 'text',
      valueType: 'option',
      align: 'center',
      valueEnum: {
        [FreeAdmissionStatus.Is]: { text: FreeAdmissionStatus.Is, status: 'Success' },
        [FreeAdmissionStatus.No]: { text: FreeAdmissionStatus.No, status: 'Warning' },
      },
      filtered: false,
      filterDropdown: false,
      filterDropdownVisible: false,
      onHeaderCell: () => {
        return { className: 'close-sorter-icon' };
      },
    },
    {
      title: '绑定时间',
      dataIndex: 'createdAt',
      align: 'center',
      valueType: 'option',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record: any) => {
        return (
          <>
            <Popconfirm
              title={'是否删除该车辆'}
              onConfirm={() => {
                clearShopCards(record);
              }}
            >
              <a>删除</a>
            </Popconfirm>
            <Divider key="divider" type="vertical" />
            <a
              onClick={() => {
                setrowShopCarData(record);
                setVisibleForm(true);
              }}
            >
              修改
            </a>
          </>
        );
      },
    },
  ];
  //点击查询的函数这里做的是本地搜索
  const onSubmit = useCallback(
    async (params) => {
      try {
        if (params) {
          let obj = dataSourceShop.filter((item: any, index: any) => {
            if (item.num.indexOf(params) != -1) {
              return item;
            }
          });
          setDataSourceShop(obj);
        } else {
          await findShopCar();
        }
      } catch (err) {}
    },
    [findShopCar, dataSourceShop],
  );
  // onCancel
  const onCancelCreate = () => {
    setVisibleForm(false);
  };
  //绑定车辆
  const bindCardsFunction = useCallback(
    async (value: any) => {
      try {
        setSureLoading(true);
        let params: any = {
          num: value.num,
          merchant: dataSource ? dataSource.id : '',
          expired: value.expired !== '' ? value.expired : '',
        };
        await BindCards(params);
        message.success('车辆绑定成功');
        setSureLoading(false);
        setVisibleForm(false);
        findShopCar();
        return true;
      } catch (err) {
        message.error(rowShopCarData ? '车辆信息修改失败' : '车辆绑定失败');
        setSureLoading(false);
        return false;
      }
    },
    [findShopCar, rowShopCarData, BindCards],
  );
  //删除车辆
  const clearShopCards = useCallback(
    async (record: any) => {
      try {
        let params: any = {
          merchant: dataSource ? dataSource.id : '',
          num: record.num,
        };
        await DeletCards(params);
        message.success('车辆删除成功');
        findShopCar();
      } catch (err) {
        message.error('删除失败');
      }
    },
    [findShopCar],
  );
  return (
    <>
      <Modal
        title={`商户名称:${dataSource ? dataSource.name : ''}`}
        visible={visible}
        onCancel={onCancel}
        width={'70%'}
        getContainer={false}
        footer={null}
      >
        <p style={{ fontSize: '20px', fontWeight: 600 }}>商户车辆列表</p>
        <ProTable<TableListItem>
          columns={columns}
          tableAlertOptionRender={false}
          tableAlertRender={false}
          bordered
          dataSource={dataSourceShop}
          // pagination={{ defaultPageSize: 5 }}
          pagination={false} // 暂不展示分页
          search={false} // 暂不展示查询
          toolBarRender={(action, { selectedRows }) => [
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => {
                setrowShopCarData(undefined);
                setVisibleForm(true);
              }}
            >
              新建
            </Button>,
          ]}
          onSubmit={(params: any) => {
            onSubmit(params.num);
          }}
          loading={loading}
          options={{
            reload: async () => {
              try {
                await findShopCar();
              } catch (err) {
                throw err;
              }
            },
            fullScreen: true,
            setting: true,
            density: true,
          }}
        />
      </Modal>
      {visibleForm ? (
        <CreateForm
          modalVisible={visibleForm}
          onSubmit={bindCardsFunction}
          onCancel={onCancelCreate}
          confirmLoading={sureLoading}
          data={rowShopCarData}
        ></CreateForm>
      ) : null}
    </>
  );
};
export default CheckShop;
