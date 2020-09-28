import request from '@/utils/request';
import appUrl from '@/config/appUrl';

export interface LoginParamsType {
  account: string;
  password: string;
  // mobile: string;
  // captcha: string;
}

// export async function fakeAccountLogin(params: LoginParamsType) {
//   return request('/api/login/account', {
//     method: 'POST',
//     data: params,
//   });
// }

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function accountLogin(params: LoginParamsType) {
  try {
    return await request(appUrl.LoginUrl, {
      method: 'POST',
      data: params,
    });
  } catch (err) {
    return { data: null, msg: err ? err.customStatusText : '您的网络发生异常，请重新尝试' };
  }
}

export interface ChangePWDParamsType {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export function changePWD(params: ChangePWDParamsType) {
  return request(appUrl.ChangePWDUrl, {
    method: 'POST',
    data: params,
  });
}
