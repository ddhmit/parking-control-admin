import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Modal, Card, Descriptions, Divider, message, Spin } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { AggreeModal, RefuseModal } from './index';
import LightBoxImg from '@/components/LightBoxImg';

import styles from './modal.less';
import { ShopTableListItem, ShopStaffReviewParams, ShopStaffListItem, UserListItem } from '../data';
import { queryShopStaffList, reviewShopStaff, getUserInfoFromShopDetail } from '../service';
import { ShopReviewStatus } from '@/config/shop';
import { addBaseUrlPrefix } from '@/utils/format';

interface ShopDetailModalProps extends ModalProps {
  onCancel: () => void;
  shopData: ShopTableListItem | null;
  isReviewModal?: boolean;
  [s: string]: any;
}

const ShopDetailModal: React.FC<ShopDetailModalProps> = (props) => {
  const { shopData, onCancel, isReviewModal = false, ...modalProps } = props;
  const [visible, setVisible] = useState(false);
  const [userInfo, setUserInfo] = useState<UserListItem | undefined>(undefined);
  const [isUserInfoError, setIsUserInfoError] = useState(false);
  useEffect(() => {
    if (shopData) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [shopData]);
  let restProps = {
    ...(!isReviewModal && { footer: null }),
  };

  // 获取对应用户信息
  useEffect(() => {
    (async () => {
      if (shopData) {
        try {
          setIsUserInfoError(false);
          let hide = message.loading('获取商铺身份中数据中...');
          let res = await getUserInfoFromShopDetail(shopData.user._id);
          hide();
          if (res) {
            setUserInfo(res);
          } else {
            throw new Error('该商铺不存在对应的用户数据，无法显示身份证图片');
          }
        } catch (err) {
          message.error(err ? (err.message ? err.message : err) : '获取身份证图片失败');
          setIsUserInfoError(true);
        }
      }
    })();

    return () => {
      setUserInfo(undefined);
    };
  }, [shopData]);

  return (
    <Modal
      destroyOnClose
      title="商铺详情"
      onCancel={onCancel}
      visible={visible}
      width={'88%'}
      wrapClassName={styles.detailModalWrapper}
      {...restProps}
      {...modalProps}
    >
      {shopData && (
        <Card bordered={false}>
          <Descriptions title="商铺信息" style={{ marginBottom: 0 }} column={{ sm: 2, xs: 1 }}>
            <Descriptions.Item label="商铺名称">{shopData.name}</Descriptions.Item>
            <Descriptions.Item label="店主联系方式">
              {shopData.user.phone ? shopData.user.phone : '未填写'}
            </Descriptions.Item>
            <Descriptions.Item label="商铺当前状态">{shopData.status}</Descriptions.Item>
            <Descriptions.Item label="商铺当前积分">{shopData.integral}</Descriptions.Item>
            {/* <Descriptions.Item label="当前余额">{shopData.balance}</Descriptions.Item> */}
            {/* </Descriptions>
          <Descriptions title={null} style={{ marginBottom: 32 }} column={{ sm: 2, xs: 1 }}> */}
            <Descriptions.Item label="店主身份证" className="photo-item">
              <Card
                // hoverable
                className={styles.identityCard}
                cover={
                  !userInfo && !isUserInfoError ? (
                    <Spin />
                  ) : isUserInfoError ? (
                    '获取身份证数据失败, 请尝试刷新页面'
                  ) : (
                    <>
                      {userInfo && userInfo.idCard && userInfo.idCard.photo.head ? (
                        <LightBoxImg
                          alt="店主身份证人像面"
                          src={addBaseUrlPrefix(userInfo.idCard.photo.head)}
                        />
                      ) : (
                        '未上传身份证人像面照片'
                      )}
                      <Divider />
                      {userInfo && userInfo.idCard && userInfo.idCard.photo.emblem ? (
                        <LightBoxImg
                          alt="店主身份证国徽面照片"
                          src={addBaseUrlPrefix(userInfo.idCard.photo.emblem)}
                        />
                      ) : (
                        '未上传身份证国徽面照片'
                      )}
                    </>
                  )
                }
                bodyStyle={{ padding: 0 }}
                bordered={false}
              />
            </Descriptions.Item>
            <Descriptions.Item label="店铺营业执照" className="photo-item">
              <Card
                className={styles.identityCard}
                cover={
                  shopData.businessLicense.photo ? (
                    <LightBoxImg
                      alt="店铺营业执照"
                      src={addBaseUrlPrefix(shopData.businessLicense.photo)}
                    />
                  ) : (
                    '未上传店铺营业执照'
                  )
                }
                bodyStyle={{ padding: 0 }}
                bordered={false}
              />
            </Descriptions.Item>
            <Descriptions.Item label="租房合同首页" className="photo-item">
              <Card
                className={styles.identityCard}
                cover={
                  shopData.rentalContract && shopData.rentalContract.page1 ? (
                    <LightBoxImg
                      alt="租房合同首页"
                      src={addBaseUrlPrefix(shopData.rentalContract.page1)}
                      // src={
                      //   'https://uploadfile.bizhizu.cn/up/0b/03/96/0b0396b353dc6021185f532d8503d15d.jpg'
                      // }
                    />
                  ) : (
                    '未上传租房合同首页'
                  )
                }
                bodyStyle={{ padding: 0 }}
                bordered={false}
              />
            </Descriptions.Item>
            <Descriptions.Item label="租房合同尾页" className="photo-item">
              <Card
                className={styles.identityCard}
                cover={
                  shopData.rentalContract && shopData.rentalContract.page999 ? (
                    <LightBoxImg
                      alt="租房合同尾页"
                      src={addBaseUrlPrefix(shopData.rentalContract.page999)}
                      // src={
                      //   'https://tse2-mm.cn.bing.net/th/id/OIP.B8-a97rTDUa8EZjMjhlWuwAAAA?pid=Api&rs=1'
                      // }
                    />
                  ) : (
                    '未上传租房合同尾页'
                  )
                }
                bodyStyle={{ padding: 0 }}
                bordered={false}
              />
            </Descriptions.Item>
          </Descriptions>
          {!isReviewModal && shopData.status === ShopReviewStatus.Success && (
            <Descriptions title="商铺职员列表" layout="vertical" column={{ md: 1, sm: 1, xs: 1 }}>
              <Descriptions.Item className={styles.shopStaffListWrapper}>
                <ShopStaffList id={shopData._id} />
              </Descriptions.Item>
            </Descriptions>
          )}
        </Card>
      )}
    </Modal>
  );
};

const ShopStaffList: React.FC<any> = (props) => {
  const { id } = props;
  const actionRef = useRef<ActionType>();
  const [staffData, setStaffData] = useState<ShopStaffListItem | null>(null);
  const [refuseVisible, setRefuseVisible] = useState(false);
  const [aggreeVisible, setAggreeVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const columns: ProColumns<ShopStaffListItem>[] = [
    {
      title: '职员名称',
      dataIndex: 'name',
    },
    {
      title: '职员手机号',
      dataIndex: 'phone',
    },
    {
      title: '当前状态',
      dataIndex: 'status',
      valueEnum: {
        [ShopReviewStatus.Success]: { text: ShopReviewStatus.Success, status: 'Success' },
        [ShopReviewStatus.Reviewing]: { text: ShopReviewStatus.Reviewing, status: 'Processing' },
        [ShopReviewStatus.Refused]: { text: ShopReviewStatus.Refused, status: 'Warning' },
      },
      filterDropdown: false,
      filterDropdownVisible: false,
      onHeaderCell: () => {
        return { className: 'close-sorter-icon' };
      },
      hideInSearch: true,
    },
    /* {
      title: '是否禁用',
      dataIndex: 'enable',
      valueType: 'option',
      render: (_, record: ShopStaffListItem) => {
        return <Switch checked={record.enable} />;
      },
    }, */
    {
      title: '操作',
      valueType: 'option',
      // @ts-ignore
      render: (_, record: ShopStaffListItem) => (
        // record.status !== ShopReviewStatus.Success ? (
        <>
          <a
            onClick={() => {
              setStaffData(record);
              setAggreeVisible(true);
            }}
          >
            审核通过
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setStaffData(record);
              setRefuseVisible(true);
            }}
          >
            审核不通过
          </a>
          {/* <Divider type="vertical" /> */}
          {/* <a onClick={() => {}}>删除</a> */}
        </>
      ),
      // ) : // <a onClick={() => {}}>删除</a>
      // null,
    },
  ];

  const closeDetailModal = useCallback(() => {
    setStaffData(null);
  }, []);
  const onAggree = useCallback(
    async (staffData: ShopStaffListItem | null) => {
      if (staffData) {
        setIsLoading(true);
        let res = await handleReviewStaff({
          staff: staffData._id,
          status: ShopReviewStatus.Success,
        });
        setIsLoading(false);
        if (res) {
          setAggreeVisible(false);
          closeDetailModal();
          actionRef.current && actionRef.current.reload();
        }
      }
    },
    [closeDetailModal],
  );

  const onRefuse = useCallback(
    async (staffData: ShopStaffListItem | null, value?: string) => {
      if (!value || !value.trim()) {
        message.error('请填写不予通过理由');
        return;
      }
      if (staffData && value) {
        setIsLoading(true);
        let res = await handleReviewStaff({
          staff: staffData._id,
          status: ShopReviewStatus.Refused,
          remark: value,
        });
        setIsLoading(false);

        if (res) {
          closeDetailModal();
          setRefuseVisible(false);
          actionRef.current && actionRef.current.reload();
        }
      }
    },
    [closeDetailModal],
  );

  return (
    <>
      <ProTable<ShopStaffListItem>
        actionRef={actionRef}
        rowKey="_id"
        tableAlertRender={false}
        columns={columns.map((item): any => ({ ...item, align: 'center' }))}
        rowSelection={false}
        request={(params) => queryShopStaffList(id, params)}
        style={{ width: '100%' }}
        // search={false}
      />
      <AggreeModal
        visible={aggreeVisible}
        onCancel={() => {
          if (isLoading) return;
          setAggreeVisible(false);
        }}
        onOk={() => onAggree(staffData)}
        confirmLoading={isLoading}
        role="staff"
      />
      <RefuseModal
        visible={refuseVisible}
        onCancel={() => {
          if (isLoading) return;
          setRefuseVisible(false);
        }}
        onRefuse={(value?: string) => onRefuse(staffData, value)}
        confirmLoading={isLoading}
        role="staff"
      />
    </>
  );
};

export default ShopDetailModal;

async function handleReviewStaff(params: ShopStaffReviewParams) {
  if (!params) return false;
  const hide = message.loading('审核提交中...');
  try {
    await reviewShopStaff(params);
    hide();
    message.success('审核提交成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('审核提交失败，请重试');
    return false;
  }
}

// async function handleEnableStaff(params) {
//   if (!params) return false;
//   const hide = message.loading('请求提交中...');
//   try {
//     await new Promise((resolve) => {
//       setTimeout(resolve, 1000);
//     });
//     hide();
//     message.success('请求成功，即将刷新');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('请求失败，请重试');
//     return false;
//   }
// }
