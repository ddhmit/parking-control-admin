import { ChargingStandardTable } from '../../data';
export interface TableListItem {
  key: number;
  disabled?: boolean;
  href: string;
  avatar: string;
  name: string;
  title: string;
  owner: string;
  desc: string;
  callNo: number;
  status: number;
  updatedAt: Date;
  createdAt: Date;
  progress: number;
  type: string;
  freeDuration: number;
  billingCycle: number;
  cycleChargeAmount: number;
  enable: boolean;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter?: string;
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
}

export const dataSource: TableListItem[] = [
  {
    key: 0,
    type: '小车',
    freeDuration: 120,
    billingCycle: 120,
    cycleChargeAmount: 2,
    enable: false,
  },
  {
    key: 1,
    type: '大车',
    freeDuration: 120,
    billingCycle: 120,
    cycleChargeAmount: 2,
    enable: false,
  },
  {
    key: 2,
    type: '三轮车',
    freeDuration: 120,
    billingCycle: 120,
    cycleChargeAmount: 2,
    enable: false,
  },
];
