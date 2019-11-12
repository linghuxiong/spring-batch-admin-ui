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
  name: string;
  type:number;
  triggerName:string;
  springJobName:string;
  pageSize: number;
  currentPage: number;
}
