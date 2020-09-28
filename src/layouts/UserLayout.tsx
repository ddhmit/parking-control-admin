import { MenuDataItem, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, useIntl, ConnectProps, connect } from 'umi';
import React from 'react';
// import SelectLang from '@/components/SelectLang';
import BasicFooter from '@/components/BasicFooter';

import { ConnectState } from '@/models/connect';
// import logo from '../assets/logo.svg';
import styles from './UserLayout.less';
import { AppMarketName } from '@/config/marketId';

export interface UserLayoutProps extends Partial<ConnectProps> {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}

const UserLayout: React.FC<UserLayoutProps> = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={`${AppMarketName}`} />
        <meta name="keywords" content={`${AppMarketName}`} />
      </Helmet>

      <div className={styles.container}>
        {/* 关闭语言选择 */}
        {/*  <div className={styles.lang}>
          <SelectLang />
        </div> */}
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                {/* <img alt="logo" className={styles.logo} src={logo} /> */}
                <span className={styles.title}>欢迎登录{`${AppMarketName}`}</span>
              </Link>
            </div>
          </div>
          {children}
        </div>
        <BasicFooter />
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);
