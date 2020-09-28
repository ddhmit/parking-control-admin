// import { Tooltip, Tag } from 'antd';
import { Tag, message } from 'antd';
// import { QuestionCircleOutlined } from '@ant-design/icons';
import React, { useCallback, useState } from 'react';
import { connect, ConnectProps } from 'umi';
import { ConnectState } from '@/models/connect';
import Avatar from './AvatarDropdown';
import ChangePWDModal from './ChangePWDModal';
import { changePWD as requestChangePWD } from '@/services/login';
// import HeaderSearch from '../HeaderSearch';
// import SelectLang from '../SelectLang';
import styles from './index.less';

// import NoticeIconView from './NoticeIconView';

export type SiderTheme = 'light' | 'dark';

export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  theme?: SiderTheme;
  layout: 'sidemenu' | 'topmenu';
}
const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = (props) => {
  const { theme, layout } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }

  const [changePWDVisible, setChangePWDVisible] = useState(false);
  const [changePWDLoading, setChangePWDLoading] = useState(false);

  const changePWD = useCallback(async (fields: any) => {
    setChangePWDLoading(true);
    try {
      await requestChangePWD(fields);
      message.success('密码修改成功');
      setChangePWDVisible(false);
    } catch (err) {
      message.error(`修改密码失败：${err.customStatusText}`);
    } finally {
      setChangePWDLoading(false);
    }
  }, []);

  const changePWDCancel = useCallback(() => {
    setChangePWDVisible(false);
  }, []);

  const openChangePWD = useCallback(() => {
    setChangePWDVisible(true);
  }, []);

  return (
    <div className={className}>
      {/* 关闭搜索 */}
      {/* <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        defaultValue="umi ui"
        options={[
          {
            label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>,
            value: 'umi ui',
          },
          {
            label: <a href="next.ant.design">Ant Design</a>,
            value: 'Ant Design',
          },
          {
            label: <a href="https://protable.ant.design/">Pro Table</a>,
            value: 'Pro Table',
          },
          {
            label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
            value: 'Pro Layout',
          },
        ]} // onSearch={value => {
        //   //console.log('input', value);
        // }}
      /> */}
      {/* 关闭使用文档 */}
      {/*  <Tooltip title="使用文档">
        <a
          target="_blank"
          href="https://pro.ant.design/docs/getting-started"
          rel="noopener noreferrer"
          className={styles.action}
        >
          <QuestionCircleOutlined />
        </a>
      </Tooltip> */}
      {/* 关闭通知 */}
      {/*  <NoticeIconView /> */}
      {/* 关闭个人中心和设置入口 */}
      <Avatar menu={false} onChangePWD={openChangePWD} />
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
      {/* 关闭语言切换 */}
      {/* <SelectLang className={styles.action} /> */}
      {/* 修改密码 */}
      <ChangePWDModal
        visible={changePWDVisible}
        onCancel={changePWDCancel}
        onOk={changePWD}
        confirmLoading={changePWDLoading}
      />
    </div>
  );
};

export default connect(({ settings }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
