import {
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
import { SorterResult, ColumnProps } from 'antd/es/table';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './models/triggerList';
import CreateOrUpdateForm from './components/CreateOrUpdateForm';
import StandardTable from './components/StandardTable';
import { TableListItem, TableListPagination, TableListParams } from './data';

import styles from './style.less';
import _ from 'lodash';
import Tag from 'antd/es/tag';

const FormItem = Form.Item;
const { Option } = Select;

const status = ['停止','启动'];

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<
    Action<
      | 'triggerList/saveTrigger'
      | 'triggerList/fetch'
      | 'triggerList/remove'
      | 'triggerList/toggleStatus'
    >
  >;
  loading: boolean;
  triggerList: StateType;
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
    triggerList,
    loading,
  }: {
    triggerList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    triggerList,
    loading: loading.models.triggerList,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    formValues: {},
    title:'新建触发器',
    itemValues:{}
  };

  columns: ColumnProps<TableListItem>[] = [
    {
      title: '触发器名称',
      dataIndex: 'name',
    },
    {
      title: '触发器分组',
      dataIndex: 'group',
    },
    {
      title: '定时表达式',
      dataIndex: 'cronExpression',
    },
    {
      title: '时间间隔',
      dataIndex: 'timeInterval',
      align: 'right',
      render: (val: string) => `${val} 秒`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (tag: number) =>{
            let color:string;
            if(_.isEqual(tag,1)){
              color = 'green';
            }else if(_.isEqual(tag,0)){
              color = 'red';
            }else{
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {status[tag]}
              </Tag>
          );
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
      type: 'triggerList/fetch',
    });
  }

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params: Partial<TableListParams> = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };

    dispatch({
      type: 'triggerList/fetch',
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
      type: 'triggerList/fetch',
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
        type: 'triggerList/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
      itemValues:{}
    });
  };

  handleUpdateModalVisible = (record : TableListItem ,flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
      title:'更新触发器',
      itemValues : record
    });
  };

  handleAdd = (fields:TableListItem) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'triggerList/saveTrigger',
      payload: fields,
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleRemove = (key:number) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'triggerList/remove',
      payload: {
        triggerId:key
      },
    });

    message.success('删除成功');
  };

  toggleStatus = (key:number,status:number) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'triggerList/toggleStatus',
      payload: {
        triggerId:key,
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
            <FormItem label="触发器名称">
              {getFieldDecorator('triggerName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="触发器分组">
              {getFieldDecorator('triggerGroup')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="触发器状态">
              {getFieldDecorator('triggerStatus')(
                <Select placeholder="请选择" allowClear={true} style={{ width: '100%' }}>
                  {status.map((item,index) => (<Option value={index}>{item}</Option>))}
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
      triggerList: { data },
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
