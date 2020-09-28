import request from '@/utils/request';
import {
  ShopTableListData,
  ShopReviewParams,
  ShopStaffReviewParams,
  UserListItem,
  ChangeShopPointParams,
} from './data';
import { convertTableListParams, convertListResponse } from '@/utils/format';
import { TableListDefaultParams, AppResponse, AppListParams, AppListData } from '@/models/response';
import appUrl from '@/config/appUrl';
import { ShopReviewStatus } from '@/config/shop';
/**
 * 获取商铺的基础请求 api
 *
 * @param {AppListParams} [params]
 * @returns {Promise<any>}
 */
async function getShops(params?: AppListParams): Promise<any> {
  try {
    let res = (await request(appUrl.RequestShopListUrl, {
      method: 'POST',
      data: params,
    })) as AppResponse<ShopTableListData>;
    return convertListResponse(res);
  } catch (err) {
    throw err;
  }
}
/**
 * 获取已入驻商铺
 *
 * @export
 * @param {TableListDefaultParams} [params]
 * @returns {Promise<any>}
 */
export async function queryShopsRule(params?: TableListDefaultParams): Promise<any> {
  let handledParams = convertTableListParams(params);
  if (!handledParams) {
    handledParams = {};
  }
  if (!handledParams.search) {
    handledParams.search = {};
  }

  handledParams.search.status = [ShopReviewStatus.Success];
  try {
    return getShops(handledParams);
  } catch (err) {
    throw err;
  }
}
/**
 * 删除商户
 *
 * @export
 * @param {string[]} merchants
 * @returns
 */
export async function removeShopsRule(merchants: string[]) {
  return request(appUrl.DelShopUrl, {
    method: 'POST',
    data: {
      merchants,
    },
  });
}
/**
 * 获取非审核通过状态的商户
 *
 * @export
 * @param {TableListDefaultParams} [params]
 */
export async function queryReviewShops(params?: TableListDefaultParams) {
  let handledParams = convertTableListParams(params);

  if (!handledParams) {
    handledParams = {};
  }
  if (!handledParams.search) {
    handledParams.search = {};
  }

  if (handledParams.search && handledParams.search.status) {
    handledParams.search.status = handledParams.search.status.filter(
      (item: ShopReviewStatus) => item !== ShopReviewStatus.Success,
    );
  } else {
    handledParams.search.status = [ShopReviewStatus.Refused, ShopReviewStatus.Reviewing];
  }

  try {
    return getShops(handledParams);
  } catch (err) {
    throw err;
  }
}
/**
 * 审核商户
 *
 * @export
 * @param {ShopReviewParams} params
 * @returns
 */
export async function reviewShop(params: ShopReviewParams) {
  return request(appUrl.ReviewShopUrl, { method: 'POST', data: params });
}
/**
 * 根据商铺 id 和 table list 的参数获取商铺职员列表
 *
 * @export
 * @param {string} id
 * @param {(TableListDefaultParams | undefined)} params
 * @returns
 */
export async function queryShopStaffList(id: string, params: TableListDefaultParams | undefined) {
  let handledParams = convertTableListParams(params);
  if (!handledParams) {
    handledParams = { search: {} };
  }
  handledParams.search = {
    ...handledParams.search,
    merchantId: id,
  };
  try {
    let res = await request(appUrl.RequestShopStaffUrl, {
      method: 'POST',
      data: handledParams,
    });
    return convertListResponse(res);
  } catch (err) {
    throw err;
  }
}
/**
 * 审核商铺员工接口
 *
 * @export
 * @param {ShopStaffReviewParams} params
 * @returns
 */
export async function reviewShopStaff(params: ShopStaffReviewParams) {
  return request(appUrl.ReviewShopStaffUrl, { method: 'POST', data: params });
}
/**
 * 获取单个用户信息
 *
 * @export
 * @param {string} userID
 * @returns
 */
export async function getUserInfoFromShopDetail(userID: string) {
  try {
    let res = await request<AppResponse<AppListData<UserListItem>>>(appUrl.RequestUserUrl, {
      method: 'POST',
      data: {
        search: {
          _id: [userID],
        },
      },
    });
    // console.log('获取 用户信息 =》 ', res.data);
    return res.data ? res.data.docs[0] : undefined;
  } catch (err) {
    throw err;
  }
}

export async function changeShopPoint(params: ChangeShopPointParams) {
  return request<AppResponse<any>>(appUrl.changePointUrl, {
    method: 'POST',
    data: params,
  });
}
