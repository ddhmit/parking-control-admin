import { Reducer } from 'umi';
import { LoginAccount } from '@/models/login';
import { Effect } from 'dva';
import { ConnectState } from './connect';
export type UserModelState = LoginAccount;
export interface UserModelType {
  namespace: 'user';
  state: UserModelState | null;
  effects: {
    /* fetch: Effect;
    fetchCurrent: Effect; */
    updateToken: Effect;
    syncUserWithAutoLogin: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    removeCurrentUser: Reducer<null>;
    // changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: null,

  effects: {
    //   *fetch(_, { call, put }) {
    //     const response = yield call(queryUsers);
    //     yield put({
    //       type: 'save',
    //       payload: response,
    //     });
    //   },
    //   *fetchCurrent(_, { call, put }) {
    //     const response = yield call(queryCurrent);
    //     yield put({
    //       type: 'saveCurrentUser',
    //       payload: response,
    //     });
    //   },
    *updateToken({ payload }, { put, select }) {
      let { user } = yield select((state: ConnectState) => state);
      if (user) {
        yield put({
          type: 'syncUserWithAutoLogin',
          payload: {
            ...user,
            ...payload,
          },
        });
      }
    },
    *syncUserWithAutoLogin({ payload }, { put, select }) {
      // 如果存在自动登录， 才需要更新 login 部分
      let { user, autoLogin } = yield select((state: ConnectState) => state);
      if (autoLogin) {
        yield put({
          type: 'autoLogin/setAutoLogin',
          payload: payload,
        });
      }
      if (user) {
        yield put({
          type: 'saveCurrentUser',
          payload: payload,
        });
      }
    },
  },

  reducers: {
    saveCurrentUser(_, action) {
      return {
        ...(action.payload || {}),
      };
    },
    removeCurrentUser() {
      return null;
    },
    // changeNotifyCount(state , action) {
    //   return {
    //     ...state,
    //     // currentUser: {
    //     //   ...state.currentUser,
    //     //   notifyCount: action.payload.totalCount,
    //     //   unreadCount: action.payload.unreadCount,
    //     // },
    //   };
    // },
  },
};

export default UserModel;
