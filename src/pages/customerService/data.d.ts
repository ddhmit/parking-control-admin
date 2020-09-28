import { ShopReviewStatus } from '@/config/shop';
import { AppListData } from '@/models/response';

export interface ShopTableListItem {
  balance: number;
  integral: number;
  status: ShopReviewStatus;
  _id: string;
  market: string;
  name: string;
  user: string;
  createdAt: string;
  staff: any[];
  updatedAt: string;
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
