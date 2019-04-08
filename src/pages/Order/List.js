import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import moment from 'moment';
import styles from './List.less';

@connect(({ order, loading }) => ({
  order,
  loading: loading.effects['order/orderList'],
}))
@Form.create()
class OrderList extends PureComponent {
  state = {
    selectedRows: [],
  };

  componentDidMount() {
    const {
      dispatch,
      order: { status = {} },
    } = this.props;
    dispatch({
      type: 'order/orderList',
      payload: {
        status,
        errorCallback(msg) {
          message.error(msg);
        },
      },
    });
  }

  handleStandardTableChange = (pagination, _, sorter) => {
    const {
      dispatch,
      order: { status },
    } = this.props;
    dispatch({
      type: 'order/updateStatus',
      payload: {
        ...pagination,
        sorter,
      },
    });
    dispatch({
      type: 'order/orderList',
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

  handleSelectRows = current => {
    this.setState({
      selectedRows: current,
    });
  };

  render() {
    const {
      loading,
      order: {
        list: { total = 0, current = 1, pageSize = 1, list = [] },
      },
    } = this.props;
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '订单编号',
        dataIndex: 'order_code',
      },
      {
        title: '订单总价',
        dataIndex: 'order_total_price',
      },
      {
        title: '价格(优惠后)',
        dataIndex: 'order_real_price',
      },
      {
        title: '订单用户',
        dataIndex: 'order_user_id',
      },
      {
        title: '负责骑手',
        dataIndex: 'order_rider_id',
      },
      {
        title: '订单状态',
        dataIndex: 'order_state',
        render: val => {
          if (val === -1) {
            return <span>交易关闭</span>;
          }
          if (val === 0) {
            return <span>待付款</span>;
          }
          if (val === 1) {
            return <span>待签收</span>;
          }
          if (val === 2) {
            return <span>待审核</span>;
          }
          if (val === 3) {
            return <span>待评价</span>;
          }
          return <span>已完成</span>;
        },
      },
      {
        title: '送货时间',
        dataIndex: 'order_send_time',
      },
      {
        title: '订单地址',
        dataIndex: 'order_address',
      },
      {
        title: '订单备注',
        dataIndex: 'order_message',
      },
      {
        title: '订单更新时间',
        dataIndex: 'order_update_time',
        render: val => moment(val).format('YYYY-MM-DD'),
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
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              rowKey="order_id"
              onChange={this.handleStandardTableChange}
              onSelectRow={this.handleSelectRows}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default OrderList;
