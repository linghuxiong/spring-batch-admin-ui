import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  message,
} from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch, Action } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ColumnProps } from 'antd/es/table';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './models/jobList';
import CreateOrUpdateForm from './components/CreateOrUpdateForm';
import StandardTable from './components/StandardTable';
import { TableListItem, TableListPagination, TableListParams } from './data';

import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

type IStatusMapType = 'default' | 'processing' | 'success' | 'error';
const status = ['停止','启动'];
const types = ['手动任务','日任务','周任务','月任务','其他周期任务'];

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'jobList/fetch'
      | 'jobList/saveJob'
      | 'jobList/remove'
      | 'jobList/toggleStatus'
    >
  >;
  loading: boolean;
  jobList: StateType;
}

interface TableListState {
  modalVisible: boolean;
  formValues: { [key: string]: string };
  title: string;
  itemValues:Partial<TableListItem>;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    jobList,
    loading,
  }: {
    jobList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    jobList,
    loading: loading.models.jobList,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    formValues: {},
    title:'新建任务',
    itemValues:{}
  };

  columns: ColumnProps<TableListItem>[] = [
    {
      title: '任务名称',
      dataIndex: 'name',
    },
    {
      title: '注册名称',
      dataIndex: 'springJobName',
    },
    {
      title: '预计时间',
      dataIndex: 'estimatedTime',
      align: 'right',
      render: (val: string) => {
        if(val){
          return `${val} 秒`;
        }else{
          return null;
        }
      },
    },
    {
      title: '任务类别',
      dataIndex: 'type',
      render(val:number) {
        return types[val];
      },
    },
    {
      title: '触发器名称',
      dataIndex: 'triggerName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(val: number) {
        let statusVal:IStatusMapType;
        if(val == 1){
          statusVal = "success";
        }else{
          statusVal = "error";
        }
        return <Badge status={statusVal} text={status[val]} />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '修改时间',
      dataIndex: 'updatedAt',
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          {record.status == 0?
          <a onClick={() => this.toggleStatus(record.id,1)}>开始</a>:
          <a onClick={() => this.toggleStatus(record.id,0)}>停止</a>
          }
          <Divider type="vertical" />
          <a onClick={() => this.handleUpdateModalVisible(record,true)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleRemove(record.id)}>删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobList/fetch',
    });
  }

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
      type: 'jobList/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'jobList/fetch',
      payload: {},
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = fieldsValue;

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'jobList/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
      itemValues:{},
      title:"新建任务"
    });
  };

  handleUpdateModalVisible = (record : TableListItem ,flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
      title:'更新任务定义',
      itemValues : record
    });
  };

  handleAdd = (fields:TableListItem) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobList/saveJob',
      payload: fields,
    });

    if(fields && fields.id){
      message.success('添加成功');
    }else{
      message.success('修改成功');
    }

    this.handleModalVisible();
  };

  handleRemove = (key:number) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobList/remove',
      payload: {
        jobId:key
      },
    });

    message.success('删除成功');
  };

  toggleStatus = (key:number,status:number) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobList/toggleStatus',
      payload: {
        jobId:key,
        status:status
      },
    });

    if(status == 0){
      message.success('停止成功');
    }else if(status == 1){
      message.success('启动成功');
    }
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="任务名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="注册名称">
              {getFieldDecorator('springJobName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="任务状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" allowClear={true} style={{ width: '100%' }}>
                  {status.map((item,index) => (<Option value={index}>{item}</Option>))}
                </Select>,
              )}
            </FormItem>
          </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="任务类型">
              {getFieldDecorator('type')(
                <Select placeholder="请选择" allowClear={true} style={{ width: '100%' }}>
                  {types.map((item,index) => (<Option value={index}>{item}</Option>))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="触发器名">
              {getFieldDecorator('triggerName')(<Input placeholder="请输入" />)}
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
      jobList: { data },
      loading,
    } = this.props;

    const {modalVisible} = this.state;


    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            </div>
            <StandardTable
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateOrUpdateForm {...parentMethods} modalVisible={modalVisible} title={this.state.title} values={this.state.itemValues} />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
