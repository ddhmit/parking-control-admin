import request from '@/utils/request';
import appUrl from '@/config/appUrl';

export default async function (params: any) {
  return request(appUrl.UpdateStaff, {
    method: 'POST',
    data: params,
  });
}
