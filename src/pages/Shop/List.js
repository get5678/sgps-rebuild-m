import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Form, Card, Button, Input, message, Popconfirm, Divider } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import styles from './List.less';

const FormItem = Form.Item;

@connect(({ shop, loading }) => ({
  shop,
  loading: loading.effects['shop/shopList'],
}))
@Form.create()
class ShopList extends PureComponent {
  state = {
    selectedRows: [],
  };

  componentDidMount() {
    const {
      dispatch,
      shop: { status = {} },
    } = this.props;
    dispatch({
      type: 'shop/shopList',
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

  handleRouteToEdit = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/shop/edit/:number'));
  };

  handleSelectRows = current => {
    this.setState({
      selectedRows: current,
    });
  };

  handleStandardTableChange = (pagination, _, sorter) => {
    const {
      dispatch,
      shop: { status },
    } = this.props;
    dispatch({
      type: 'shop/updateStatus',
      payload: {
        ...pagination,
        sorter,
      },
    });
    dispatch({
      type: 'shop/shopList',
      payload: {
        ...status,
        ...pagination,
        sorter,
        errorCallback(msg) {
          message.error(msg);
        },
      },
    });
  };

  handleSreach = e => {
    e.preventDefault();
    const {
      shop: { status },
      form: { validateFields },
      dispatch,
    } = this.props;
    validateFields((error, values) => {
      if (error) {
        return message.error(error);
      }
      dispatch({
        type: 'shop/updateStatus',
        payload: values,
      });
      return dispatch({
        type: 'shop/shopList',
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
        pathname: '/shop/edit/:number/:current',
        query: val,
      })
    );
  };

  handleExame = e => {
    const { admin_id: id, admin_state: states } = e;
    const { dispatch } = this.props;
    let state = 0;
    if (states === 0) {
      state = 1;
    }
    dispatch({
      type: 'shop/shopExame',
      payload: {
        values: { id, state },
        errorCallback(msg) {
          message.error(msg);
        },
        successCallback() {
          message.success('????????????');
          dispatch(routerRedux.replace('/shop/list'));
        },
      },
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      shop: { status },
    } = this.props;

    return (
      <Form onSubmit={this.handleSreach} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="????????????">
              {getFieldDecorator('number', {
                initialValue: status.number,
              })(<Input placeholder="?????????????????????" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="????????????">
              {getFieldDecorator('name', {
                initialValue: '',
              })(<Input placeholder="?????????????????????" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="????????????">
              {getFieldDecorator('place', {
                initialValue: '',
              })(<Input placeholder="?????????????????????" />)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              ??????
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              ??????
            </Button>
          </div>
        </div>
      </Form>
    );
  }

  render() {
    const {
      loading,
      shop: {
        list: { total = 0, current = 1, pageSize = 10, list = [] },
      },
    } = this.props;
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '????????????',
        dataIndex: 'admin_id',
      },
      {
        title: '????????????',
        dataIndex: 'admin_name',
      },
      {
        title: '????????????',
        dataIndex: 'admin_phone',
      },
      {
        title: '????????????',
        dataIndex: 'admin_state',
        render: val => {
          if (val === 0) {
            return <span>?????????</span>;
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
              <Divider type="vertical" />
              <Popconfirm
                title="??????????????????"
                onConfirm={() => {
                  this.handleExame(val);
                }}
              >
                <a>??????</a>
              </Popconfirm>
            </Fragment>
          );
        },
      },
    ];

    const data = {
      list,
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        total,
        page: Number(current),
        pageSize: Number(pageSize),
      },
    };

    return (
      <PageHeaderWrapper title="????????????">
        <Card>
          <div className={styles.tableList}>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              rowKey="admin_id"
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ShopList;
