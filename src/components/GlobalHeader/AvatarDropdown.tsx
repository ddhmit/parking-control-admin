import { LogoutOutlined, SettingOutlined, UserOutlined, EditOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React from 'react';
import { history, ConnectProps, connect } from 'umi';
import { ConnectState } from '@/models/connect';
import { UserModelState } from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import avatarImg from '@/assets/defaultAvatar.png';
import { getAuthority } from '@/utils/authority';
import { UserRole } from '@/config/role';

export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  currentUser?: UserModelState;
  menu?: boolean;
  onChangePWD: () => void;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: any) => {
    const { key } = event;
    const { onChangePWD } = this.props;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    } else if (key === 'changepwd') {
      onChangePWD();
      return;
    }

    history.push(`/account/${key}`);
  };

  render(): React.ReactNode {
    let authority = getAuthority();
    const isSuperAdmin = Array.isArray(authority)
      ? authority.includes(UserRole.admin)
      : authority === UserRole.admin;

    const {
      currentUser = {
        avatar: '',
        account: '',
      },
      menu,
    } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <UserOutlined />
            个人中心
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <SettingOutlined />
            个人设置
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}
        {isSuperAdmin && (
          <Menu.Item key="changepwd">
            <EditOutlined />
            修改密码
          </Menu.Item>
        )}
        {isSuperAdmin && <Menu.Divider />}
        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.account ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={avatarImg} alt="avatar" />
          <span className={styles.name}>{currentUser.account}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
  }
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user,
}))(AvatarDropdown);
