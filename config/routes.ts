import { UserRole } from './role';
import { AppMarketName } from '../src/config/marketId';

// umi routes: https://umijs.org/docs/routing
const routes = [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    name: AppMarketName,
    // component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            path: '/user',
            redirect: '/user/login',
          },
          {
            name: 'login',
            icon: 'smile',
            path: '/user/login',
            component: './user/login',
          },
          // {
          //   name: 'register-result',
          //   icon: 'smile',
          //   path: '/user/register-result',
          //   component: './user/register-result',
          // },
          // {
          //   name: 'register',
          //   icon: 'smile',
          //   path: '/user/register',
          //   component: './user/register',
          // },
          {
            component: '404',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        authority: [UserRole.admin, UserRole.user, UserRole.guard],
        routes: [
          // 商户管理部分
          {
            path: '/shop',
            name: 'shop',
            icon: 'ShopOutlined',
            authority: [UserRole.admin, UserRole.user],
            routes: [
              {
                name: 'allShops',
                icon: 'smile',
                path: '/shop/allShops',
                component: './shop/allShops',
              },
              {
                name: 'review',
                icon: 'CheckCircleOutlined',
                path: '/shop/review',
                component: './shop/review',
              },
              {
                name: 'charge',
                icon: 'MoneyCollectOutlined',
                path: '/shop/charge',
                component: './shop/charge',
                // disabled: true,
                hideInMenu: true,
              },
              {
                name: 'point',
                icon: 'SearchOutlined',
                path: '/shop/point',
                component: './shop/point',
                // disabled: true,
                // hideInMenu: true,
              },
              {
                component: '404',
              },
            ],
          },
          // 车辆管理部分
          {
            path: '/car',
            icon: 'car',
            name: 'car',
            routes: [
              {
                name: 'shopCars',
                icon: 'car',
                path: '/car/shopCars',
                component: './car/shopCars',
                authority: [UserRole.admin, UserRole.user],
              },
              {
                name: 'marketCars',
                icon: 'car',
                path: '/car/marketCars',
                component: './car/marketCars',
                authority: [UserRole.admin, UserRole.user],
              },
              {
                name: 'record',
                icon: 'car',
                path: '/car/record',
                component: './car/record',
                // disabled: true,
                // hideInMenu: true,
              },
              {
                name: 'loadingUnloadingRecords',
                icon: 'car',
                path: '/car/loadingUnloadingRecords',
                component: './car/loadingUnloadingRecords',
              },
              {
                component: '404',
              },
            ],
          },
          // 收费标准部分
          {
            path: '/chargeStandard',
            icon: 'table',
            name: 'chargeStandard',
            component: './chargeStandard',
            authority: [UserRole.admin, UserRole.user],
            // disabled: true,
            // hideInMenu: true,
          },
          // 客服管理部分
          {
            name: 'customerService',
            icon: 'UserOutlined',
            path: '/customerService',
            component: './customerService',
            authority: [UserRole.admin],
          },
          // 开闸部分
          {
            name: 'switch',
            icon: 'AlertOutlined',
            path: '/switch',
            component: './switch',
            authority: [UserRole.admin, UserRole.guard],
          },
          {
            name: 'operationAndMaintenance',
            icon: 'UserOutlined',
            path: '/maintenance',
            routes: [
              {
                name: 'carNoZero',
                icon: 'car',
                path: '/maintenance/carNoZero',
                component: './maintenance/carNoZero',
              },
            ],
          },
          {
            name: 'exception',
            icon: 'warning',
            path: '/exception',
            routes: [
              {
                name: '403',
                icon: 'smile',
                path: '/exception/403',
                component: './exception/403',
              },
              {
                name: '404',
                icon: 'smile',
                path: '/exception/404',
                component: './exception/404',
              },
              {
                name: '500',
                icon: 'smile',
                path: '/exception/500',
                component: './exception/500',
              },
            ],
          },
          {
            name: 'account',
            icon: 'user',
            path: '/account',
            /*  routes: [
              {
                name: 'center',
                icon: 'smile',
                path: '/account/center',
                component: './account/center',
              },
              {
                name: 'settings',
                icon: 'smile',
                path: '/account/settings',
                component: './account/settings',
              },
            ], */
          },

          {
            path: '/',
            redirect: '/shop/allShops',
            authority: [UserRole.admin, UserRole.user],
          },
          {
            component: '404',
          },
        ],
      },
    ],
  },
];
/* 超管不显示的菜单项 */
export const MenuExceptions: string[] = ['/exception', '/account'];
/* 客服不显示的菜单项 */
// export const UserMenuExceptions: string[] = [...MenuExceptions, '/customerService'];

export default routes;
