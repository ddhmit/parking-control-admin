import request from '@/utils/request';
import appUrl from '@/config/appUrl';
import moment from 'moment';
import { regux } from '../../car/shopCars/compontents/data';
export async function clearMaintenance(params: any) {
  return request(appUrl.Maintenance, {
    data: params,
    method: 'POST',
  });
}
export async function VehicleAccessRecord(params?: any) {
  try {
    delete params._timestamp;
    let queryParm = {
      limit: params.limit ? params.limit : 10,
      page: params.page,
      search: regux.test(params.carNo)
        ? { carNo: [params.carNo] }
        : {
            _id: [params.carNo],
          },
    };
    let res: any = await request(appUrl.VehicleAccessRecord, {
      method: 'POST',
      data: queryParm,
    });

    let data = res.data.docs.map((item: any, index: any, arr: any[]) => {
      return {
        type: item.car.type,
        createdAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        outAt: item.outAt ? moment(item.outAt).format('YYYY-MM-DD HH:mm:ss') : '未出市场',
        carNo: item.car.type === '三轮车' ? item._id : item.car.info.result.PlateResult.license,
        key: index,
        info: item.car.info, // 抓拍机和 IP 栏使用的数据源
        id: item._id,
      };
    });
    return {
      data: data,
      // total: res.data.totalDocs,
      // 传递了上一页最后一条 id 后，totalDocs 个数不对
      total: res.data.totalDocs,
      // current: 1,
      // 返回正确的 current
      current: params.current,
    };
  } catch (err) {
    throw err;
  }
}
