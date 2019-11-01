export interface TableListItem {
  key: number;
  disabled?: boolean;
  href: string;
  name: string;
  runNum:number;
  version:number;
  exitCode:string;
  exitMessage:string;
  status: number;
  updatedAt: Date;
  createAt: Date;
  endAt:Date;
  startAt:Date;
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
  status: string;
  name: string;
  pageSize: number;
  currentPage: number;
}
