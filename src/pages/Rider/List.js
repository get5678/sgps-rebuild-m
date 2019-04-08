import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
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
          message.success('删除成功');
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
            <FormItem label="骑手名字">
              {getFieldDecorator('name')(<Input placeholder="请输入骑手名" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="负责楼栋">{getFieldDecorator('building')(<InputNumber />)}</FormItem>
          </Col>
          <div style={{ overflow: 'hidden' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
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
        title: '骑手编号',
        dataIndex: 'rider_id',
      },
      {
        title: '骑手名字',
        dataIndex: 'rider_name',
      },
      {
        title: '骑手性别',
        dataIndex: 'rider_sex',
        render: val => {
          if (val === 0) {
            return <span>男</span>;
          }
          if (val === 1) {
            return <span>女</span>;
          }
          return <span>不详</span>;
        },
      },
      {
        title: '负责楼栋',
        dataIndex: 'building_name',
      },
      {
        title: '骑手电话',
        dataIndex: 'rider_phone',
      },
      {
        title: '骑手身份证号码',
        dataIndex: 'rider_identity_number',
      },
      {
        title: '操作',
        render: val => {
          return (
            <Fragment>
              <Link to={`/rider/detail/${val.rider_id}/${current}`}>查看</Link>
              <Divider type="vertical" />
              <Link to={`/rider/edit/${val.rider_id}/${current}`}>编辑</Link>
              <Divider type="vertical" />
              <Popconfirm
                title="是否要删除此行？"
                onConfirm={() => this.handleDelect(val.rider_id)}
              >
                <a>删除</a>
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
