import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Button, Card, Input, message, InputNumber, Select } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Edit.less';

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
@connect(({ buildings, loading }) => ({
  buildings,
  loading: loading.effects['buildings/buildingsEdit'],
}))
@Form.create()
class BuildingsEdit extends PureComponent {
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
        type: 'buildings/buildingDetail',
        payload: {
          number,
          current,
        },
      });
    }
  }

  renderAddButton = () => {
    return (
      <Button type="primary" onClick={this.handleAdd}>
        添加
      </Button>
    );
  };

  renderEditButton = () => {
    return (
      <Button type="primary" htmlType="submit">
        修改
      </Button>
    );
  };

  handleSubmit = e => {
    const {
      form,
      dispatch,
      buildings: { detail },
    } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (detail.building_name === values.name) {
        // eslint-disable-next-line no-param-reassign
        values.name = undefined;
      }
      if (!err) {
        dispatch({
          type: 'buildings/buildingsEdit',
          payload: {
            ...values,
            successCallback() {
              message.success('修改成功');
              dispatch(routerRedux.replace('/buildings/list'));
            },
            errorCallback(msg) {
              message.error(msg);
            },
          },
        });
      }
    });
  };

  handleAdd = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'buildings/buildingsAdd',
          payload: {
            ...values,
            successCallback() {
              message.success('添加成功');
              dispatch(routerRedux.replace('/buildings/list'));
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

  render() {
    const {
      form: { getFieldDecorator },
      buildings: { detail },
    } = this.props;
    const { addIf } = this.state;
    return (
      <PageHeaderWrapper titlt="楼栋信息编辑">
        <Card className={styles.FormTable}>
          <Form style={{ marginTop: 8 }} onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="楼栋编号">
              {getFieldDecorator('id', {
                initialValue: addIf ? '' : detail.building_id,
                rules: [
                  {
                    message: '请输入楼栋编号',
                    required: true,
                  },
                ],
              })(<InputNumber disabled={!addIf} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="楼栋名称">
              {getFieldDecorator('name', {
                initialValue: addIf ? '' : detail.building_name,
                rules: [
                  {
                    message: '请输入楼栋名称',
                    required: true,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="楼栋状态">
              {getFieldDecorator('is_open', {
                initialValue: addIf ? '' : detail.building_is_open,
                rules: [
                  {
                    message: '请输入楼栋状态',
                    required: true,
                  },
                ],
              })(
                <Select>
                  <Option value={1}>1: 开放</Option>
                  <Option value={2}>2: 不开放</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              {this.renderButton()}
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

export default BuildingsEdit;
