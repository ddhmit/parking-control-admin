import appUrl from '../src/config/appUrl';
/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/api/': {
      // target: 'http://192.168.101.151:7002',
      target: appUrl.BaseUrl,
      changeOrigin: true,
      // pathRewrite: { '^': '' },
    },

    // '/ipCamera': {
    //   target: 'http://192.168.101.151:7002',
    //   changeOrigin: true,
    //   // pathRewrite: { '^': '' },
    // },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
