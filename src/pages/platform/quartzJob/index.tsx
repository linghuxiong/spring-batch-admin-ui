import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Table,
  Select
} from 'antd';
import React, { Component } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ColumnProps } from 'antd/es/table';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './models/quartzJob';
import { TableListItem, TableListPagination, TableListParams } from './data';

import styles from './style.less';
import Tag from 'antd/es/tag';

const FormItem = Form.Item;
const { Option } = Select;

const STATUS = ['失败','成功','未知'];
interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'quartzJob/fetch'
    >
  >;
  loading: boolean;
  quartzJob: StateType;
}

interface TableListState {
  formValues: { [key: string]: string };
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    quartzJob,
    loading,
  }: {
    quartzJob: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    quartzJob,
    loading: loading.models.quartzJob,
  }),
)
class TableList extends Component<TableListProps> {
  state: TableListState = {
    formValues: {}
  }

  columns: ColumnProps<TableListItem>[] = [
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
      dataIndex: 'status',
      render: (tag: number) => {
        let color: string;
        if (tag == 1) {
          color = 'green';
        } else {
          color = 'red';
        }

        if(!tag){
          tag = 2;
        }
        return (
          <Tag color={color} key={tag}>
            {STATUS[tag]}
          </Tag>
        );
      },
    },
    {
      title: '触发时间',
      dataIndex: 'fireTime',
      sorter: true,
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '完成时间',
      dataIndex: 'finishTime',
      sorter: true,
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '下次触发时间',
      dataIndex: 'nextFireTime',
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '上次预期时间',
      dataIndex: 'prevFireTime',
      sorter: true,
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '处理结果',
      dataIndex: 'message',
      render: (text: string) => {
        if (text && text.length < 15) {
          return text;
        } else if(text){
          return text.substr(10) + "……"
        }
        return text;
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'quartzJob/fetch',
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'quartzJob/fetch',
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
        type: 'quartzJob/fetch',
        payload: fieldsValue,
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
      type: 'quartzJob/fetch',
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
            <FormItem label="任务分组">
              {getFieldDecorator('jobGroup')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="触发状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" allowClear={true} style={{ width: '100%' }}>
                  {STATUS.map((item, index) => (<Option value={index}>{item}</Option>))}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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
      quartzJob: { data },
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
              rowKey={row => row.fireInstanceId}
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
