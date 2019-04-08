import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Card, Input, Select, Button, InputNumber, message } from 'antd';
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
@connect(({ rider, loading }) => ({
  rider,
  loading,
}))
@Form.create()
class RiderEdit extends PureComponent {
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
        type: 'rider/riderDetail',
        payload: {
          number,
          current,
        },
      });
    }
  }

  handleEdit = () => {
    const {
      dispatch,
      form: { validateFields },
      rider: { detail },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        if (detail.rider_name === values.name) {
          // eslint-disable-next-line no-param-reassign
          values.name = undefined;
        }
        if (detail.rider_phone === values.phone) {
          // eslint-disable-next-line no-param-reassign
          values.phone = undefined;
        }
        dispatch({
          type: 'rider/riderEdit',
          payload: {
            values,
            errorCallback(msg) {
              message.error(msg);
            },
            successCallback() {
              message.success('修改成功');
              dispatch(routerRedux.replace('/rider/list'));
            },
          },
        });
      }
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'rider/riderRegiste',
          payload: {
            values,
            errorCallback(msg) {
              message.error(msg);
            },
            successCallback() {
              message.success('添加成功');
              dispatch(routerRedux.replace('/rider/list'));
            },
          },
        });
      }
    });
  };

  renderAddButton = () => {
    return (
      <Button type="primary" htmlType="submit">
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

  renderButton = () => {
    const { addIf } = this.state;
    return addIf ? this.renderAddButton() : this.renderEditButton();
  };

  render() {
    const {
      form: { getFieldDecorator },
      rider: { detail },
    } = this.props;
    const { addIf } = this.state;
    return (
      <PageHeaderWrapper title="骑手信息编辑">
        <Card className={styles.FormTable}>
          <Form style={{ marginTop: 8 }} onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="骑手编号">
              {getFieldDecorator('id', {
                initialValue: addIf ? '' : detail.rider_id,
                rules: [
                  {
                    required: true,
                    message: '请输入骑手编号',
                  },
                ],
              })(<InputNumber disabled={!addIf} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="骑手名字">
              {getFieldDecorator('name', {
                initialValue: addIf ? '' : detail.rider_name,
                rules: [
                  {
                    required: true,
                    message: '请输入骑手名',
                  },
                ],
              })(<Input placeholder="请输入骑手名" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="选择骑手性别">
              {getFieldDecorator('sex', {
                initialValue: addIf ? '' : detail.rider_sex,
              })(
                <Select>
                  <Option value={0}>男</Option>
                  <Option value={1}>女</Option>
                  <Option value={2}>不详</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="骑手电话">
              {getFieldDecorator('phone', {
                initialValue: addIf ? '' : detail.rider_phone,
                rules: [
                  {
                    required: true,
                    message: '请输入骑手电话',
                  },
                ],
              })(<Input placeholder="请输入骑手电话" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="骑手身份证号码">
              {getFieldDecorator('identity_number', {
                initialValue: addIf ? '' : detail.rider_identity_number,
                rules: [
                  {
                    required: true,
                    message: '请输入骑手身份证号码',
                  },
                ],
              })(<Input placeholder="请输入骑手身份证号码" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="负责楼栋">
              {getFieldDecorator('building_id', {
                initialValue: addIf ? '' : detail.building_id,
              })(<InputNumber />)}
            </FormItem>

            <FormItem {...formItemLayout} label="骑手状态">
              {getFieldDecorator('state', {
                initialValue: addIf ? '' : detail.rider_state,
              })(
                <Select>
                  <Option value={0}>冻结</Option>
                  <Option value={1}>正常</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              {this.renderButton()}
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

export default RiderEdit;
