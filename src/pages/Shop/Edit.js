import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Input, Button, Upload, Icon } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Edit.less';

const FormItem = Form.Item;
// const { Option } = Select;
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
    <div className="ant-upload-text">上传图片</div>
  </div>
);
@connect(({ shop, loading }) => ({
  shop,
  loading,
}))
@Form.create()
class ShopEdit extends PureComponent {
  state = {
    IDPic: [],
    fileList: [],
  };

  componentDidMount() {}

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    // eslint-disable-next-line no-unused-vars
    const { IDPic, fileList } = this.state;
    return (
      <PageHeaderWrapper title="店铺信息编辑">
        <Card className={styles.FormTable}>
          <Form style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="店铺名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入店铺名称',
                  },
                ],
              })(<Input placeholder="请输入店铺名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="店铺地址">
              {getFieldDecorator('place', {
                rules: [
                  {
                    required: true,
                    message: '请输入店铺地址',
                  },
                ],
              })(<Input placeholder="请输入店铺地址" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="店铺电话">
              {getFieldDecorator('phonenumber', {
                rules: [
                  {
                    required: true,
                    message: '请输入店铺电话',
                  },
                ],
              })(<Input placeholder="请输入店铺电话" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="老板身份证号码">
              {getFieldDecorator('IDPic', {
                rules: [
                  {
                    required: true,
                    message: '请输入老板身份证号码',
                  },
                ],
              })(<Input placeholder="请输入老板身份证号码" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="老板照片">
              <Upload
                action="//jsonplaceholder.typicode.com/posts/"
                listType="picture-card"
                fileList={IDPic}
                onChange={this.handleChange}
              >
                {IDPic.length >= 2 ? null : uploadButton}
              </Upload>
            </FormItem>

            <FormItem {...formItemLayout} label="店铺介绍">
              {getFieldDecorator('detail')(<TextArea placeholder="请输入店铺介绍" />)}
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
