import request from '@/utils/request';
import appUrl from '@/config/appUrl';
import { AppResponse } from '@/models/response';
import { getRefreshToken } from '@/utils/token';

interface ResfreshTokenResult {
  accessToken: string;
  refreshToken: string;
}

export async function refreshToken(): Promise<ResfreshTokenResult | undefined> {
  let refreshToken = getRefreshToken();
  let res = await request.post<AppResponse<ResfreshTokenResult>>(appUrl.RefreshTokenUrl, {
    data: {
      refreshToken,
    },
  });
  // console.log(' refresh token 响应值', res);
  return res.data;
}
