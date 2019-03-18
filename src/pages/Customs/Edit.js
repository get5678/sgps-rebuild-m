import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Input, Button, Upload, Icon } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Edit.less';

const FormItem = Form.Item;
const { TextArea } = Input;

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
const uploadButton = (
  <div>
    <Icon type="plus" />
    <div className="ant-upload-text">Upload</div>
  </div>
);

@connect(({ fruit, loading }) => ({
  fruit,
  loading,
}))
@Form.create()
class UserManageEdit extends PureComponent {
  state = {
    smallPic: [],
  };

  handleReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { smallPic } = this.state;

    return (
      <PageHeaderWrapper title="用户信息编辑">
        <Card className={styles.FormTable}>
          <Form style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="用户姓名">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入用户姓名',
                  },
                ],
              })(<Input placeholder="请输入用户姓名" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="选择用户所在楼栋">
              {getFieldDecorator('category', {
                rules: [
                  {
                    required: true,
                    message: '请选择用户所在楼栋',
                  },
                ],
              })(
                <Input
                  placeholder="请选择楼栋"
                  style={{
                    margin: '8px 0',
                  }}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="用户电话">
              {getFieldDecorator('phonenumber', {
                rules: [
                  {
                    required: true,
                    message: '请输入用户电话',
                  },
                ],
              })(<Input placeholder="请输入用户电话" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="用户头像">
              {getFieldDecorator('smallPic', {
                rules: [
                  {
                    required: true,
                    message: '请上传用户头像',
                  },
                ],
              })(
                <Upload action="/online/api/upload" listType="picture-card" fileList={smallPic}>
                  {smallPic.length >= 1 ? null : uploadButton}
                </Upload>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="个人介绍">
              {getFieldDecorator('detail')(<TextArea placeholder="请输入个人介绍" />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={false}>
                提交
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
