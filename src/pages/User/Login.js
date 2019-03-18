import React, { Component } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
import { message } from 'antd';
import Login from '@/components/Login';
import Link from 'umi/link';
import styles from './Login.less';

const { UserName, Password, Submit, Captcha } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
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

  handleSubmit = (err, values) => {
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          id: '1',
          errorCallback: data => {
            message.error(data.msg);
          },
        },
      });
    }
  };

  render() {
    const { submitting } = this.props;

    return (
      <div className={styles.main}>
        <Login
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <UserName name="phone" />
          <Password
            name="password"
            onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
          />
          <Captcha name="captcha" />

          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
        </Login>
        <Link to="/user/register">注册</Link>
      </div>
    );
  }
}

export default LoginPage;
