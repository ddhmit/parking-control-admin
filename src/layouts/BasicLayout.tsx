/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  // SettingDrawer,
} from '@ant-design/pro-layout';
import React, { useEffect, ReactElement } from 'react';
// @ts-ignore
import { Link, useIntl, connect, Dispatch, MarketInfoType } from 'umi';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import BasicFooter from '@/components/BasicFooter';
import { ConnectState } from '@/models/connect';
import { AutoLoginState } from '@/models/autoLogin';
import { UserModelState } from '@/models/user';
import { getAuthorityFromRouter } from '@/utils/utils';
import { getAccessToken } from '@/utils/token';
import { MenuExceptions } from '../../config/routes';
// import env from '@/utils/env';

const NoMatch: React.FC<any> = connect()(({ dispatch }: { dispatch: Dispatch }) => {
  return (
    <Result
      status={403}
      title="403"
      subTitle="您无权访问该页面，请切换超管账号登录."
      extra={
        <Button
          type="primary"
          onClick={() => {
            dispatch({ type: 'login/logout' });
          }}
        >
          {/* <Link to="/user/login">去登陆</Link> */}
          去登陆
        </Button>
      }
    />
  );
});
export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
  autoLogin: AutoLoginState;
  user: UserModelState;
  marketInfo: MarketInfoType;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};
/**
 * use Authorized check all menu item
 */

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  // 过滤不在 menu 中渲染的路由配置
  {
    return menuList
      .filter((item) => {
        return !MenuExceptions.includes(item.path || '');
      })
      .map((item) => {
        const localItem = {
          ...item,
          children: item.children ? menuDataRender(item.children) : [],
        };
        return Authorized.check(item.authority, localItem, null) as MenuDataItem;
      });
  };
const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    autoLogin,
    user,
    marketInfo,
  } = props;

  /* 自动登录 */
  useEffect(() => {
    if (dispatch && autoLogin && !user) {
      dispatch({
        type: 'user/saveCurrentUser',
        payload: { ...autoLogin },
      });
    } else if ((!autoLogin || !autoLogin.accessToken) && !user && dispatch) {
      dispatch({
        type: 'login/logout',
      });
    }
  }, [autoLogin, user, dispatch]);

  /* 获取市场信息 */
  useEffect(() => {
    if (dispatch && getAccessToken()) {
      dispatch({
        type: 'marketInfo/getMarketInfo',
      });
    }
  }, [dispatch]);
  /**
   * init variables
   */

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  const { formatMessage } = useIntl();
  return (
    <>
      <ProLayout
        logo={'/icons/icon-512x512.png'}
        formatMessage={formatMessage}
        menuHeaderRender={(logoDom, titleDom) => {
          if (titleDom && (titleDom as ReactElement).props && marketInfo && marketInfo.name) {
            titleDom = React.cloneElement(titleDom as ReactElement, { children: marketInfo.name });
          }
          return (
            <Link to="/">
              {/* 关闭 logo 渲染 */}
              {logoDom}
              {titleDom}
            </Link>
          );
        }}
        onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
            return defaultDom;
          }
          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          // return defaultDom;
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: formatMessage({
              id: 'menu.home',
            }),
          },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        footerRender={() => <BasicFooter expired={marketInfo && marketInfo.expired} />}
        menuDataRender={menuDataRender}
        rightContentRender={() => <RightContent />}
        {...props}
        {...settings}
        title={settings.title ? settings.title : (marketInfo && marketInfo.name) || ''}
      >
        <Authorized authority={authorized!.authority} noMatch={<NoMatch />}>
          {children}
        </Authorized>
      </ProLayout>
      {/* 生成环境不显示，该组件没有按照文档说明一样关闭，所以手动关闭 */}
      {/* {env.isProd() ? null : (
        <SettingDrawer
          settings={settings}
          onSettingChange={(config) =>
            dispatch({
              type: 'settings/changeSetting',
              payload: config,
            })
          }
        />
      )} */}
    </>
  );
};

export default connect(({ global, settings, autoLogin, user, marketInfo }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
  autoLogin,
  user,
  marketInfo,
}))(BasicLayout);
