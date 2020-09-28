import { getDvaApp } from 'umi';
import { ConnectState } from '@/models/connect';

export function getToken(): { accessToken: string; refreshToken: string } | undefined {
  let { user, autoLogin } = getDvaApp()._store.getState() as ConnectState;

  return autoLogin
    ? { accessToken: autoLogin.accessToken, refreshToken: autoLogin.refreshToken }
    : user
    ? { accessToken: user.accessToken, refreshToken: user.refreshToken }
    : undefined;
}

export function getRefreshToken(): string | undefined {
  let token = getToken();
  return token && token.refreshToken;
}

export function getAccessToken(): string | undefined {
  let token = getToken();
  return token && token.accessToken;
}

/**
 * 格式化 token
 *
 * @param {(string | undefined)} token
 * @returns {string}
 */
export const formatBearerToken = function (token: string | undefined): string {
  return 'Bearer ' + (token || '').trim();
};
