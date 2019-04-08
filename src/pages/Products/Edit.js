import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Card, Input, Select, Button, Upload, Icon, message, InputNumber } from 'antd';
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
    <div className="ant-upload-text">上传图片</div>
  </div>
);
@connect(({ products, loading }) => ({
  products,
  loading,
}))
@Form.create()
class ProductsEdit extends PureComponent {
  state = {
    addIf: false,
    previewVisible: false,
    ImgUrl: '',
    initial: true,
  };

  componentDidMount() {
    const {
      match: {
        params: { number, current },
      },
      dispatch,
    } = this.props;
    const payload = { current: 1, pageSize: 100 };
    const reg = /^[\d]+$/;
    dispatch({
      type: 'products/categoryList',
      payload: {
        errorCallback(msg) {
          message.error(msg);
        },
        ...payload,
      },
    });
    if (!reg.test(number)) {
      this.setState({
        addIf: true,
      });
    }
    if (reg.test(number)) {
      dispatch({
        type: 'products/productsDetail',
        payload: {
          number,
          current,
        },
      });
      this.setState({
        previewVisible: true,
      });
    }
  }

  handleEdit = e => {
    const {
      dispatch,
      form: { validateFields },
      products: { detail },
    } = this.props;
    const { ImgUrl } = this.state;
    e.preventDefault();
    validateFields((err, values) => {
      // eslint-disable-next-line no-param-reassign
      values.img = ImgUrl;
      if (!err) {
        if (detail.product_name === values.name) {
          // eslint-disable-next-line no-param-reassign
          values.name = undefined;
        }
        dispatch({
          type: 'products/productsEdit',
          payload: {
            ...values,
            successCallback() {
              message.success('修改成功');
              dispatch(routerRedux.replace('/products/list'));
            },
            errorCallback(msg) {
              message.error(msg);
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

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  handleChange = info => {
    this.setState({
      previewVisible: true,
      initial: false,
    });
    if (info.file.status === 'done' && info.file.response.code === 1) {
      this.setState({
        ImgUrl: `http://${info.file.response.data}`,
      });
    }
  };

  handlePreview = () => {
    this.setState({
      previewVisible: true,
    });
  };

  handleRemove = () => {
    this.setState({
      previewVisible: false,
    });
  };

  handleBeforeUpload = file => {
    const isPic =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
    if (!isPic) {
      message.error('You can only upload image');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB');
    }
    return isPic && isLt2M;
  };

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    const { ImgUrl } = this.state;
    e.preventDefault();
    form.validateFields((err, values) => {
      // eslint-disable-next-line no-param-reassign
      values.img = ImgUrl;
      if (!err) {
        dispatch({
          type: 'products/productsAdd',
          payload: {
            values,
            errorCallback(msg) {
              message.error(msg);
            },
            successCallback() {
              message.success('添加成功');
              dispatch(routerRedux.replace('/products/list'));
            },
          },
        });
      }
    });
  };

  handleunique = arr => {
    const res = [];
    for (let i = 0; i < arr.length; i += 1) {
      let flag = true;
      for (let j = i + 1; j < arr.length; j += 1) {
        if (arr[i].category_id === arr[j].category_id) {
          flag = false;
          break;
        }
      }
      if (flag) {
        res.push(arr[i]);
      }
    }
    return res;
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
      products: {
        list: { list = [] },
        detail,
      },
    } = this.props;
    console.log(this.props, 'props');
    const arr = this.handleunique(list);
    const { addIf, previewVisible, ImgUrl, initial } = this.state;
    return (
      <PageHeaderWrapper title="商品信息编辑">
        <Card className={styles.FormTable}>
          <Form style={{ marginTop: 8 }} onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="商品编号">
              {getFieldDecorator('id', {
                initialValue: addIf ? '' : detail.product_id,
              })(<InputNumber disabled />)}
            </FormItem>
            <FormItem {...formItemLayout} label="商品名称">
              {getFieldDecorator('name', {
                initialValue: addIf ? '' : detail.product_name,
                rules: [
                  {
                    required: true,
                    message: '请输入商品名',
                  },
                ],
              })(<Input placeholder="请输入商品名" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="商品价格">
              {getFieldDecorator('price', {
                initialValue: addIf ? '' : detail.product_price,
                rules: [
                  {
                    required: true,
                    message: '请输入价格',
                  },
                ],
              })(<Input placeholder="请输入商品价格" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="商品价格单位">
              {getFieldDecorator('unit', {
                initialValue: addIf ? '' : detail.product_unit,
                rules: [
                  {
                    required: true,
                    message: '请输入商品价格单位',
                  },
                ],
              })(<Input placeholder="请输入商品价格单位" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="选择商品种类">
              {getFieldDecorator('category_id', {
                initialValue: addIf ? '' : detail.product_category_id,
                rules: [
                  {
                    required: true,
                    message: '请选择商品种类',
                  },
                ],
              })(
                <Select>
                  {arr.map(cate => {
                    return (
                      <Option key={cate.category_id} value={cate.category_id}>
                        {cate.category_name}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="商品图片">
              {getFieldDecorator('img')(
                <Upload
                  action="/online/api/upload"
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={this.handleBeforeUpload}
                  onPreview={this.handlePreview}
                  onChange={this.handleChange}
                  onRemove={this.handleRemove}
                >
                  {previewVisible ? (
                    <img
                      src={initial ? detail.product_img : ImgUrl}
                      alt="pic"
                      className={styles.pic}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="商品介绍">
              {getFieldDecorator('description', {
                initialValue: addIf ? '' : detail.product_description,
              })(<TextArea placeholder="请输入商品介绍" />)}
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

export default ProductsEdit;
