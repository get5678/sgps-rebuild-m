import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Card, Input, Button, Select, message, InputNumber } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Edit.less';

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
@connect(({ customs, loading }) => ({
  customs,
  loading,
}))
@Form.create()
class UserManageEdit extends PureComponent {
  componentDidMount() {
    const {
      match: { params },
      dispatch,
    } = this.props;

    dispatch({
      type: 'customs/customsDetail',
      payload: {
        params,
      },
    });
  }

  handleReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  handleEdit = e => {
    const {
      dispatch,
      form: { validateFields },
      customs: { detail },
    } = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      // eslint-disable-next-line no-param-reassign
      // values.building = undefined;
      if (detail.user_phone === values.phone) {
        // eslint-disable-next-line no-param-reassign
        values.phone = undefined;
      }
      if (!err) {
        dispatch({
          type: 'customs/customsEdit',
          payload: {
            values,
            errorCallback(msg) {
              message.error(msg);
            },
            successCallback() {
              message.success('修改成功');
              dispatch(routerRedux.replace('/customs/list'));
            },
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
      <PageHeaderWrapper title="用户信息编辑">
        <Card className={styles.FormTable}>
          <Form style={{ marginTop: 8 }} onSubmit={this.handleEdit}>
            <FormItem {...formItemLayout} label="用户编号">
              {getFieldDecorator('id', {
                initialValue: query.user_id,
                rules: [
                  {
                    required: true,
                    message: '请输入用户编号',
                  },
                ],
              })(<InputNumber disabled />)}
            </FormItem>
            <FormItem {...formItemLayout} label="用户姓名">
              {getFieldDecorator('name', {
                initialValue: query.user_name,
              })(<Input placeholder="请输入用户姓名" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="用户性别">
              {getFieldDecorator('sex', {
                initialValue: query.user_sex,
              })(
                <Select>
                  <Option value={0}>男</Option>
                  <Option value={1}>女</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="用户所在楼栋">
              {getFieldDecorator('building', {
                initialValue: query.building_name,
              })(
                <Input
                  style={{
                    margin: '8px 0',
                  }}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="用户电话">
              {getFieldDecorator('phone', {
                initialValue: query.user_phone,
              })(<Input placeholder="请输入用户电话" />)}
            </FormItem>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={false}>
                修改
              </Button>
              <Button htmlType="reset" style={{ marginLeft: 8 }} onClick={this.handleReset}>
                重置
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default UserManageEdit;
