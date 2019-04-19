import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Card, Input, Button, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Edit.less';

const FormItem = Form.Item;
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

@connect(({ shop, loading }) => ({
  shop,
  loading,
}))
@Form.create()
class ShopEdit extends PureComponent {
  componentDidMount() {}

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  handleEdit = e => {
    const {
      form,
      dispatch,
      history: {
        location: { query },
      },
    } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (query.admin_name === values.name) {
        // eslint-disable-next-line no-param-reassign
        values.name = undefined;
      }
      if (!err) {
        dispatch({
          type: 'shop/shopEdit',
          payload: {
            errorCallback(msg) {
              message.error(msg);
            },
            successCallback() {
              message.success('修改成功');
              dispatch(routerRedux.replace('/shop/list'));
            },
            values,
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      history: {
        location: { query },
      },
    } = this.props;

    return (
      <PageHeaderWrapper title="店铺信息编辑">
        <Card className={styles.FormTable}>
          <Form style={{ marginTop: 8 }} onSubmit={this.handleEdit}>
            <FormItem {...formItemLayout} label="店铺名称">
              {getFieldDecorator('name', {
                initialValue: query.admin_name,
              })(<Input placeholder="请输入店铺名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="店铺账号">
              {getFieldDecorator('phone', {
                initialValue: query.admin_phone,
                rules: [
                  {
                    required: true,
                    message: '请输入店铺账号',
                  },
                ],
              })(<Input placeholder="请输入店铺账号" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="新账号">
              {getFieldDecorator('newPhone')(<Input placeholder="请输入修改后的新账号" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="原密码">
              {getFieldDecorator('password', {
                rules: [
                  {
                    message: '请输入之前的密码',
                    required: true,
                  },
                ],
              })(<Input placeholder="请输入之前的密码" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="新密码">
              {getFieldDecorator('newPassword')(<Input placeholder="请输入修改后的密码" />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={false}>
                提交
              </Button>
              <Button htmlType="reset" style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ShopEdit;
