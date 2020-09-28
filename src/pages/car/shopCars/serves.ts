import request from '@/utils/request';
import appUrl from '@/config/appUrl';
import moment from 'moment';
async function getShop(params?: any) {
  try {
    let paramsPost = {
      limit: params.pageSize,
      page: params.current,
      search: params.name
        ? {
            name: [params.name],
          }
        : {},
    };
    let res: any = await request(appUrl.RequestShopListUrl, { method: 'POST', data: paramsPost });
    if (res.data.docs.length !== 0) {
      let data = res.data.docs.map((item: any, index: any) => {
        return {
          name: item.name,
          length: item.car.length,
          car: item.car,
          id: item._id,
          key: index,
        };
      });
      return { data: data, total: res.data.totalDocs, current: res.data.page };
    } else {
      return {
        data: [],
        total: 0,
        current: 0,
      };
    }
  } catch (err) {
    return {
      data: [],
      total: 0,
      current: 0,
    };
  }
}
async function getShopCar(params?: any) {
  try {
    delete params.current;
    delete params.pageSize;
    let res: any = await request(appUrl.RequestShopListUrl, { method: 'POST', data: params });
    if (res.data.docs.length !== 0) {
      let data = res.data.docs[0].car.map((item: any, index: any) => {
        return {
          num: item.num,
          expired: item.expired ? moment(item.expired).format('YYYY-MM-DD HH:mm:ss') : '',
          createdAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
          key: index,
          text: item.expired ? '否' : '是',
        };
      });
      return { data: data, total: data.length, current: 1 };
    }
    return {
      data: [],
      total: 0,
      current: 0,
    };
  } catch (err) {
    throw err;
  }
}
export { getShop, getShopCar };
