import { Reducer, LoginAccount } from 'umi';

export type AutoLoginState = LoginAccount;

export interface AutoLoginStateModelType {
  namespace: string;
  state?: AutoLoginState | null;

  reducers: {
    setAutoLogin: Reducer<AutoLoginState | null>;
    removeAutoLogin: Reducer<null>;
  };
}

const Model: AutoLoginStateModelType = {
  namespace: 'autoLogin',
  state: null,
  reducers: {
    setAutoLogin(_, { payload }) {
      if (payload && payload.accessToken) {
        return {
          ...payload,
        };
      }
      return null;
    },
    removeAutoLogin() {
      return null;
    },
  },
};

export default Model;
