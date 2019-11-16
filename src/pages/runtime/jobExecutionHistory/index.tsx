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
import { SorterResult,ColumnProps } from 'antd/es/table';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './models/jobExecutionHistory';
import { TableListItem, TableListPagination, TableListParams } from './data';

import styles from './style.less';
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
      | 'jobExecutionHistory/fetch'
    >
  >;
  loading: boolean;
  jobExecutionHistory: StateType;
}

interface TableListState {
  formValues: { [key: string]: string };
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    jobExecutionHistory,
    loading,
  }: {
    jobExecutionHistory: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    jobExecutionHistory,
    loading: loading.models.jobExecutionHistory,
  }),
)
class TableList extends Component<TableListProps> {
  state : TableListState = {
    formValues: {}
  }

  columns:ColumnProps<TableListItem>[] = [
    {
      title: '执行编号',
      dataIndex: 'runId',
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
    },
    {
      title: '执行用户',
      dataIndex: 'userName',
    },
    {
      title: '状态',
      dataIndex: 'status',
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
      dataIndex: 'createAt',
      sorter: true,
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '开始时间',
      dataIndex: 'startAt',
      sorter: true,
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '结束时间',
      dataIndex: 'endAt',
      sorter: true,
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '最后更新时间',
      dataIndex: 'updatedAt',
      sorter: true,
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '结束代码',
      dataIndex: 'exitCode',
    },
    // {
    //   title: '操作',
    //   render: (text, record) => {
    //     let hiddenVal :boolean = true;
    //     if(record.status == 1 || record.status ==2){
    //       hiddenVal = false;
    //     }
    //    return <Fragment> <a hidden={hiddenVal} onClick={() => this.handleStopped(record)}>停止</a></Fragment>
    //   },
    // },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobExecutionHistory/fetch',
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'jobExecutionHistory/fetch',
      payload: {},
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'jobExecutionHistory/fetch',
        payload: values,
      });
    });
  };

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params: Partial<TableListParams> = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };

    dispatch({
      type: 'jobExecutionHistory/fetch',
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
              {getFieldDecorator('jobName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" allowClear={true} style={{ width: '100%' }}>
                {STATUS.map((item,index) => (<Option value={index}>{item}</Option>))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="执行编号">
              {getFieldDecorator('runId')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
            <FormItem label="执行用户">
              {getFieldDecorator('userName')(<Input placeholder="请输入" />)}
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
      jobExecutionHistory: { data },
      loading
    } = this.props;

    const { content, pageable ,totalElements} = data;

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
              rowKey={row => row.id+""}
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
