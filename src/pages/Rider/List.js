import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Row, Col, Form, Card, Button, Select, Input, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;

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

  handleRouteToEdit = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/rider/edit/:number'));
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
        type: 'rider/riderList',
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
      rider: { status },
    } = this.props;

    return (
      <Form onSubmit={this.handleSreach} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="骑手编号">
              {getFieldDecorator('number', {
                initialValue: status.number,
              })(<Input placeholder="请输入骑手编号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="骑手名字">
              {getFieldDecorator('name', {
                initialValue: '',
              })(<Input placeholder="请输入骑手名" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="负责楼栋">
              {getFieldDecorator('category', {
                initialValue: '',
              })(
                <Select placeholder="请选择" mode="multiple" style={{ width: '200px' }}>
                  <Option value="">所有楼栋</Option>
                  <Option value="0">1</Option>
                  <Option value="1">2</Option>
                  <Option value="2">3</Option>
                  <Option value="3">4</Option>
                </Select>
              )}
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
      rider: {
        list: { total = 0, current = 1, pageSize = 10, list = [] },
      },
    } = this.props;
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '骑手编号',
        dataIndex: 'number',
      },
      {
        title: '骑手名字',
        dataIndex: 'name',
      },
      {
        title: '负责楼栋',
        dataIndex: 'house',
        sorter: true,
      },
      {
        title: '骑手电话',
        dataIndex: 'phonenumber',
      },
      {
        title: '身份证号',
        dataIndex: 'ID',
      },
      {
        title: '操作',
        render(val) {
          return (
            <Fragment>
              <Link to={`/rider/detail/${val.number}`}>查看</Link>
              <span style={{ margin: ' 0 10px', color: '#e8e8e8' }}>|</span>
              <Link to={`/rider/edit/${val.number}`}>编辑</Link>
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
      <PageHeaderWrapper title="骑手列表">
        <Card>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.handleRouteToEdit}>
                新建
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              rowKey="number"
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
