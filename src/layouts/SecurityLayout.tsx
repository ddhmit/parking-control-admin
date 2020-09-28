import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect, connect, ConnectProps } from 'umi';
import { stringify } from 'querystring';
import { getDvaApp } from 'umi';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { ConnectState } from '@/models/connect';
import { UserModelState } from '@/models/user';
import { AutoLoginState } from '@/models/autoLogin';
import { getAccessToken } from '@/utils/token';

interface SecurityLayoutProps extends ConnectProps {
  loading?: boolean;
  user?: UserModelState;
  autoLogin?: AutoLoginState;
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
  }

  render() {
    const { isReady } = this.state;
    const { children, loading } = this.props;
    // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    // const isLogin = user && user._id;
    const isLogin = !!getAccessToken();
    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      console.log(' page loading -- ');
      return <PageLoading />;
    }
    if (!isLogin && window.location.pathname !== '/user/login') {
      console.log(' redirect login -- ');

      return <Redirect to={`/user/login?${queryString}`} />;
    }
    return (
      <PersistGate persistor={persistStore(getDvaApp()._store)} loading={<PageLoading />}>
        {children}
      </PersistGate>
    );
  }
}

export default connect(({ user, loading, autoLogin }: ConnectState) => ({
  user: user,
  loading: loading.models.login,
  autoLogin,
}))(SecurityLayout);
