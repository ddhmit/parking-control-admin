import { string } from 'prop-types';

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

export interface ChargingStandardTable {
  id: number;
  type: string;
  freeDuration: number;
  billingCycle: number;
  cycleChargeAmount: number;
  enable: boolean;
}
export interface ChargingStandard {
  freeDuration: number; //免费时长
  billingCycle: number; //计费周期
  cycleChargeAmount: number; //周期收费金额
  startTime: number; //起步时长
  startMoney: number; //起步金额;
  capMoney: number; //封顶金额;
  effectTime: string[]; //生效时间;
  effectCycle: number[]; //生效周期;
  type: string;
  enable: boolean;
  id: number;
}
export interface ChargingStandardType {
  key: string;
  value: ChargingStandardTable[];
}
