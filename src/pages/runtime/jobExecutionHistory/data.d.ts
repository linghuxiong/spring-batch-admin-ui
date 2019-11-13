export interface TableListItem {
  id: number;
  jobName: string;
  userName: string;
  runId:number;
  exitCode:string;
  exitMessage:string;
  status: number;
  updatedAt: Date;
  createAt: Date;
  endAt:Date;
  startAt:Date;
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
  jobName: string;
  userName:string;
  runId:number;
  pageSize: number;
  currentPage: number;
}
