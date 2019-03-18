import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Input, Select, Button, InputNumber, Radio, Upload, Icon } from 'antd';
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
class FruitList extends PureComponent {
  state = {
    smallPic: [],
    largePic: [],
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { smallPic, largePic } = this.state;

    return (
      <PageHeaderWrapper title="商品信息编辑">
        <Card className={styles.FormTable}>
          <Form style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="商品名">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入商品名',
                  },
                ],
              })(<Input placeholder="请输入商品名" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="类别">
              {getFieldDecorator('category', {
                rules: [
                  {
                    required: true,
                    message: '请选择商品类别',
                  },
                ],
              })(
                <Select
                  mode="multiple"
                  placeholder="请选择类别"
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
            <FormItem {...formItemLayout} label="计价方式">
              {getFieldDecorator('calWay', {
                rules: [
                  {
                    required: true,
                    message: '请选择商品计价方式',
                  },
                ],
              })(
                <Select
                  // mode="multiple"
                  placeholder="请选择计价方式"
                  style={{
                    margin: '8px 0',
                  }}
                >
                  <Option value="1">/斤</Option>
                  <Option value="2">/个</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="原价">
              {getFieldDecorator('originPrice', {
                rules: [
                  {
                    required: true,
                    message: '请输入商品原价',
                  },
                ],
              })(<InputNumber placeholder="原价" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="折扣价">
              {getFieldDecorator('disCountPrice', {
                rules: [
                  {
                    required: true,
                    message: '请输入商品折扣价',
                  },
                ],
              })(<InputNumber placeholder="折扣价" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="数量">
              {getFieldDecorator('amount', {
                rules: [
                  {
                    required: true,
                    message: '请输入商品数量',
                  },
                ],
              })(<InputNumber placeholder="数量" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="是否热销">
              {getFieldDecorator('proStatus', {
                initialValue: '0',
              })(
                <Radio.Group>
                  <Radio value="0">是</Radio>
                  <Radio value="1">否</Radio>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="小图">
              {getFieldDecorator('smallPic', {
                rules: [
                  {
                    required: true,
                    message: '请上传商品小图',
                  },
                ],
              })(
                <Upload action="/online/api/upload" listType="picture-card" fileList={smallPic}>
                  {smallPic.length >= 1 ? null : uploadButton}
                </Upload>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="大图">
              {getFieldDecorator('largePic', {
                rules: [
                  {
                    required: true,
                    message: '请上传商品大图',
                  },
                ],
              })(
                <Upload action="/online/api/upload" listType="picture-card" fileList={largePic}>
                  {largePic.length >= 1 ? null : uploadButton}
                </Upload>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="商品介绍">
              {getFieldDecorator('detail')(<TextArea placeholder="请输入商品介绍" />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={false}>
                提交
              </Button>
              <Button htmlType="reset" style={{ marginLeft: 8 }}>
                重置
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default FruitList;
