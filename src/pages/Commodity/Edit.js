import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Card, Button, Form, Input, Select, message, InputNumber } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 4 },
    sm: { span: 6 },
    md: { span: 8 },
  },
};
const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 7 },
  },
};
@connect(({ commodity, loading }) => ({
  commodity,
  loading,
}))
@Form.create()
class CommodityEdit extends PureComponent {
  state = {
    addIf: false,
  };

  componentDidMount() {
    const {
      match: {
        params: { number, current },
      },
      dispatch,
    } = this.props;
    const reg = /^[\d]+$/;
    if (!reg.test(number)) {
      this.setState({
        addIf: true,
      });
    }
    if (reg.test(number)) {
      dispatch({
        type: 'commodity/commodityDetail',
        payload: {
          number,
          current,
        },
      });
    }
  }

  handleSubmit = e => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        // console.log(values)
        dispatch({
          type: 'commodity/commodityAdd',
          payload: {
            errorCallback(msg) {
              message.error(msg);
            },
            successCallback() {
              message.success('添加成功');
              dispatch(routerRedux.replace('/commodity/list'));
            },
            values,
          },
        });
      }
    });
  };

  handleEdit = e => {
    const {
      form,
      dispatch,
      commodity: { detail },
    } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (detail.category_name === values.name) {
        // eslint-disable-next-line no-param-reassign
        values.name = undefined;
      }

      if (!err) {
        dispatch({
          type: 'commodity/commodityEdit',
          payload: {
            values,
            successCallback() {
              message.success('修改成功');
              dispatch(routerRedux.replace('/commodity/list'));
            },
            errorCallback(msg) {
              message.error(msg);
            },
          },
        });
      }
    });
  };

  handleReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  renderButton = () => {
    const { addIf } = this.state;
    return addIf ? this.renderAddButton() : this.renderEditButton();
  };

  renderAddButton = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="商品种类名称">
          {getFieldDecorator('name', {
            initialValue: '',
            rules: [
              {
                message: '请输入商品种类名称',
                required: true,
              },
            ],
          })(<Input placeholder="请输入商品种类名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="商品种类状态">
          {getFieldDecorator('state', {
            initialValue: '',
          })(
            <Select>
              <Option value={0}>0: 冻结</Option>
              <Option value={1}>1: 正常</Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...submitFormLayout}>
          <Button type="primary" htmlType="submit">
            添加
          </Button>
          <Button onClick={this.handleReset} style={{ marginLeft: 8 }}>
            重置
          </Button>
        </FormItem>
      </Form>
    );
  };

  renderEditButton = () => {
    const {
      commodity: { detail },
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form>
        <FormItem {...formItemLayout} label="商品种类编号">
          {getFieldDecorator('id', {
            initialValue: detail.category_id,
            rules: [
              {
                required: true,
                message: '请输入id',
              },
            ],
          })(<InputNumber disabled />)}
        </FormItem>
        <FormItem {...formItemLayout} label="商品种类名称">
          {getFieldDecorator('name', {
            initialValue: detail.category_name,
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="商品状态">
          {getFieldDecorator('state', {
            initialValue: detail.category_state,
            rules: [
              {
                required: true,
                message: '请输入商品状态',
              },
            ],
          })(
            <Select style={{ width: '100%' }}>
              <Option value={0}>冻结</Option>
              <Option value={1}>正常</Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="是否删除">
          {getFieldDecorator('is_delete', {
            initialValue: detail.category_is_delete,
            rules: [
              {
                required: true,
                message: '请选择是否删除',
              },
            ],
          })(
            <Select style={{ width: '100%' }}>
              <Option value={0}>删除</Option>
              <Option value={1}>正常</Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...submitFormLayout}>
          <Button type="primary" onClick={this.handleEdit}>
            修改
          </Button>
          <Button onClick={this.handleReset} style={{ marginLeft: 8 }}>
            重置
          </Button>
        </FormItem>
      </Form>
    );
  };

  render() {
    return (
      <PageHeaderWrapper title="商品种类编辑">
        <Card>{this.renderButton()}</Card>
      </PageHeaderWrapper>
    );
  }
}

export default CommodityEdit;
