import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Form, Card, Button, Input, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import moment from 'moment';
import styles from './List.less';

const FormItem = Form.Item;
@connect(({ commodity, loading }) => ({
  commodity,
  loading: loading.effects['commodity/commodityList'],
}))
@Form.create()
class CommodityList extends PureComponent {
  state = {
    selectedRows: [],
  };

  componentDidMount() {
    const {
      dispatch,
      commodity: { status = {} },
    } = this.props;
    dispatch({
      type: 'commodity/commodityList',
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

  handleRouteToEdit = val => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/commodity/edit/:number/:current',
        query: val,
      })
    );
  };

  handleRouteToAdd = () => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/commodity/edit/:number/:current',
        query: null,
      })
    );
  };

  handleSelectRows = current => {
    this.setState({
      selectedRows: current,
    });
  };

  handleStandardTableChange = (pagination, _, sorter) => {
    const {
      dispatch,
      commodity: { status },
    } = this.props;
    dispatch({
      type: 'commodity/updateStatus',
      payload: {
        ...pagination,
        sorter,
      },
    });
    dispatch({
      type: 'commodity/commodityList',
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
      commodity: { status },
      form: { validateFields },
      dispatch,
    } = this.props;
    validateFields((_, values) => {
      dispatch({
        type: 'commodity/updateStatus',
        payload: values,
      });
      dispatch({
        type: 'commodity/commodityList',
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

  renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSreach} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="??????????????????">
              {getFieldDecorator('name')(<Input placeholder="???????????????????????????" />)}
            </FormItem>
          </Col>
          <div>
            <Button type="primary" htmlType="submit">
              ??????
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              ??????
            </Button>
          </div>
        </Row>
      </Form>
    );
  };

  render() {
    const {
      loading,
      commodity: {
        list: { total = 0, current = 1, pageSize = 10, list = [] },
      },
    } = this.props;
    const { selectedRows } = this.state;
    const columns = [
      {
        title: '??????????????????',
        dataIndex: 'category_id',
      },
      {
        title: '??????????????????',
        dataIndex: 'category_name',
      },
      {
        title: '??????????????????',
        dataIndex: 'category_state',
        render: val => {
          if (val === 0) {
            return <span>??????</span>;
          }
          return <span>??????</span>;
        },
      },
      {
        title: '????????????????????????',
        dataIndex: 'category_create_time',
        render: val => moment(val).format('YYYY-MM-DD'),
      },
      {
        title: '??????',
        render: val => {
          return (
            <Fragment>
              <a onClick={this.handleRouteToEdit.bind(this, val)}>??????</a>
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
      <PageHeaderWrapper title="??????????????????">
        <Card>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.handleRouteToAdd}>
                ??????
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              rowKey="category_id"
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CommodityList;
