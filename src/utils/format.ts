import moment from 'moment';
import { TableListDefaultParams, AppListParams, AppResponse, AppListData } from '@/models/response';
import appUrl from '@/config/appUrl';
/**
 * 将 ProTable 数据格式转为服务端需要的列表查询数据格式
 *
 * @export
 * @param {TableListDefaultParams} [defaultParams]
 * @returns {(AppListParams | undefined)}
 */
export function convertTableListParams(
  defaultParams?: TableListDefaultParams,
): AppListParams | undefined {
  if (!defaultParams) return;
  let temp: any = {};
  if (defaultParams.current) {
    temp.page = defaultParams.current;
  }
  if (defaultParams.pageSize) {
    temp.limit = defaultParams.pageSize;
  }
  Object.entries(defaultParams).forEach(([key, val]) => {
    let isString = typeof val === 'string';
    isString && (val = val.trim()); // 去除前后空白符
    // 去除 ProTable 的字段
    if (key === 'current' || key === 'pageSize' || key === '_timestamp') return;
    // search 不存在时添加 search
    if (!temp.search) {
      temp.search = {};
    }
    // undefined null '' 不传递查询条件
    if (!val && val !== 0 && val !== false) return;
    // 已经是数组了直接赋值，否则就放到数组中
    temp.search[key] = Array.isArray(val) ? val : [val];
  });
  return temp;
}
/**
 * 将服务端返回的列表数据转换为 ProTable 的数据格式
 *
 * @export
 * @param {AppResponse<AppListData<any>>} res
 * @returns {*}
 */
export function convertListResponse(res: AppResponse<AppListData<any>>): any {
  // console.log('获取数据： ', res);
  if (res && res.data && res.data.docs) {
    return { data: res.data.docs, total: res.data.totalDocs, current: res.data.page };
  } else {
    return {
      data: [],
      total: 0,
      current: 1,
    };
  }
}
/**
 * 转化相机拍着的车辆图片数据
 *
 * @export
 * @param {string} str
 * @returns {string}
 */
export function addBase64Prefix(str: string): string {
  return 'data:image;base64,' + str;
}

export function addBaseUrlPrefix(path: string): string {
  if (!path) return '';
  return appUrl.BaseUrl + path;
}

export function formatTime(date: string): string {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
}
