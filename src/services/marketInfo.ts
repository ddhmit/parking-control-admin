import request from '@/utils/request';
import appUrl from '@/config/appUrl';
import { AppResponse, AppListData } from '@/models/response';
import { MarketInfoType } from 'umi';

export async function getMarketInfo(params?: any): Promise<MarketInfoType | undefined> {
  try {
    let res = (await request(appUrl.RequestMarketInfoUrl, {
      method: 'POST',
      data: params,
    })) as AppResponse<AppListData<MarketInfoType>>;
    if (!res.data) return undefined;
    return res.data.docs[0];
  } catch (err) {
    // throw err;
    return undefined;
  }
}
