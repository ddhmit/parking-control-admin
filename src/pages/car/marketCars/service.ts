import request from '@/utils/request';
import appUrl from '@/config/appUrl';
import moment from 'moment';
export async function getMarket(params: any) {
  try {
    let param = {
      page: params.current,
      limit: params.pageSize,
      search: params.num ? { num: [params.num] } : {},
    }; //传递的参数
    let obj = await request(appUrl.RequestMarketInfoUrl, { method: 'POST', data: param });
    //对数据进行处理
    if (obj.data.docs) {
      let data = obj.data.docs[0].car.map((item: any, index: any) => {
        return {
          num: item.num,
          expired: item.expired ? moment(item.expired).format('YYYY-MM-DD HH:mm:ss') : '',
          createdAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
          text: item.expired ? '否' : '是',
          key: index,
        };
      });
      return {
        data: data,
        total: data.length,
        current: obj.data.page,
      };
    } else {
      return {
        data: [],
        total: 0,
        current: 1,
      };
    }
  } catch (err) {
    throw err;
  }
}
export async function bingMarketCar(params: any) {
  return request(appUrl.MarketBindCars, { method: 'Post', data: params });
}

export async function clearMarketCar(params: any) {
  return request(appUrl.MarketClearCars, { method: 'Post', data: params });
}
