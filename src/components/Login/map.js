import React from 'react';
import { Icon } from 'antd';
import styles from './index.less';

export default {
  UserName: {
    props: {
      size: 'large',
      id: 'userName',
      prefix: <Icon type="user" className={styles.prefixIcon} />,
      placeholder: '账号为11位有效账号',
    },
    rules: [
      {
        required: true,
        message: '请输入正确的手机号!',
        pattern: /^1\d{10}$/,
      },
    ],
  },
  Password: {
    props: {
      size: 'large',
      prefix: <Icon type="lock" className={styles.prefixIcon} />,
      type: 'password',
      id: 'password',
      placeholder: '输入密码',
    },
    rules: [
      {
        required: true,
        message: '请输入正确的密码!',
      },
    ],
  },
  Mobile: {
    props: {
      size: 'large',
      prefix: <Icon type="mobile" className={styles.prefixIcon} />,
      placeholder: 'mobile number',
    },
    rules: [
      {
        required: true,
        message: 'Please enter mobile number!',
      },
      {
        pattern: /^1\d{10}$/,
        message: 'Wrong mobile number format!',
      },
    ],
  },
  Captcha: {
    props: {
      size: 'large',
      prefix: <Icon type="mobile" className={styles.prefixIcon} />,
      placeholder: '请输入验证码',
    },
    rules: [
      {
        required: true,
        message: '请输入验证码!',
      },
    ],
  },
};
