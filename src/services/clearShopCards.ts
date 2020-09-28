import request from '@/utils/request';
import appUrl from '@/config/appUrl';

export default async function (params: any) {
  return request(appUrl.ClearShopCards, {
    method: 'POST',
    data: params,
  });
}
