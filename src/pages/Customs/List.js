import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Form, Card, Button, Input, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import styles from './List.less';

const FormItem = Form.Item;
@connect(({ customs, loading }) => ({
  customs,
  loading: loading.effects['customs/customsList'],
}))
@Form.create()
class CustomsList extends PureComponent {
  state = {
    selectedRows: [],
  };

  componentDidMount() {
    const {
      dispatch,
      customs: { status = {} },
    } = this.props;
    dispatch({
      type: 'customs/customsList',
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
        pathname: '/customs/edit/:number',
        query: val,
      })
    );
  };

  handleRider = val => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/rider/edit/:number/:current',
        query: val,
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
      customs: { status },
    } = this.props;
    dispatch({
      type: 'customs/updateStatus',
      payload: {
        ...pagination,
        sorter,
      },
    });
    dispatch({
      type: 'customs/customsList',
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
      customs: { status },
      form: { validateFields },
      dispatch,
    } = this.props;
    validateFields((error, values) => {
      if (error) {
        return message.error(error);
      }
      dispatch({
        type: 'customs/updateStatus',
        payload: values,
      });
      return dispatch({
        type: 'customs/customsSearch',
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

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSreach} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={14}>
            <FormItem label="????????????">
              {getFieldDecorator('name', {
                initialValue: '',
              })(<Input placeholder="??????????????????" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="????????????">
              {getFieldDecorator('building', {
                initialValue: '',
              })(<Input placeholder="???????????????" />)}
            </FormItem>
          </Col>
          <div style={{ overflow: 'hidden' }}>
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
  }

  render() {
    const {
      loading,
      customs: {
        list: { total = 0, current = 1, pageSize = 10, list = [] },
      },
    } = this.props;
    const { selectedRows } = this.state;
    const columns = [
      {
        title: '????????????',
        dataIndex: 'user_id',
      },
      {
        title: '????????????',
        dataIndex: 'user_name',
      },
      {
        title: '????????????',
        dataIndex: 'user_sex',
        render: val => {
          if (val === 0) {
            return <span>???</span>;
          }
          return <span>???</span>;
        },
      },
      {
        title: '????????????',
        dataIndex: 'building_name',
      },
      {
        title: '????????????',
        dataIndex: 'user_phone',
      },
      {
        title: '??????',
        render: val => {
          return (
            <Fragment>
              <a onClick={this.handleRider.bind(this, val)}>??????</a>
              <span style={{ margin: ' 0 10px', color: '#e8e8e8' }}>|</span>
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
      <PageHeaderWrapper title="????????????">
        <Card>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              rowKey="user_id"
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CustomsList;
