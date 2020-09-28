import { Reducer } from 'umi';
import { Effect } from 'dva';
import { getMarketInfo } from '@/services/marketInfo';

export interface MarketInfoType {
  businessLicense: {
    creditCode: string;
    photo: string;
  };
  enable: boolean;
  car: any[];
  _id: string;
  name: string;
  staff: any[];
  createdAt: string;
  updatedAt: string;
  expired: string;
  user: string;
}

export interface MarketInfoModelType {
  namespace: string;
  state?: MarketInfoType | null;
  effects: {
    getMarketInfo: Effect;
  };
  reducers: {
    setMarketInfo: Reducer<MarketInfoType>;
    removeMarketInfo: Reducer<null>;
  };
}

const Model: MarketInfoModelType = {
  namespace: 'marketInfo',
  state: null,
  effects: {
    *getMarketInfo(_, { call, put }) {
      let marketInfo = yield call(getMarketInfo);
      if (marketInfo) {
        yield put({ type: 'setMarketInfo', payload: marketInfo });
      }
    },
  },
  reducers: {
    setMarketInfo(state, { payload }) {
      return payload;
    },
    removeMarketInfo() {
      return null;
    },
  },
};

export default Model;
