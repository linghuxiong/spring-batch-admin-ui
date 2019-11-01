export interface TableListItem {
  id: number;
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
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  triggerStatus: any;
  triggerName: any;
  sorter: string;
  schedName:string;
  jobName:string;
  jobGroup:string;
  triggerGroup:string;
  pageSize: number;
  currentPage: number;
}
