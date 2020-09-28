import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import env from './utils/env';

const disableReactDevTools = () => {
  const noop = () => undefined;
  const DEV_TOOLS = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (typeof DEV_TOOLS === 'object') {
    for (const [key, value] of Object.entries(DEV_TOOLS)) {
      DEV_TOOLS[key] = typeof value === 'function' ? noop : null;
    }
  }
};

/**
 * 生产环境关闭 react devtool
 */
if (env.isProd()) {
  disableReactDevTools();
}

const persistConfig = {
  timeout: 1000, // you can define your time. But is required.
  key: 'root',
  storage,
  whitelist: ['autoLogin', 'marketInfo'],
};

const persistEnhancer = () => (createStore) => (reducer, initialState, enhancer) => {
  const store = createStore(persistReducer(persistConfig, reducer), initialState, enhancer);
  const persist = persistStore(store, null);
  return {
    persist,
    ...store,
  };
};

export const dva = {
  config: {
    onError(e) {
      e.preventDefault();
      console.error(e.message);
    },
    extraEnhancers: [persistEnhancer()],
  },
  plugins: [
    // require('dva-logger')(),
  ],
};
