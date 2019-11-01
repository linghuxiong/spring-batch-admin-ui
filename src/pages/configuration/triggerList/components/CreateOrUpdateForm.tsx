import { Form, Input, Modal, DatePicker, Radio, InputNumber } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';

const FormItem = Form.Item;

import moment from 'moment';
import _ from 'lodash';
import { TableListItem } from '../data';

export interface CreateOrUpdateFormState {
  formVals: TableListItem;
}

interface CreateOrUpdateFormProps extends FormComponentProps {
  modalVisible: boolean;
  title: string;
  handleAdd: (fieldsValue: TableListItem) => void;
  handleModalVisible: () => void;
  values: Partial<TableListItem>;
}
class CreateOrUpdateForm extends Component<CreateOrUpdateFormProps, CreateOrUpdateFormState> {

  render() {
    const { modalVisible, form, handleAdd,handleModalVisible, title,values } = this.props;
    const { getFieldDecorator } = form;

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        fieldsValue.key = values.key;
        handleAdd(fieldsValue);
      }); 
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    return (
      <Modal
        destroyOnClose
        title={title}
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Form onSubmit={okHandle} hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="触发器名称">
            {getFieldDecorator('name', {
              initialValue: values.name,
              rules: [
                {
                  required: true,
                  message: '触发器名称不能为空',
                },
              ],
            })(<Input placeholder="请输入一个触发器名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="定时表达式">
            {getFieldDecorator('cronExpression', {
              initialValue: values.cronExpression,
            })(<Input placeholder="请输入cron表达式" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="触发时间间隔">
            {getFieldDecorator('timeInterval', {
              initialValue: values.timeInterval,
            })(<InputNumber min={0} placeholder="请输入一个触发器时间间隔" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="创建时间">
            {getFieldDecorator('createdAt', {
              initialValue: moment(values.createdAt?values.createdAt:(new Date())),
            })(
              <DatePicker showTime style={{ width: '100%' }} disabled />,
            )}
          </FormItem>
          {values.createdAt?
          <FormItem {...formItemLayout} label="更新时间时间">
            {getFieldDecorator('updatedAt', {
              initialValue: moment(values.updatedAt),
            })(
              <DatePicker showTime style={{ width: '100%' }} disabled />,
            )}
          </FormItem>:null}
          <FormItem
            {...formItemLayout}
            label="状态"
          >
            <div>
              {getFieldDecorator('status', {
                initialValue: '1',
              })(
                <Radio.Group>
                  <Radio value="1">
                    启动
                  </Radio>
                  <Radio value="0">
                    停止
                  </Radio>
                </Radio.Group>,
              )}
            </div>
          </FormItem>
        </Form>
      </Modal>
    );
  }
};

export default Form.create<CreateOrUpdateFormProps>()(CreateOrUpdateForm);
