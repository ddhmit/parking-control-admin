import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';
import { pick } from 'lodash';

import { accountLogin } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { UserRole } from '@/config/role';
import { AppResponse } from './response';
import { AppMarketId } from '@/config/marketId';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  // currentAuthority?: 'user' | 'guest' | 'admin';
  currentAuthority?: UserRole;
  msg?: string;
}

export interface LoginAccount {
  _id: string;
  account: string;
  createdAt: string;
  market: string;
  updatedAt: string;
  accessToken: string;
  refreshToken: string;
  identity: {
    marketId: string;
    [UserRole.admin]: boolean;
    [UserRole.user]: boolean;
  };
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
    removeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      let params = pick(payload, ['account', 'password', 'market']);
      // 项目中写死的市场 id 参数
      params.market = AppMarketId;
      const { data, msg }: AppResponse<LoginAccount> = yield call(accountLogin, params);
      const currentAuthority = !data
        ? UserRole.guest
        : data.identity[UserRole.admin]
        ? UserRole.admin
        : data.identity[UserRole.guard] // 保安优先级高于市场员工
        ? UserRole.guard
        : data.identity[UserRole.user]
        ? UserRole.user
        : UserRole.guest;
      yield put({
        type: 'changeLoginStatus',
        payload: {
          // status: code === 0 && currentAuthority !== UserRole.guest ? 'ok' : 'error',
          status: data && currentAuthority !== UserRole.guest ? 'ok' : 'error',
          type: payload.type,
          currentAuthority,
          msg,
        },
      });
      // Login successfully
      // if (code === 0 && data) {
      if (data) {
        // 记录用户数据部分
        yield put({
          type: 'user/saveCurrentUser',
          payload: data,
        });
        // 自动登录部分
        if (payload.autoLogin) {
          // 自动登录记录
          yield put({
            type: 'autoLogin/setAutoLogin',
            payload: data,
          });
        } else {
          yield put({
            type: 'autoLogin/removeAutoLogin',
            payload: null,
          });
        }
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
            // 防止客服身份跳转到客服管理页面 / 开闸页面导致 403
            if (
              currentAuthority === UserRole.user &&
              (redirect.endsWith('/customerService') || redirect.endsWith('/switch'))
            ) {
              redirect = '/';
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
      }
    },

    *logout(_, { put }) {
      // 清除当前自动登录数据
      yield put({
        type: 'autoLogin/removeAutoLogin',
      });
      // 清除当前用户数据
      yield put({
        type: 'user/removeCurrentUser',
      });
      // 清除当前登录状态
      yield put({
        type: 'removeLoginStatus',
      });
      // 清除当前市场数据
      yield put({
        type: 'marketInfo/removeMarketInfo',
      });

      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        msg: payload.msg,
      };
    },
    removeLoginStatus(state) {
      setAuthority(undefined);
      return {
        status: undefined,
      };
    },
  },
};

export default Model;
