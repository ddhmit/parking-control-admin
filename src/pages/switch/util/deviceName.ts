const InFlag = 'IN';
const OutFlag = 'OUT';
const UndergroundFlag = '地';
// const DoorFlag = '门';

interface IParseDeviceName {
  type: 1 | 2; // type: 1 门； 2 地下停车场
  serialNo: number; // 序列号
  direction: 1 | 2; // direction 1 进 2 出
  cameraNo: string;
}
/**
 * 从 deviceName 中分析出有效信息， 相关类型处理成数字信息，方便在 deviceName 格式后续的变更时同一修改
 *
 * @export
 * @param {string} deviceName
 * @returns {IParseDeviceName}
 */
export function parseDeviceName(deviceName: string): IParseDeviceName {
  /* 门-3-OUT-C0001, 
门-4-IN-C00001,
地-1-OUT-C0001*/
  // ["门", "1", "OUT", "C0001"]
  let infos = deviceName
    .split('-')
    .map((c) => c.trim())
    .map((c) => c.toUpperCase());
  // 返回结果初始值
  let res: IParseDeviceName = {
    type: 1, // 门
    serialNo: -1,
    direction: 1, // 进
    cameraNo: '',
  };

  // 类型： 门 / 地
  if (infos[0] === UndergroundFlag) {
    res.type = 2;
  }
  // 门的序列号
  res.serialNo = parseInt(infos[1]);
  // 方向： 进 / 出
  if (infos[2] === OutFlag) {
    res.direction = 2;
  }
  // 机位序列号
  res.cameraNo = infos[3];
  // console.log(' format infos -- ', deviceName, infos, res);
  return res;
}

/**
 * 判断当前设备名是否可用
 *
 * @export
 * @param {string} deviceName 车辆信息中的 deviceName
 * @returns {{ error: boolean; in: boolean; out: boolean }}
 */
export function isValidDeviceName(
  deviceName?: string,
): { error: boolean; in: boolean; out: boolean } {
  // 不存在或者没有设置正确的 IN / OUT 标识符时认为错误
  let errFlag = !deviceName || (!deviceName.includes(InFlag) && !deviceName.includes(OutFlag));
  let inFlag = !!(deviceName && parseDeviceName(deviceName).direction === 1);
  let outFlag = !!(deviceName && parseDeviceName(deviceName).direction === 2);
  return {
    error: errFlag,
    in: inFlag,
    out: outFlag,
  };
}

/**
 * 从 deviceName 格式化当前机位的显示文本
 *
 * @export
 * @param {string} [deviceName]
 * @returns {string}
 */
export function formatDeviceName(deviceName?: string): string {
  let validRes = isValidDeviceName(deviceName);
  if (validRes.error) {
    return '该抓拍机未正确设置设备名称';
  } else {
    let parseRes = parseDeviceName(deviceName!);
    let res = `${parseRes.serialNo}号${parseRes.type === 1 ? '门' : '地下停车场'}${
      parseRes.direction === 1 ? '入口' : '出口'
    }${parseRes.cameraNo}`;

    return res;
  }
}
