import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Button, Icon, Row, Col, message, Popconfirm } from 'antd';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import styles from './Detail.less';

const { Description } = DescriptionList;
@connect(({ commodity, loading }) => ({
  commodity,
  loading,
}))
class CommodityDetail extends PureComponent {
  state = {
    pics: false,
    fileList: [],
    previewVisible: false,
    previewImage: '',
  };

  componentDidMount() {
    const {
      match: {
        params: { number },
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'commodity/commodityDetail',
      payload: {
        number,
        errorCallback(msg) {
          message.error(msg);
        },
      },
    });
  }

  handleConfirm = () => {
    const {
      dispatch,
      commodity: {
        detail: { number },
      },
    } = this.props;
    dispatch({
      type: 'commodity/commodityDelete',
      payload: {
        number,
        errorCallback(msg) {
          message.error(msg);
        },
        successCallback() {
          message.success('删除成功');
          dispatch(routerRedux.replace('/commodity/list'));
        },
      },
    });
  };

  extra() {
    const {
      commodity: { detail },
    } = this.props;
    return (
      <Row>
        <Col xs={24} sm={24}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{detail.status}</div>
        </Col>
        <Col xs={24} sm={24}>
          <div className={styles.textSecondary}>入库时间</div>
          <div className={styles.heading} style={{ color: detail.time > 10 ? 'inherit' : 'red' }}>
            {detail.time}
          </div>
        </Col>
      </Row>
    );
  }

  handleShowPicture(which) {
    // eslint-disable-next-line react/destructuring-assignment
    const val = this.state[which];
    this.setState({
      [which]: !val,
    });
  }

  description() {
    const {
      commodity: { detail },
    } = this.props;
    // console.log(this.props);
    const { pics } = this.state;
    return (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="商品名字">{detail.name}</Description>
        <Description term="更新时间">
          {moment(detail.updateTime).format('YYYY-MM-DD HH:mm:ss')}
        </Description>
        <Description term="商品图片" sm={24} md={24}>
          {this.renderShowPicture('pics')}
          <img style={{ display: pics ? 'block' : 'none' }} src={detail.pics} alt="商品图片" />
        </Description>

        <Description term="商品介绍">{detail.introduce}</Description>
      </DescriptionList>
    );
  }

  renderShowPicture(which) {
    // eslint-disable-next-line react/destructuring-assignment
    const val = this.state[which];
    return (
      <a
        onClick={() => this.handleShowPicture(which)}
        style={{ color: '#1890FF', textDecoration: 'none' }}
        // eslint-disable-next-line no-script-url
        href="javascript:;"
      >
        <span style={{ marginRight: '5px' }}>{val ? '点击隐藏' : '点击展示'}</span>
        <Icon type={val ? 'up' : 'down'} />
      </a>
    );
  }

  // eslint-disable-next-line react/sort-comp
  handleChange = ({ fileList }) => {
    this.setState({ fileList });
  };

  render() {
    const {
      commodity: { detail },
    } = this.props;
    const action = (
      <Fragment>
        <Link style={{ marginRight: '10px' }} to={`/commodity/edit/${detail.number}`}>
          <Button type="primary">编辑</Button>
        </Link>
        <Popconfirm
          title="你确认要删除此商品信息吗？"
          onConfirm={this.handleConfirm}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <Button type="danger">删除</Button>
        </Popconfirm>
      </Fragment>
    );

    return (
      <PageHeaderWrapper
        title={`商品编号: ${detail.number}`}
        action={action}
        content={this.description()}
        extraContent={this.extra()}
      />
    );
  }
}

export default CommodityDetail;
