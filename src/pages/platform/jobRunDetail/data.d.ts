export interface TableListItem {
  jobExecutionId: string;
  jobName: string;
  version:number;
  exitCode:string;
  exitMessage:string;
  status: number;
  lastUpdated: Date;
  createTime: Date;
  endTime:Date;
  startTime:Date;
}

export interface TableListPagination {
  pageSize: number;
  pageNumber: number;
  current:number;
}

export interface TableListData {
  content: TableListItem[];
  pageable: Partial<TableListPagination>;
  totalElements:number;
}

export interface TableListParams {
  status: string;
  name: string;
  pageSize: number;
  currentPage: number;
}
