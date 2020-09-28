import React, { useState, useCallback, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ElasticLayer from './compontents/ElasticLayer';
import { formProps } from './compontents/ElasticLayer/ElasticLayer';
import { findMarketDetail as queryRule } from '../../services/findMarketDetail';
import updateStaff from '../../services/updateStaff';
import deletStaff from '../../services/deletStaff';
import { Button, Popconfirm, message, Divider } from 'antd';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
interface tabProps {
  key: number;
  name: string;
  password: string;
  createTime: string;
  nextpassword: string;
  updateTime: string;
  operation: string[];
  role: string;
  _id: string;
}
const handleRemove = async (selectedRows: any, actionRef: any) => {
  if (!selectedRows) return true;
  const hide = message.loading('正在删除');
  try {
    await deletStaff({ user: selectedRows.map((row: any) => row._id)[0] });
    hide();
    if (actionRef.current) {
      actionRef.current.reload();
    }
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};
export default (props: any) => {
  const [visiable, setVisiable] = useState<boolean>(false);
  const [isEditStatus, setIsEditStatus] = useState<boolean>(false);
  const [title, setTitle] = useState('创建员工');
  const [iseditkey, setIseditKey] = useState<number>();
  const [isEditData, setIsEditData] = useState<tabProps>();
  const [sureLoading, setSureLoading] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 编辑数据的操作
  const isEditFunction = (key: any) => {
    setIsEditData(key);
    setIseditKey(key);
    setTitle('编辑员工');
    setIsEditStatus(true);
    setVisiable(true);
  };
  //关闭模态款
  const closeModal = () => {
    setVisiable(false);
    setIsEditData(undefined);
  };
  //开启模态款
  const openModal = () => {
    setTitle('创建员工');
    setIsEditStatus(false);
    setVisiable(true);
    setIsEditData(undefined);
  };
  //新增员工和修改员工
  const updateStaffFunction = useCallback(async (value) => {
    try {
      setSureLoading(true);
      await updateStaff({ account: value.account, password: value.password, role: value.role });
      setSureLoading(false);
      closeModal();
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } catch (err) {
      closeModal();
      setSureLoading(false);
    }
  }, []);
  const onFinishFunction = useCallback(
    (value: formProps, isEdit: number | undefined) => {
      updateStaffFunction(value);
    },
    [closeModal, updateStaffFunction],
  );
  //表格表头设置
  const columns: any = [
    {
      title: '员工账号',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '角色',
      dataIndex: 'role',
      align: 'center',
      valueType: 'option',
    },
    {
      title: '创建时间',
      className: 'time',
      align: 'center',
      dataIndex: 'createTime',
      valueType: 'option',
    },
    {
      title: '修改时间',
      className: 'time',
      align: 'center',
      dataIndex: 'updateTime',
      valueType: 'option',
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'operation',
      valueType: 'option',
      render: (text: string, record: any) => (
        <>
          <a
            onClick={() => {
              isEditFunction(record);
            }}
          >
            {text[0]}
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="是否要删除该员工"
            onConfirm={() => {
              handleRemove([record], actionRef);
            }}
          >
            <a type="primary">{text[1]}</a>
          </Popconfirm>
        </>
      ),
    },
  ];
  return (
    <PageHeaderWrapper>
      <ProTable
        columns={columns}
        request={(params) => queryRule(params)}
        actionRef={actionRef}
        bordered
        rowKey="key"
        toolBarRender={(action, { selectedRows }) => [
          <Button type="primary" size="large" icon={<PlusOutlined />} onClick={openModal}>
            新增员工
          </Button>,
        ]}
        headerTitle="员工管理"
        pagination={{ pageSize: 10 }}
      ></ProTable>
      <ElasticLayer
        isEdit={isEditStatus}
        onFinishFunction={onFinishFunction}
        visiable={visiable}
        title={title}
        cancelFunction={closeModal}
        editNumber={iseditkey}
        isEditData={isEditData}
        loading={sureLoading}
      ></ElasticLayer>
    </PageHeaderWrapper>
  );
};
