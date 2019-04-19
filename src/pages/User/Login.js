/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { Link } from 'dva/router';
import styles from './Login.less';

const FormItem = Form.Item;
@connect(({ login, loading }) => ({
  login,
  loading: loading.effects['login/login'],
}))
@Form.create()
class LoginPage extends Component {
  state = {
    count: 0,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/loginIdentify',
      payload: {
        id: '1',
        errorCallback(msg) {
          message.error(msg);
        },
      },
    });
  }

  onGetCaptcha = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((_, values) => {
      // eslint-disable-next-line no-param-reassign
      values.type = '0';
      this.setState({
        count: 1,
      });
      dispatch({
        type: 'login/getCaptcha',
        payload: {
          values,
          errorCallback(msg) {
            message.error(msg);
          },
        },
      });
    });
  };

  handleLogout = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'login/logout',
          payload: {
            values,
            errorCallback(msg) {
              message.error(msg);
            },
            successCallback() {
              message.success('退出登录');
            },
          },
        });
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'login/manageLogin',
          payload: {
            values,
            errorCallback(msg) {
              message.error(msg);
            },
            successCallback() {
              message.success('登陆成功');
            },
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      login: { imgs = '' },
    } = this.props;
    const { count } = this.state;
    const img = imgs.replace('\\', '');
    return (
      <div className={styles.main}>
        <Form>
          <FormItem>
            {getFieldDecorator('phone', {
              rules: [
                {
                  required: true,
                  message: '请输入手机号码',
                },
                {
                  pattern: /^\d{11}$/,
                  message: '请输入11位手机号',
                },
              ],
            })(<Input size="large" placeholder="手机号" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请输入密码',
                },
              ],
            })(<Input size="large" type="password" placeholder="请输入密码 " />)}
          </FormItem>
          <FormItem>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('code', {
                  rules: [
                    {
                      required: true,
                      message: '请输入验证码',
                    },
                  ],
                })(<Input size="large" placeholder="请输入验证码" />)}
              </Col>
              <Col span={8}>
                <Button size="large" className={styles.getCaptcha} onClick={this.onGetCaptcha}>
                  {count === 0 ? '获取验证码' : '换一张'}
                </Button>
              </Col>
            </Row>
          </FormItem>
          <div dangerouslySetInnerHTML={{ __html: img }} />
          <FormItem>
            <Button
              size="large"
              className={styles.submit}
              type="primary"
              onClick={this.handleSubmit}
              block
            >
              登录
            </Button>
            <Link className={styles.login} to="/User/Login" />
          </FormItem>
        </Form>

        <Link to="/user/register">注册</Link>
        {/* <Button onClick={this.handleLogout}>退出登录</Button> */}
      </div>
    );
  }
}

export default LoginPage;
