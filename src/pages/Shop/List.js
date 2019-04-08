import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
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
          message.success('审核成功');
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
            <FormItem label="店铺编号">
              {getFieldDecorator('number', {
                initialValue: status.number,
              })(<Input placeholder="请输入店铺编号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="店铺名字">
              {getFieldDecorator('name', {
                initialValue: '',
              })(<Input placeholder="请输入店铺名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="店铺地址">
              {getFieldDecorator('place', {
                initialValue: '',
              })(<Input placeholder="请输入店铺地址" />)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
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
        title: '店铺编号',
        dataIndex: 'admin_id',
      },
      {
        title: '店铺名称',
        dataIndex: 'admin_name',
      },
      {
        title: '店铺电话',
        dataIndex: 'admin_phone',
      },
      {
        title: '店铺状态',
        dataIndex: 'admin_state',
        render: val => {
          if (val === 0) {
            return <span>未审核</span>;
          }
          return <span>正常</span>;
        },
      },
      {
        title: '操作',
        render: val => {
          return (
            <Fragment>
              <Link to={`/shop/edit/${val.admin_id}/${current}`}>编辑</Link>
              <Divider type="vertical" />
              <Popconfirm
                title="确认将该分店"
                onConfirm={() => {
                  this.handleExame(val);
                }}
              >
                <a>审核</a>
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
      <PageHeaderWrapper title="店铺列表">
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
