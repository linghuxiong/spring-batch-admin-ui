import {Table } from 'antd';
import { ColumnProps, TableProps } from 'antd/es/table';
import React, { Component} from 'react';

import { TableListItem, TableListPagination } from '../../data';
import styles from './index.less';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface StandardTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: ColumnProps<TableListItem>[];
  data: {
    content: TableListItem[];
    pageable: Partial<TableListPagination>;
    totalElements:number;
  };
}
class StandardTable extends Component<StandardTableProps<TableListItem>> {

  handleTableChange: TableProps<TableListItem>['onChange'] = (
    pagination,
    ...rest
  ) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, ...rest);
    }
  };

  render() {
    const { data, ...rest } = this.props;
    const { content = [], pageable = false,totalElements = 0 } = data || {};

    const paginationProps = pageable
      ? {
          showSizeChanger: true,
          showQuickJumper: true,
          total: totalElements,
          showTotal: ((total: number) => {
            return `共 ${total} 条`;
          }),
          current: pageable.pageNumber ? pageable.pageNumber + 1 : 1,
          pageSize: pageable.pageSize,
        }
      : false;

    return (
      <div className={styles.standardTable}>
        <Table
          rowKey={row => row.id+""}
          dataSource={content}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default StandardTable;
