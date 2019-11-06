export interface TableListItem {
  JobExecutionId: string;
  JobName: string;
  runNum:number;
  Version:number;
  ExitCode:string;
  ExitMessage:string;
  Status: number;
  LastUpdated: Date;
  CreateTime: Date;
  EndTime:Date;
  StartTime:Date;
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
