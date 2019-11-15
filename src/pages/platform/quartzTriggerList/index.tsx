import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  message,
  Table,
  Select,
  Divider
} from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ColumnProps } from 'antd/es/table';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './models/quartzTriggerList';
import { TableListItem, TableListPagination, TableListParams } from './data';

import styles from './style.less';
import _ from 'lodash';

const FormItem = Form.Item;
const { Option } = Select;

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'quartzTriggerList/fetch'
      | 'quartzTriggerList/remove'
      | 'quartzTriggerList/resume'
      | 'quartzTriggerList/pause'
    >
  >;
  loading: boolean;
  quartzTriggerList: StateType;
}

interface TableListState {
  formValues: { [key: string]: string };
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    quartzTriggerList,
    loading,
  }: {
    quartzTriggerList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    quartzTriggerList,
    loading: loading.models.quartzTriggerList,
  }),
)
class TableList extends Component<TableListProps> {
  state: TableListState = {
    formValues: {}
  }

  expandedRowRender = (record: any) => {
    const columns = [
      {
        title: '下次触发时间',
        dataIndex: 'nextFireTime',
        render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '预期启动时间',
        dataIndex: 'prevFireTime',
        render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
    ];

    let data = [];
    data.push({
      key:record.id,
      nextFireTime:record.nextFireTime,
      prevFireTime:record.prevFireTime,
      startTime:record.startTime,
      endTime:record.endTime,
    });

    console.log(data);

    return <Table columns={columns} dataSource={data} pagination={false} />;
  };

  columns: ColumnProps<TableListItem>[] = [
    {
      title: '调度名称',
      dataIndex: 'schedName',
    },
    {
      title: '触发器名称',
      dataIndex: 'triggerName',
    },
    {
      title: '触发器分组',
      dataIndex: 'triggerGroup',
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
    },
    {
      title: '任务分组',
      dataIndex: 'jobGroup',
    },
    {
      title: '状态',
      dataIndex: 'triggerState',
    },
    {
      title: '优先级',
      dataIndex: 'priority',
    },
    {
      title: '错过次数',
      dataIndex: 'misFireNum',
    },
    {
      title: '操作',
      render: (record) => {
        console.log(record);
        console.log(record.triggerState);
        console.log(_.isEqual("PAUSED",record.triggerState));
          if(_.isEqual("PAUSED",record.triggerState)){
            return <Fragment>
              <a onClick={() => this.handleResume(record.id)}>恢复</a>
            </Fragment>
          }else{
            return <Fragment>
              <a onClick={() => this.handlePause(record.id)}>暂停</a>
            </Fragment>
          };          
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'quartzTriggerList/fetch',
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'quartzTriggerList/fetch',
      payload: {},
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue,
      });

      dispatch({
        type: 'quartzTriggerList/fetch',
        payload: fieldsValue,
      });
    });
  };

  handleResume = (key: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'quartzTriggerList/resume',
      payload: {
        id: key
      },
    });

    message.success('恢复成功');
  };

  handlePause = (key: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'quartzTriggerList/pause',
      payload: {
        id: key
      },
    });

    message.success('暂停成功');
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
      type: 'quartzTriggerList/fetch',
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
            <FormItem label="调度名称">
              {getFieldDecorator('schedName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="触发器名">
              {getFieldDecorator('triggerName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="触发器分组">
              {getFieldDecorator('triggerGroup')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="任务名称">
              {getFieldDecorator('jobName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="任务分组">
              {getFieldDecorator('jobGroup')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="触发器状态">
              {getFieldDecorator('triggerStatus')(
                <Select placeholder="请选择" allowClear={true} style={{ width: '100%' }}>
                  <Option value="WAITING">WAITING</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </div>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      quartzTriggerList: { data },
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
              rowKey={row => row.id}
              pagination={paginationProps}
              loading={loading}
              expandedRowRender={this.expandedRowRender}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
