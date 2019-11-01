import { Form, Input, Modal, DatePicker, Radio, Select } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React, { Component } from 'react';

const { Option } = Select;

const FormItem = Form.Item;

import moment from 'moment';
import _ from 'lodash';
import { TableListItem } from '../data';
import TextArea from 'antd/lib/input/TextArea';

const types = ['手动任务','日任务','周任务','月任务','其他周期任务'];

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
    const { getFieldDecorator,getFieldValue } = form;

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        fieldsValue.id = values.id;
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
          <FormItem {...formItemLayout} label="任务名称">
            {getFieldDecorator('name', {
              initialValue: values.name,
              rules: [
                {
                  required: true,
                  message: '任务名称不能为空',
                },
              ],
            })(<Input placeholder="请输入一个任务名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="注册名称">
            {getFieldDecorator('estimatedTime', {
              initialValue: values.estimatedTime,
            })(<Input placeholder="请输入注册名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="回调路径">
            {getFieldDecorator('callbachUrl', {
              initialValue: values.callbachUrl,
            })(<Input placeholder="回调接口路径" />)}
          </FormItem>
          <Form.Item {...formItemLayout} label="任务类型">
          {getFieldDecorator('type', {
            initialValue : values.type == null ? 0 :values.type,
            rules: [{ required: true, message: '请选择一个任务类型' }],
          })(
            <Select placeholder="请选择任务类型" >
              {types.map((item,index) => (<Option value={index}>{item}</Option>))}
            </Select>,
          )}
        </Form.Item>
          <FormItem {...formItemLayout} label="触发器名称" style={{display:  _.isEqual(getFieldValue('type'),0) ? 'none' : 'block',}}>
            {getFieldDecorator('triggerName', {
              initialValue: values.triggerName,
            })(<Input placeholder="请输入触发器名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="任务描述">
              {getFieldDecorator('jobDesc')(  
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder="请输入任务描述"
                  rows={4}
                />,
              )}
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
