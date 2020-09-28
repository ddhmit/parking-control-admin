import request from '@/utils/request';
import appUrl from '@/config/appUrl';
interface paramsProps {
  merchant: string | undefined;
  num: string;
}
export default async function (params: paramsProps) {
  return request(appUrl.ShopBindCards, {
    method: 'POST',
    data: params,
  });
}
