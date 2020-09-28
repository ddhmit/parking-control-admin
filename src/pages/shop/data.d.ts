import { ShopReviewStatus } from '@/config/shop';
import { AppListData } from '@/models/response';

export interface ShopTableListItem {
  balance: number;
  integral: number;
  status: ShopReviewStatus;
  _id: string;
  market: string;
  name: string;
  user: {
    name?: string;
    phone?: string;
    _id: string;
  };
  createdAt: string;
  staff: any[];
  updatedAt: string;
  businessLicense: { photo: string };
  car: any[];
  rentalContract: { page1: string; page999: string };
}
export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export type ShopTableListData = AppListData<ShopTableListItem>;

export interface ShopReviewParams {
  merchant: string;
  remark?: string;
  status: ShopReviewStatus.Refused | ShopReviewStatus.Success;
}

export interface ShopStaffReviewParams {
  staff: string;
  remark?: string;
  status: ShopReviewStatus.Refused | ShopReviewStatus.Success;
}

export interface ShopStaffListItem {
  _id: string;
  phone: string;
  enable: boolean;
  id: string;
  idCard: { photo: { emblem: ''; head: '' } };
  market: string;
  name: string;
  role: string;
  status: ShopReviewStatus;
  updatedAt: string;
  createdAt: string;
}

export interface UserListItem {
  _id: string;
  market: string;
  phone: string;
  createdAt: string;
  enable: boolean;
  idCard: {
    photo: {
      emblem: string;
      head: string;
    };
  };
}

export interface ChangeShopPointParams {
  merchant: string; // 商户ID
  integral: number; // 积分数量 正数加 负数减 清空就是当前积分的负数
}
