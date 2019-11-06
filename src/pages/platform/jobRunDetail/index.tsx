import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  message,
  Table
} from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult, ColumnProps } from 'antd/es/table';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './models/springBatch';
import { TableListItem, TableListParams } from './data';

import styles from './style.less';
import { PaginationProps } from 'antd/es/pagination/Pagination';
import _ from 'lodash';
import Tag from 'antd/es/tag';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

type IStatusMapType = 'default' | 'processing' | 'success' | 'error';
const STATUS = ['COMPLETED', 'STARTING', 'STARTED', 'STOPPING', 'STOPPED', 'FAILED', 'ABANDONED', 'UNKNOWN'];

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'springBatch/load'
      | 'springBatch/stop'
    >
  >;
  loading: boolean;
  springBatch: StateType;
}

interface TableListState {
  formValues: { [key: string]: string };
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    springBatch,
    loading,
  }: {
    springBatch: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    springBatch,
    loading: loading.models.jobRunDetail,
  }),
)
class TableList extends Component<TableListProps> {
  state: TableListState = {
    formValues: {}
  }

  columns: ColumnProps<TableListItem>[] = [
    {
      title: '任务名称',
      dataIndex: 'JobName',
    },
    {
      title: '执行编号',
      dataIndex: 'JobExecutionId',
    },
    {
      title: '版本',
      dataIndex: 'Version',
    },
    {
      title: '状态',
      dataIndex: 'Status',
      render: (tag: string) =>{
            let color:string;
            if(_.isEqual(tag,'COMPLETED')){
              color = 'green';
            }else if(_.isEqual(tag,'STARTING')|| _.isEqual(tag,'STARTED')){
              color = 'orange';
            }else if(_.isEqual(tag,'FAILED')|| _.isEqual(tag,'ABANDONED')){
              color = 'red';
            }else{
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag}
              </Tag>
          );
        },
    },
    {
      title: '创建时间',
      dataIndex: 'CreateTime',
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '开始时间',
      dataIndex: 'StartTime',
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '结束时间',
      dataIndex: 'EndTime',
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '最后更新时间',
      dataIndex: 'LastUpdated',
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '结束代码',
      dataIndex: 'ExitCode',
    },
    {
      title: '操作',
      render: (text, record) => {
        let hiddenVal: boolean = true;
        if (_.isEqual(record.Status, 'STARTING') || _.isEqual(record.Status, 'STARTED')) {
          hiddenVal = false;
        }
        return <Fragment> <a hidden={hiddenVal} onClick={() => this.handleStopped(record)}>停止</a></Fragment>
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'springBatch/load',
      payload: {},
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'springBatch/load',
      payload: {},
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      
      const params: Partial<TableListParams> = {
        status:fieldsValue.Status,
        name:fieldsValue.JobName,
      };

      dispatch({
        type: 'springBatch/load',
        payload: params,
      });
    });
  };

  handleStopped = (fields: TableListItem) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'springBatch/stop',
      payload: {
        jobExecutionId: fields.JobExecutionId,
      },
    });

    message.success('停止成功！');
  };

  handleStandardTableChange = (
    pagination: Partial<PaginationProps>,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params: Partial<TableListParams> = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      status:formValues.Status,
      name:formValues.JobName,
    };
    dispatch({
      type: 'springBatch/load',
      payload: params,
    });
  };

  renderForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="任务名称">
              {getFieldDecorator('JobName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('Status')(
                <Select placeholder="请选择" allowClear={true} style={{ width: '100%' }}>
                  {STATUS.map((item, index) => (<Option value={item}>{item}</Option>))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      springBatch: { data },
      loading
    } = this.props;

    const { content, pageable, totalElements } = data;

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
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Table
              dataSource={content}
              columns={this.columns}
              rowKey={row => row.JobExecutionId}
              pagination={paginationProps}
              loading={loading}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
