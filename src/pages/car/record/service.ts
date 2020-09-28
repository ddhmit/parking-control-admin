import request from '@/utils/request';
import appUrl from '@/config/appUrl';
import moment from 'moment';
import { regux } from '../shopCars/compontents/data';
import { message } from 'antd';
import { getPlateType } from '../../switch/util/index';
import {
  formatCarRecordListParams,
  CarRecordParamsManager,
  processCarRecordOtherParams,
} from '../utils';

let cpm = new CarRecordParamsManager();
const messageFunction = () => {
  message.error('请至少包含一个查询条件');
  return {
    total: 0,
    data: [],
    current: 0,
  };
};
export async function VehicleAccessRecord(params?: any) {
  delete params.name;
  // 获取记录的 key
  let lastId = cpm.getID(params.current - 1, processCarRecordOtherParams(params));
  // // 获取对应页面对应 params 的最后一个 id
  let pageObj = {
    ...(lastId && {
      perpage_last_id: lastId,
    }),
  };
  try {
    delete params._timestamp;
    if (params.createdAt === undefined && params.carNo === undefined) {
      let obj = messageFunction();
      return obj;
    }
    if (params.carNo === '' && params.createdAt === undefined) {
      let obj = messageFunction();
      return obj;
    }
    let requestParams = formatCarRecordListParams(params, {
      ...pageObj,
      ...(params.carNo &&
        (regux.test(params.carNo)
          ? { carNo: params.carNo }
          : {
              _id: params.carNo,
            })),
    });
    let res: any = await request(appUrl.VehicleAccessRecord, {
      method: 'POST',
      data: requestParams,
    });
    let data = res.data.docs.map((item: any, index: any, arr: any[]) => {
      if (index === arr.length - 1) {
        cpm.setID(params.current, processCarRecordOtherParams(params), [item._id]);
        // console.log('cpm =》 ', cpm.map);
      }

      return {
        type: item.car.type,
        createdAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        outAt: item.outAt ? moment(item.outAt).format('YYYY-MM-DD HH:mm:ss') : '未出市场',
        carNo: item.car.type === '三轮车' ? item._id : item.car.info.result.PlateResult.license,
        key: index,
        info: item.car.info, // 抓拍机和 IP 栏使用的数据源
        id: item._id,
        carType:
          item.car.type !== '三轮车' ? getPlateType(item.car.info.result.PlateResult.type) : '-',
      };
    });
    return {
      data: data,
      // total: res.data.totalDocs,
      // 传递了上一页最后一条 id 后，totalDocs 个数不对
      total: (res.data.totalPages + params.current - 1) * params.pageSize,

      // current: 1,
      // 返回正确的 current
      current: params.current,
    };
  } catch (err) {
    throw err;
  }
}
export const inputCarId = async (data: any) => {
  return request(appUrl.InputCarID, { method: 'POST', data: data });
};
