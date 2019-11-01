export interface TableListItem {
  id: number;
  name: string;
  type: number;
  estimatedTime: number;
  status: number;
  triggerName: string;
  springJobName: string;
  jobDesc: string;
  params:{ [key: string]: string };
  callbachUrl:string;
  updatedAt: Date;
  createdAt: Date;
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
  sorter: string;
  status: number;
  name: string;
  type:number;
  triggerName:string;
  springJobName:string;
  pageSize: number;
  currentPage: number;
}
