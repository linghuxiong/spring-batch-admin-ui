export interface TableListItem {
  id: string;
  schedName:string;
  triggerName:string;
  triggerGroup:string;
  jobName:string;
  jobGroup:string;
  nextFireTime:Date;
  prevFireTime:Date;
  priority:number;
  triggerStatus:string;
  startTime:Date;
  endTime:Date;
  misFireNum:number;
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
  triggerStatus: any;
  triggerName: any;
  schedName:string;
  jobName:string;
  jobGroup:string;
  triggerGroup:string;
  pageSize: number;
  currentPage: number;
}
