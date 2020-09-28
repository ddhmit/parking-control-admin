import request from '../../../utils/request';
import appUrl from '../../../config/appUrl';
import moment from 'moment';
import { regux } from '../shopCars/compontents/data';
import { getPlateType } from '../../switch/util/index';
import {
  formatCarRecordListParams,
  CarRecordParamsManager,
  processCarRecordOtherParams,
} from '../utils';
let cpm = new CarRecordParamsManager();

export async function VehicleAccessRecord(params?: any) {
  // 获取记录的上一页的 pathway._id
  let perpage_last_pathway_id = cpm.getID(
    params.current - 1,
    processCarRecordOtherParams(params),
  )[1];

  // 获取对应页面对应最后一条记录的 pathway._id
  let pageObj = {
    ...(perpage_last_pathway_id && { perpage_last_pathway_id }),
  };
  try {
    let requestParams = formatCarRecordListParams(params, {
      ...pageObj,
      ...(params.carNo &&
        (regux.test(params.carNo)
          ? { carNo: params.carNo }
          : {
              _id: params.carNo,
            })),
    });
    let res: any = await request(appUrl.LoadingUnloadingRecords, {
      method: 'POST',
      data: requestParams,
    });
    let data = res.data.docs.map((item: any, index: any, arr: any[]) => {
      // 存储本页最后一条数据的 path._id
      if (index === arr.length - 1) {
        cpm.setID(params.current, processCarRecordOtherParams(params), [
          undefined,
          item.pathway._id,
        ]);
      }
      return {
        type: item.car.type,
        operation: item.pathway.operation,
        status: item.pathway.status,
        carNo: item.car.type !== '三轮车' ? item.car.info.result.PlateResult.license : item._id,
        createdAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        operationAt: moment(item.pathway.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
        merchant: item.pathway.merchant ? item.pathway.merchant.name : '',
        operator: !item.pathway.operator // 容错
          ? undefined
          : item.pathway.operator.name
          ? item.pathway.operator.name
          : '-',
        operatorPhone: !item.pathway.operator // 容错
          ? '-'
          : item.pathway.operator.phone
          ? item.pathway.operator.phone
          : '-',
        outAt: item.outAt ? moment(item.outAt).format('YYYY-MM-DD HH:mm:ss') : '未出市场',
        key: index,
        phone: item.phone !== '' && item.phone ? item.phone : '未备注',
        carType: item.car.type !== '三轮车'? getPlateType(item.car.info.result.PlateResult.type):'-',
      };
    });
    return {
      data: data,
      // 传递了上一页最后一条 id 后，totalDocs 个数不对
      total: (res.data.totalPages + params.current - 1) * params.pageSize,
      // 返回正确的 current
      current: params.current,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}
