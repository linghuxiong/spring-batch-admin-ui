export interface TableListItem {
  id: number;
  name: string;
  group: string;
  cronExpression: string;
  timeInterval: number;
  status: number;
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
  sorter: string;
  triggerStatus: number;
  triggerName: string;
  triggerGroup: string;
  pageSize: number;
  currentPage: number;
}
