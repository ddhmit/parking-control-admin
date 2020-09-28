import request from '@/utils/request';
import appUrl from '@/config/appUrl';
import { ChargingStandardType } from './data';
const dayCharge = (value: any) => {
  let obj = [];
  for (let i = 0; i < value.length; i++) {
    switch (value[i]) {
      case 0:
        obj.push('星期天');
        break;
      case 1:
        obj.push('星期一');
        break;
      case 2:
        obj.push('星期二');
        break;
      case 3:
        obj.push('星期三');
        break;
      case 4:
        obj.push('星期四');
        break;
      case 5:
        obj.push('星期五');
        break;
      case 6:
        obj.push('星期六');
        break;
    }
  }
  return obj.join(',');
};
async function setChargingStandard(params?: ChargingStandardType) {
  return request(appUrl.ChargingStandard, {
    method: 'POST',
    data: params,
  });
}
async function requestChargingStandard(params?: any) {
  try {
    let postParams = {};
    let obj = await request(appUrl.RequestChargingStandard, { method: 'POST', data: postParams });
    if (obj.data.docs.length !== 0) {
      let data: any = [];
      for (let i = 0; i < obj.data.docs.length; i++) {
        for (let j = 0; j < obj.data.docs[i].value.length; j++) {
          if (obj.data.docs[i].key === '收费标准') {
            data.push({
              ...obj.data.docs[i].value[j],
              id: j,
              time:
                obj.data.docs[i].value[j].effectTime[0] +
                '-' +
                obj.data.docs[i].value[j].effectTime[1] +
                ',' +
                dayCharge(obj.data.docs[i].value[j].effectCycle),
            });
          }
        }
      }
      return data;
    }
  } catch (err) {
    throw err;
  }
}
export { setChargingStandard, requestChargingStandard };
