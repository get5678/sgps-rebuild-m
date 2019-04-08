import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, message, Form, Select, Input, InputNumber, Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 10 },
  },
  wrapperCol: {
    xs: { span: 6 },
    sm: { span: 8 },
  },
};
@connect(({ commodity, loading }) => ({
  commodity,
  loading,
}))
@Form.create()
class CommodityDetail extends PureComponent {
  state = {};

  componentDidMount() {
    const {
      match: {
        params: { number },
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'commodity/commodityDetail',
      payload: {
        number,
        current: 1,
        errorCallback(msg) {
          message.error(msg);
        },
      },
    });
  }

  handleEdit = e => {
    e.preventDefault();
    const {
      form: { validateFields },
      commodity: { detail },
      dispatch,
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        if (detail.category_name === values.name) {
          // eslint-disable-next-line no-param-reassign
          values.name = undefined;
        }
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

  render() {
    const {
      commodity: { detail },
      match: {
        params: { number },
      },
      form: { getFieldDecorator },
    } = this.props;

    return (
      <PageHeaderWrapper title={`商品种类编号: ${number}`}>
        <Card>
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
            <Button type="primary" onClick={this.handleEdit}>
              修改
            </Button>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CommodityDetail;
