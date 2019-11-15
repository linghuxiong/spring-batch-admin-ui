export interface TableListItem {
  fireInstanceId: string;
  triggerName:string;
  triggerGroup:string;
  jobName:string;
  jobGroup:string;
  status:number;
  message:string;
  nextFireTime:Date;
  prevFireTime:Date;
  fireTime:Date;
  finishTime:Date;
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
  status: number;
  triggerName: string;
  jobName:string;
  jobGroup:string;
  triggerGroup:string;
  pageSize: number;
  currentPage: number;
}
