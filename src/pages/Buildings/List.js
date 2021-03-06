import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Form, Card, Button, Input, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import styles from './List.less';

const FormItem = Form.Item;
@connect(({ buildings, loading }) => ({
  buildings,
  loading: loading.effects['buildings/buildingsList'],
}))
@Form.create()
class BuildingsList extends PureComponent {
  state = {
    selectedRows: [],
  };

  componentDidMount() {
    const {
      dispatch,
      buildings: { status },
    } = this.props;
    dispatch({
      type: 'buildings/buildingsList',
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
      buildings: { status },
      form: { validateFields },
      dispatch,
    } = this.props;
    validateFields((error, values) => {
      if (error) {
        return message.error(error);
      }
      dispatch({
        type: 'buildings/buildingsStatus',
        payload: values,
      });
      return dispatch({
        type: 'buildings/buildingsSearch',
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
        pathname: '/buildings/edit/:number/:current',
        query: val,
      })
    );
  };

  handleRouteToEdit = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/buildings/edit/:number/:current'));
  };

  handleTableChange = (pagination, filters) => {
    const {
      dispatch,
      buildings: { status },
    } = this.props;
    dispatch({
      type: 'buildings/updateStatus',
      payload: {
        ...pagination,
      },
    });
    dispatch({
      type: 'buildings/buildingsList',
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
      buildings: { status },
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="????????????">
              {getFieldDecorator('id', {
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
      buildings: {
        list: { total = 0, current = 1, pageSize = 1, list = [] },
      },
    } = this.props;
    const { selectedRows } = this.state;
    const columns = [
      {
        title: '??????',
        dataIndex: 'building_id',
      },
      {
        title: '?????????',
        dataIndex: 'building_name',
      },
      {
        title: '????????????',
        dataIndex: 'building_is_open',
        render: val => {
          if (val === 1) {
            return <span>??????</span>;
          }
          return <span>?????????</span>;
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
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.handleRouteToEdit}>
                ??????
              </Button>
            </div>
            <StandardTable
              columns={columns}
              selectedRows={selectedRows}
              data={data}
              rowKey="building_id"
              loading={loading}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BuildingsList;
