import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Input, Select, Button, DatePicker, InputNumber } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Edit.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;

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
const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 7 },
  },
};

@connect(({ discount, loading }) => ({
  discount,
  loading,
}))
@Form.create()
class DiscountList extends PureComponent {
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <PageHeaderWrapper title="优惠券信息编辑">
        <Card className={styles.FormTable}>
          <Form style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="优惠券名">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入优惠券名',
                  },
                ],
              })(<Input placeholder="请输入优惠券名" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="类别">
              {getFieldDecorator('category', {
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
                  <Option value="1">满减</Option>
                  <Option value="2">折扣</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="享受特惠的最低价">
              {getFieldDecorator('fill', {
                rules: [
                  {
                    required: true,
                    message: '请输入享受特惠的最低价',
                  },
                ],
              })(<InputNumber placeholder="总价" min={0} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="折扣数量">
              {getFieldDecorator('discount', {
                rules: [
                  {
                    required: true,
                    message: '请输入折扣多少',
                  },
                ],
              })(<InputNumber placeholder="折扣数量" min={0} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="使用范围">
              {getFieldDecorator('calWay', {
                rules: [
                  {
                    required: true,
                    message: '请选择优惠券使用范围',
                  },
                ],
              })(
                <Select
                  mode="multiple"
                  placeholder="请选择使用范围"
                  style={{
                    margin: '8px 0',
                  }}
                >
                  <Option value="1">热销</Option>
                  <Option value="2">个卖</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="有效时间">
              {getFieldDecorator('date', {
                rules: [
                  {
                    required: true,
                    message: '请选择有效时间',
                  },
                ],
              })(<RangePicker style={{ width: '100%' }} placeholder={['开始时间', '结束时间']} />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={false}>
                提交
              </Button>
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

export default DiscountList;
