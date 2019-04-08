/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Link, routerRedux } from 'dva/router';
import { Form, Input, Button, Row, Col, Popover, message, Progress, Select } from 'antd';
import styles from './Register.less';

const FormItem = Form.Item;
const { Option } = Select;
const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="validation.password.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="validation.password.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="validation.password.strength.short" />
    </div>
  ),
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
class Register extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
  };

  componentDidUpdate() {
    const { form, register } = this.props;
    const account = form.getFieldValue('mail');
    if (register.status === 'ok') {
      routerRedux.push({
        pathname: '/user/register-result',
        state: {
          account,
        },
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();

    form.validateFields((err, values) => {
      this.setState({
        count: 1,
      });
      // eslint-disable-next-line no-param-reassign
      values.type = '1';
      dispatch({
        type: 'register/getCaptcha',
        payload: {
          values,
          errorCallback(msg) {
            message.error(msg);
          },
        },
      });
    });
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        dispatch({
          type: 'register/manageRegiste',
          payload: {
            ...values,
            errorCallback(msg) {
              message.error(msg);
            },
            successCallback() {
              message.success('注册成功');
              dispatch(routerRedux.replace('/user/login'));
            },
          },
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: formatMessage({ id: 'validation.password.required' }),
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const {
      form,
      submitting,
      register: { imgs = ' ' },
    } = this.props;
    const { getFieldDecorator } = form;
    const { count, help, visible } = this.state;
    const img = imgs.replace('\\', '');
    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入管理员名',
                },
              ],
            })(<Input size="large" placeholder="管理员名称" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('identity', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '请选择权限',
                },
              ],
            })(
              <Select size="large">
                <Option value={0}>总店</Option>
                <Option value={1}>分店</Option>
              </Select>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('phone', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.phone-number.required' }),
                },
                {
                  pattern: /^\d{11}$/,
                  message: formatMessage({ id: 'validation.phone-number.wrong-format' }),
                },
              ],
            })(<Input size="large" placeholder="手机号" />)}
          </FormItem>
          <FormItem help={help}>
            <Popover
              getPopupContainer={node => node.parentNode}
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    <FormattedMessage id="validation.password.strength.msg" />
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={visible}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  placeholder={formatMessage({ id: 'form.password.placeholder' })}
                />
              )}
            </Popover>
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.confirm-password.required' }),
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(
              <Input
                size="large"
                type="password"
                placeholder={formatMessage({ id: 'form.confirm-password.placeholder' })}
              />
            )}
          </FormItem>

          <FormItem>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('code', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'validation.verification-code.required' }),
                    },
                  ],
                })(
                  <Input
                    size="large"
                    placeholder={formatMessage({ id: 'form.verification-code.placeholder' })}
                  />
                )}
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
              loading={submitting}
              className={styles.submit}
              type="primary"
              onClick={this.handleSubmit}
            >
              注册
            </Button>
            <Link className={styles.login} to="/User/Login">
              <FormattedMessage id="app.register.sign-in" />
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Register;
