import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Row,
  Col,
  Form,
  Card,
  Button,
  Input,
  message,
  InputNumber,
  Popconfirm,
  Divider,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import styles from './List.less';

const FormItem = Form.Item;
@connect(({ rider, loading }) => ({
  rider,
  loading: loading.effects['rider/riderList'],
}))
@Form.create()
class RiderList extends PureComponent {
  state = {
    selectedRows: [],
  };

  componentDidMount() {
    const {
      dispatch,
      rider: { status = {} },
    } = this.props;
    dispatch({
      type: 'rider/riderList',
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

  handleEdit = val => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/rider/edit/:number/:current',
        query: val,
      })
    );
  };

  handleRouteToEdit = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/rider/edit/:number/:current'));
  };

  handleSelectRows = current => {
    this.setState({
      selectedRows: current,
    });
  };

  handleStandardTableChange = (pagination, _, sorter) => {
    const {
      dispatch,
      rider: { status },
    } = this.props;
    dispatch({
      type: 'rider/updateStatus',
      payload: {
        ...pagination,
        sorter,
      },
    });
    dispatch({
      type: 'rider/riderList',
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
      rider: { status },
      form: { validateFields },
      dispatch,
    } = this.props;
    validateFields((error, values) => {
      if (error) {
        return message.error(error);
      }
      dispatch({
        type: 'rider/updateStatus',
        payload: values,
      });
      return dispatch({
        type: 'rider/riderSreach',
        payload: {
          ...status,
          values,
          errorCallback(msg) {
            message.error(msg);
          },
        },
      });
    });
  };

  handleDelect = e => {
    const {
      dispatch,
      rider: { status },
    } = this.props;
    dispatch({
      type: 'rider/riderDelect',
      payload: {
        id: e,
        errorCallback(msg) {
          message.error(msg);
        },
        successCallback() {
          message.success('????????????');
          dispatch({
            type: 'rider/updateStatus',
            payload: {
              ...status,
            },
          });
          dispatch({
            type: 'rider/riderList',
            payload: {
              ...status,
              errorCallback(msg) {
                message.error(msg);
              },
            },
          });
        },
      },
    });
  };

  // eslint-disable-next-line react/sort-comp
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSreach} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="????????????">
              {getFieldDecorator('name')(<Input placeholder="??????????????????" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="????????????">{getFieldDecorator('building')(<InputNumber />)}</FormItem>
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
      rider: {
        list: { total = 0, current = 1, pageSize = 10, list = [] },
      },
    } = this.props;
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '????????????',
        dataIndex: 'rider_id',
      },
      {
        title: '????????????',
        dataIndex: 'rider_name',
      },
      {
        title: '????????????',
        dataIndex: 'rider_sex',
        render: val => {
          if (val === 0) {
            return <span>???</span>;
          }
          if (val === 1) {
            return <span>???</span>;
          }
          return <span>??????</span>;
        },
      },
      {
        title: '????????????',
        dataIndex: 'building_name',
      },
      {
        title: '????????????',
        dataIndex: 'rider_phone',
      },
      {
        title: '?????????????????????',
        dataIndex: 'rider_identity_number',
      },
      {
        title: '??????',
        render: val => {
          return (
            <Fragment>
              {/* <Link to={`/rider/detail/${val.rider_id}/${current}`}>??????</Link>
              <Divider type="vertical" /> */}
              <a onClick={this.handleEdit.bind(this, val)}>??????</a>
              <Divider type="vertical" />
              <Popconfirm
                title="????????????????????????"
                onConfirm={() => this.handleDelect(val.rider_id)}
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
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.handleRouteToEdit}>
                ??????
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              rowKey="rider_id"
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default RiderList;
