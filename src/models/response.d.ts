export interface AppResponse<T> {
  data?: T;
  msg: string;
}

export interface AppListData<T = any> {
  docs: T[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: 30;
  nextPage: null;
  page: number;
  pagingCounter: number;
  prevPage: null;
  totalDocs: number;
  totalPages: number;
}

export interface AppListParams {
  search?: { [s: string]: any };
  page?: number;
  limit?: number;
}

export interface TableListDefaultParams {
  sorter?: string;
  pageSize?: number;
  current?: number;
  _timestamp?: number;
  [s: string]: any;
}
