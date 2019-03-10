import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Input, Select, Button, Upload, Icon, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Edit.less';

const FormItem = Form.Item;
const { Option } = Select;
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
class RiderEdit extends PureComponent {
  state = {
    smallPic: [],
    largePic: [],
    previewimg: '',
  };

  componentDidMount() {}

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  handleChange = ({ smallPic }) => {
    this.setState({ smallPic });
  };

  handlePreview = file => {
    this.setState({
      previewimg: file.url,
    });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { smallPic, largePic, previewimg } = this.state;
    return (
      <PageHeaderWrapper title="骑手信息编辑">
        <Card className={styles.FormTable}>
          <Form style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="骑手名字">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入骑手名',
                  },
                ],
              })(<Input placeholder="请输入骑手名" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="选择楼栋">
              {getFieldDecorator('category', {
                rules: [
                  {
                    required: true,
                    message: '请选择楼栋',
                  },
                ],
              })(
                <Select
                  mode="multiple"
                  placeholder="请选择楼栋"
                  style={{
                    margin: '8px 0',
                  }}
                >
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="骑手电话">
              {getFieldDecorator('phonenumber', {
                rules: [
                  {
                    required: true,
                    message: '请输入骑手电话',
                  },
                ],
              })(<Input placeholder="请输入骑手电话" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="骑手身份证号码">
              {getFieldDecorator('ID', {
                rules: [
                  {
                    required: true,
                    message: '请输入骑手身份证号码',
                  },
                ],
              })(<Input placeholder="请输入骑手身份证号码" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="学生卡照片">
              {getFieldDecorator('smallPic', {
                rules: [
                  {
                    required: true,
                    message: '请上传学生卡照片',
                  },
                ],
              })(
                <Upload
                  action="/online/api/upload"
                  listType="picture-card"
                  fileList={smallPic}
                  onPreview={this.handlePreview}
                >
                  {smallPic.length >= 1 ? null : uploadButton}
                </Upload>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="身份证照片">
              {getFieldDecorator('largePic', {
                rules: [
                  {
                    required: true,
                    message: '请上传身份证照片',
                  },
                ],
              })(
                <Upload action="/online/api/upload" listType="picture-card" fileList={largePic}>
                  {largePic.length >= 1 ? null : uploadButton}
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
