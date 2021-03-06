import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Form, Card, Button, Select, Input, Icon, message } from 'antd';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ coupons, loading }) => ({
  coupons,
  loading: loading.effects['coupons/couponsList'],
}))
@Form.create()
class CouponsList extends PureComponent {
  state = {
    expendForm: false,
    selectedRows: [],
  };

  componentDidMount() {
    // eslint-disable-next-line no-shadow
    const {
      dispatch,
      coupons: { status = {} },
    } = this.props;
    dispatch({
      type: 'coupons/couponsList',
      payload: {
        ...status,
        errorCallback(msg) {
          message.error(msg);
        },
      },
    });
  }

  toggleForm = () => {
    const { expendForm } = this.state;
    this.setState({
      expendForm: !expendForm,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = (pagination, _, sorter) => {
    const {
      dispatch,
      coupons: { status },
    } = this.props;
    dispatch({
      type: 'coupons/updateStatus',
      payload: {
        ...pagination,
        sorter,
      },
    });
    dispatch({
      type: 'coupons/couponsList',
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

  handleDetail = val => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/coupons/detail/:number/:current',
        query: val,
      })
    );
  };

  handleEdit = val => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/coupons/edit/:number/:current',
        query: val,
      })
    );
  };

  handleSearch = e => {
    e.preventDefault();
    const {
      coupons: { status },
      form: { validateFields },
      dispatch,
    } = this.props;
    validateFields((error, values) => {
      if (error) {
        return message.error(error);
      }
      dispatch({
        type: 'coupons/updateStatus',
        payload: values,
      });
      return dispatch({
        type: 'coupons/couponsList',
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

  handleRouteToEdit = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/coupons/edit/:number'));
  };

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
      coupons: { status },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="??????">
              {getFieldDecorator('coupons_id', {
                initialValue: status.number,
              })(<Input placeholder="????????????????????????" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="????????????">
              {getFieldDecorator('name', {
                initialValue: status.name,
              })(<Input placeholder="?????????????????????" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="??????">
              {getFieldDecorator('coupons_type', {
                initialValue: status.category,
              })(
                <Select placeholder="?????????" mode="multiple" style={{ width: '100%' }}>
                  <Option value="-1">????????????</Option>
                  <Option value="0">??????</Option>
                  <Option value="1">??????</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="????????????">
              {getFieldDecorator('category', {
                initialValue: status.category,
              })(
                <Select placeholder="?????????" mode="multiple" style={{ width: '100%' }}>
                  <Option value="-1">????????????</Option>
                  <Option value="0">??????</Option>
                  <Option value="1">??????</Option>
                </Select>
              )}
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
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              ?????? <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      coupons: { status },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="??????">
              {getFieldDecorator('coupons_id', {
                initialValue: status.number,
              })(<Input placeholder="????????????????????????" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="????????????">
              {getFieldDecorator('coupons_name', {
                initialValue: status.name,
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
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                ?????? <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    const { expendForm } = this.state;
    return expendForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      loading,
      coupons: {
        status: { sorter },
        list: { total = 0, current = 1, pageSize = 10, list = [] },
      },
    } = this.props;
    const { selectedRows } = this.state;
    const columns = [
      {
        title: '??????',
        dataIndex: 'coupons_id',
      },
      {
        title: '????????????',
        dataIndex: 'coupons_name',
      },
      {
        title: '??????',
        dataIndex: 'coupons_type',
      },
      {
        title: '????????????',
        dataIndex: 'coupons_fill',
        render: val => <span>???{val}?????????</span>,
      },
      {
        title: '?????????',
        render: val => moment(val.limited_time).format('YYYY-MM-DD'),
      },
      {
        title: '??????',
        render: val => (
          <Fragment>
            <a onClick={this.handleDetail.bind(this, val)}>??????</a>
            <span style={{ margin: ' 0 10px', color: '#e8e8e8' }}>|</span>
            <a onClick={this.handleEdit.bind(this, val)}>??????</a>
          </Fragment>
        ),
      },
    ];
    if (sorter) {
      columns.forEach(item => {
        Reflect.deleteProperty(item, 'defaultSortOrder');
        if (sorter.columnKey === item.dataIndex) {
          // eslint-disable-next-line no-param-reassign
          item.defaultSortOrder = sorter.order;
        }
        return item;
      });
    }
    const data = {
      list,
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        total,
        current: Number(current),
        pageSize: Number(pageSize),
      },
    };
    return (
      <PageHeaderWrapper title="???????????????">
        <Card>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.handleRouteToEdit}>
                ??????
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>????????????</Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              rowKey="coupons_id"
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CouponsList;
