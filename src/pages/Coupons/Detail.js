import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { Button, Row, Col, message, Popconfirm } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import styles from './Detail.less';

const { Description } = DescriptionList;

@connect(({ coupons, loading }) => ({
  coupons,
  loading: loading.effects['coupons/couponsDetail'],
}))
class CouponsDetail extends PureComponent {
  componentDidMount() {
    const {
      match: {
        params: { number },
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'coupons/couponsDetail',
      payload: {
        number,
        errorCallback(msg) {
          message.error(msg);
        },
      },
    });
  }

  description() {
    const {
      coupons: { detail },
    } = this.props;
    return (
      <Description className={styles.headerList} size="small" col="2">
        <Description term="优惠券名称">{detail.coupons_name}</Description>
        <Description term="有限期">
          {`${moment(detail.coupons_limited_time).format('YYYY-MM-DD HH：mm：ss')}`}
        </Description>
      </Description>
    );
  }

  extra() {
    const {
      coupons: { detail },
    } = this.props;
    return (
      <Row>
        <Col span={8}>
          <div className={styles.textSecondary}>类别</div>
          <div className={styles.heading}>{detail.coupons_type}</div>
        </Col>
        <Col span={8}>
          <div className={styles.textSecondary}>使用范围</div>
          <div className={styles.heading}>满{detail.coupons_fill}</div>
        </Col>
        <Col span={8}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{detail.coupons_state === 1 ? '过期' : '正常'}</div>
        </Col>
      </Row>
    );
  }

  render() {
    const {
      match: {
        params: { number },
      },
    } = this.props;

    const action = (
      <Fragment>
        <Link style={{ marginRight: '10px' }} to="/coupons/edit/:number">
          <Button type="primary">编辑</Button>
        </Link>
        <Popconfirm
          title="你确定要删除此优惠券吗?"
          onConfirm={this.handleConfirm}
          onCancel={this.handleCancel}
          okText="确认删除"
          cancelText="取消删除"
        >
          <Button type="danger">删除</Button>
        </Popconfirm>
      </Fragment>
    );

    return (
      <PageHeaderWrapper
        title={`优惠券编号: ${number}`}
        action={action}
        content={this.description()}
        extraContent={this.extra()}
      />
    );
  }
}

export default CouponsDetail;
