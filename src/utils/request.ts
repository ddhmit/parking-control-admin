/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { getDvaApp } from 'umi';
import { extend, ResponseError } from 'umi-request';
import { notification, Modal } from 'antd';
import appUrl from '@/config/appUrl';
import { refreshToken } from '@/services/refreshToken';
import { getAccessToken, formatBearerToken } from './token';
import env from '@/utils/env';
// import { refreshToken } from '@/services/refreshToken';
// import appUrl from '@/config/appUrl';

/* const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
}; */

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError<any>): Response => {
  const { response } = error;

  if (response && response.status) {
    // const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    // @ts-ignore
    let msg = response.customStatusText;
    if (!env.isProd()) {
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: msg,
      });
    } else {
      notification.error({
        message: `请求错误`,
        description: msg,
      });
    }
  } else if (!response) {
    // console.log('no response ', error.type);
    if (error.type === 'Timeout') {
      notification.error({
        message: '系统升级中， 请稍安勿躁',
        description: '请稍后再试',
      });
    } else {
      notification.error({
        message: '网络异常',
        description: '您的网络发生异常，无法连接服务器',
      });
    }
  }
  throw response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  prefix: appUrl.BaseUrl,
  errorHandler, // 默认错误处理
  timeout: appUrl.Timeout,
  // credentials: 'include', // 默认请求是否带上cookie
});

/* 请求拦截 */
request.interceptors.request.use((url, options) => {
  let token = getAccessToken();
  return {
    url: url,
    options: {
      ...options,
      headers: {
        ...options.headers,
        ...(token && {
          Authorization: formatBearerToken(token),
        }),
      },
    },
  };
});
/* 响应拦截器 */
let refreshing: boolean = false;
let showModal = false;
request.interceptors.response.use(async (response, options) => {
  // console.log('请求 interceptors response ', response);
  if (location.pathname !== '/user/login') {
    if (response.status === 401) {
      if (!refreshing) {
        refreshing = true;
        try {
          let token = await refreshToken();
          if (token) {
            refreshing = false;
            getDvaApp()._store.dispatch({ type: 'user/updateToken', payload: token });
            try {
              // 防止重新请求的报错导致页面跳转登录
              return await request(response.url, {
                ...options,
                prefix: response.url.startsWith('http') ? undefined : options.prefix,
                headers: {
                  ...options.headers,
                  // Authorization: `Bearer ${token.accessToken}`,
                  Authorization: formatBearerToken(token.accessToken),
                },
              });
            } catch (err) {
              console.error(err);
            }
          } else {
            refreshTokenErrorHandle('更新权限出错，将前往登录页面重新登录');
          }
        } catch (err) {
          refreshing = false;
          console.error(err);
          // refreshTokenErrorHandle('更新权限出错，将前往登录页面重新登录');
        }
      } else {
        let accessToken = getAccessToken();
        if (accessToken)
          return await request(response.url, {
            ...options,
            headers: {
              ...options.headers,
              // Authorization: `Bearer ${accessToken}`,
              Authorization: formatBearerToken(accessToken),
            },
          });
      }
    } else if (response.status === 410 && !showModal) {
      refreshTokenErrorHandle();
    }
  }

  // 替换 status text
  if (response.status !== 200) {
    let res = await response.json();
    // @ts-ignore
    response.customStatusText = (res && res.msg) || response.statusText;
  }

  return response;
});

export default request;

function ShowCountDownModal(
  timeout: number = 3,
  onOk: () => void,
  title: string = '用户权限已过期，请点击确定重新登录',
) {
  if (window.location.pathname === '/user/login') return;
  let secondsToGo = timeout;
  let closeTimer: NodeJS.Timeout;
  const modal = Modal.warning({
    title: title,
    content: `弹窗将在 ${secondsToGo} 秒后自动跳转登录页面`,
    onOk: function () {
      closeTimer && clearTimeout(closeTimer);
      timer && clearInterval(timer);
      onOk();
    },
  });
  const timer = setInterval(() => {
    secondsToGo -= 1;
    modal.update({
      content: `弹窗将在 ${secondsToGo} 秒后自动跳转登录页面`,
    });
  }, 1000);
  closeTimer = setTimeout(() => {
    onOk();
    timer && clearInterval(timer);
    modal.destroy();
  }, secondsToGo * 1000);
}

function refreshTokenErrorHandle(title?: string) {
  if (showModal) return;
  showModal = true;
  ShowCountDownModal(5, () => {
    showModal = false;
    getDvaApp()._store.dispatch({ type: 'login/logout' }, title);
  });
}
