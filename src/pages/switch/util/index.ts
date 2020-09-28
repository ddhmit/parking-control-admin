import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
moment.updateLocale('zh-cn', {
  relativeTime: {
    // 修改默认的相对时间的文本显示，s 默认是 几秒前， 此处需要具体数字
    s: '%d 秒',
  },
});
/**
 * 格式化机位时间
 * 规则：24H:分钟:秒
 *
 * @export
 * @param {number} date
 * @returns
 */
export function formatCameraTime(date: number) {
  return moment.utc(date).format('HH:mm:ss');
}

const SixDayMs = 1000 * 60 * 60 * 24 * 6;
/**
 * 格式化车辆拍摄时间为相对于机位时间的格式
 * 规则：秒 分 时 天 一周后为日期
 *
 * @export
 * @param {number} shotTime
 * @param {number} cameraTime
 * @param {string} [formatType='Y/MM/DD']
 * @returns {string}
 */
export function formatShotTime(
  shotTime: number,
  cameraTime: number,
  formatType: string = 'Y/MM/DD',
): string {
  const TodayMs = Date.now();
  let d = new Date(shotTime);
  if (TodayMs - d.getTime() > SixDayMs) {
    return moment.utc(shotTime).format(formatType);
  } else {
    let formatT = moment.utc(shotTime);
    let formatcCameraTime = moment.utc(cameraTime);
    return moment(formatT).from(moment(formatcCameraTime));
  }
}

export const PlateColorType = new Map([
  [0, '未知'],
  [1, '蓝牌'],
  [2, '黄牌'],
  [3, '白牌'],
  [4, '黑牌'],
  [5, '绿牌'],
  [6, '黄绿牌'],
  [7, '其他'],
]);

export const PlateType = new Map([
  [0, '未知'],
  [1, '普通蓝牌'],
  [2, '普通黑牌'],
  [3, '普通黄牌'],
  [4, '双层黄牌'],
  [5, '警察车牌'],
  [6, '武警车牌'],
  [7, '双层武警'],
  [8, '单层军牌'],
  [9, '双层军牌'],
  [10, '个性车牌'],
  [11, '新能源小车牌'],
  [12, '新能源大车牌'],
  [13, '大使馆车牌'],
  [14, '领事馆车牌'],
  [15, '民航车牌'],
  [16, '应急车牌'],
]);

export function getPlateColorType(type: number): string | undefined {
  return PlateColorType.get(type);
}

export function getPlateType(type: number): string | undefined {
  return PlateType.get(type);
}
