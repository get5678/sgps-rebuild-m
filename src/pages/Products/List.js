import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Form, Card, Button, Input, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import styles from './List.less';

const FormItem = Form.Item;
@connect(({ products, loading }) => ({
  products,
  loading: loading.effects['products/productsList'],
}))
@Form.create()
class ProductsList extends PureComponent {
  state = {
    selectedRows: [],
  };

  componentDidMount() {
    const {
      dispatch,
      products: { status },
    } = this.props;
    dispatch({
      type: 'products/productsList',
      payload: {
        ...status,
        errorCallback(msg) {
          message.error(msg);
        },
      },
    });
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  handleSearch = e => {
    e.preventDefault();
    const {
      products: { status },
      form: { validateFields },
      dispatch,
    } = this.props;
    validateFields((error, values) => {
      if (error) {
        return message.error(error);
      }
      // dispatch({
      //     type: 'products/productsStatus',
      //     payload: values,
      // });
      return dispatch({
        type: 'products/productsSearch',
        payload: {
          ...status,
          ...values,
          errorCallback(msg) {
            message.error(msg);
          },
        },
      });
    });
  };

  handleEdit = val => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/products/edit/:number/:current',
        query: val,
      })
    );
  };

  handleRouteToEdit = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/products/edit/:number/:current'));
  };

  handleTableChange = (pagination, filters) => {
    const {
      dispatch,
      products: { status },
    } = this.props;
    dispatch({
      type: 'products/updateStatus',
      payload: {
        ...pagination,
      },
    });
    dispatch({
      type: 'products/productsList',
      payload: {
        ...status,
        ...pagination,
        ...filters,
        errorCallback(msg) {
          message.error(msg);
        },
      },
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="????????????">
              {getFieldDecorator('name', {
                initialValue: '',
              })(<Input placeholder="?????????????????????" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                ??????
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                ??????
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      loading,
      products: {
        list: { total = 0, current = 1, pageSize = 1, list = [] },
      },
    } = this.props;
    const { selectedRows } = this.state;
    const columns = [
      {
        title: '??????',
        dataIndex: 'product_id',
      },
      {
        title: '?????????',
        dataIndex: 'product_name',
      },
      {
        title: '????????????',
        render: val => {
          if (!val.product_img) {
            return <span>??????</span>;
          }
          return <img className={styles.pic} src={`${val.product_img}`} alt={val.product_name} />;
        },
      },
      {
        title: '????????????',
        dataIndex: 'category_name',
      },
      // {
      //     title: '????????????',
      //     dataIndex: 'product_sales',
      // },
      {
        title: '????????????',
        dataIndex: 'product_price',
        render: val => {
          return <span>{val}???</span>;
        },
      },
      {
        title: '????????????',
        dataIndex: 'product_state',
        render: val => {
          if (val === 1) {
            return <span>??????</span>;
          }
          return <span>??????</span>;
        },
      },
      {
        title: '??????',
        render: val => {
          return (
            <Fragment>
              <a onClick={this.handleEdit.bind(this, val)}>??????</a>
            </Fragment>
          );
        },
      },
    ];

    const data = {
      list,
      pagination: {
        total,
        showSizeChanger: true,
        showQuickJumper: true,
        page: Number(current),
        pageSize: Number(pageSize),
      },
    };

    return (
      <PageHeaderWrapper title="????????????">
        <Card>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.handleRouteToEdit}>
                ??????
              </Button>
            </div>
            <StandardTable
              style={{ textAlign: 'center' }}
              columns={columns}
              selectedRows={selectedRows}
              data={data}
              rowKey="product_id"
              loading={loading}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProductsList;
