import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Form, Card, Input, Select, Button, DatePicker, InputNumber, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Edit.less';

const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 10 },
    md: { span: 6 },
  },
};
const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 16, offset: 9 },
  },
};

@connect(({ coupons, loading }) => ({
  coupons,
  loading,
}))
@Form.create()
class CouponstList extends PureComponent {
  state = {
    addIf: false,
  };

  componentDidMount() {
    const {
      match: {
        params: { number },
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
        type: 'coupons/couponsDetail',
        payload: {
          number,
          errorCallback(msg) {
            message.error(msg);
          },
        },
      });
    }
  }

  handleEdit = e => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      // eslint-disable-next-line no-param-reassign
      values.name = undefined;
      // eslint-disable-next-line no-param-reassign
      values.limited_time = moment(values.limited_time).format('YYYY-MM-DD');
      if (!err) {
        dispatch({
          type: 'coupons/couponsEdit',
          payload: {
            values,
            successCallback() {
              message.success('修改成功');
              dispatch(routerRedux.replace('/coupons/list'));
            },
            errorCallback(msg) {
              message.error(msg);
            },
          },
        });
      }
    });
  };

  handleAdd = e => {
    const {
      form: { validateFields },
      dispatch,
    } = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        // eslint-disable-next-line no-param-reassign
        values.limited_time = moment(values.limited_time).format('YYYY-MM-DD');
        dispatch({
          type: 'coupons/couponsAdd',
          payload: {
            successCallback() {
              message.success('添加成功');
              dispatch(routerRedux.replace('/coupons/list'));
            },
            errorCallback(msg) {
              message.error(msg);
            },
            values,
          },
        });
      }
    });
  };

  renderButton = () => {
    const { addIf } = this.state;
    return addIf ? this.renderAddButton() : this.renderEditButton();
  };

  renderAddButton = () => {
    return (
      <Button type="primary" onClick={this.handleAdd}>
        添加
      </Button>
    );
  };

  renderEditButton = () => {
    return (
      <Button type="primary" onClick={this.handleEdit}>
        修改
      </Button>
    );
  };

  render() {
    const {
      form: { getFieldDecorator },
      coupons: { detail },
    } = this.props;
    const { addIf } = this.state;
    return (
      <PageHeaderWrapper title="优惠券信息编辑">
        <Card className={styles.FormTable}>
          <Form style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="优惠券编号">
              {getFieldDecorator('id', {
                initialValue: addIf ? undefined : detail.coupons_id,
              })(<InputNumber disabled={addIf} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="优惠券名">
              {getFieldDecorator('name', {
                initialValue: addIf ? undefined : detail.coupons_name,
                rules: [
                  {
                    required: false,
                    message: '请输入优惠券名',
                  },
                ],
              })(<Input placeholder="请输入优惠券名" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="优惠券状态">
              {getFieldDecorator('state', {
                initialValue: addIf ? undefined : detail.coupons_state,
              })(
                <Select>
                  <Option value={0}>过期</Option>
                  <Option value={1}>正常</Option>
                  <Option value={2}>未投入使用</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="优惠券类别">
              {getFieldDecorator('type', {
                initialValue: addIf ? undefined : detail.coupons_type,
                rules: [
                  {
                    required: true,
                    message: '请选择优惠券类别',
                  },
                ],
              })(
                <Select
                  placeholder="请选择类别"
                  style={{
                    margin: '8px 0',
                  }}
                >
                  <Option value={0}>折扣</Option>
                  <Option value={1}>减免</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="优惠券折扣">
              {getFieldDecorator('discount', {
                initialValue: addIf ? undefined : detail.coupons_discount,
                rules: [
                  {
                    required: false,
                    message: '请输入折扣多少',
                  },
                ],
              })(<InputNumber placeholder="优惠券折扣" min={0} style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="优惠券减免金额">
              {getFieldDecorator('price', {
                initialValue: addIf ? undefined : detail.coupons_price,
                rules: [
                  {
                    required: false,
                    message: '请输入折扣多少',
                  },
                ],
              })(<InputNumber placeholder="优惠券减免金额" min={0} style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="优惠券使用条件">
              {getFieldDecorator('fill', {
                initialValue: addIf ? undefined : detail.coupons_fill,
                rules: [
                  {
                    required: false,
                    message: '请选择优惠券使用范围',
                  },
                ],
              })(<InputNumber placeholder="满多少可使用" style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="到期时间">
              {getFieldDecorator('limited_time', {
                initialValue: addIf ? undefined : moment(detail.coupons_limited_time, 'YYYY-MM-DD'),
                rules: [
                  {
                    required: true,
                    message: '请选择到期时间',
                  },
                ],
              })(<DatePicker style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              {this.renderButton()}
              <Button htmlType="reset" style={{ marginLeft: 8 }}>
                重置
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CouponstList;
