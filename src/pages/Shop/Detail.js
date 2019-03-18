import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Button, Icon, Row, Col, message, Popconfirm } from 'antd';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import styles from './Detail.less';

const { Description } = DescriptionList;

@connect(({ shop, loading }) => ({
  shop,
  loading,
}))
class ShopDetail extends PureComponent {
  state = {
    IDPic: false,

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
      type: 'shop/shopDetail',
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
      shop: {
        detail: { number },
      },
    } = this.props;
    dispatch({
      type: 'shop/shopDelete',
      payload: {
        number,
        errorCallback(msg) {
          message.error(msg);
        },
        successCallback() {
          message.success('删除成功');
          dispatch(routerRedux.replace('/shop/list'));
        },
      },
    });
  };

  extra() {
    const {
      shop: { detail },
    } = this.props;
    return (
      <Row>
        <Col xs={24} sm={24}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{detail.status}ss</div>
        </Col>
        <Col xs={24} sm={24}>
          <div className={styles.textSecondary}>入职时间</div>
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
      shop: { detail },
    } = this.props;
    const { IDPic } = this.state;
    return (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="店铺名称">{detail.name}</Description>
        <Description term="店铺地址">{detail.place}</Description>
        <Description term="店铺电话">{detail.phoneNumber}</Description>
        <Description term="老板身份证号码">{detail.ID}</Description>
        <Description term="月收入">{detail.pay}</Description>
        <Description term="月接单数目">{detail.page}</Description>
        <Description term="更新时间">
          {moment(detail.updateTime).format('YYYY-MM-DD HH:mm:ss')}
        </Description>
        <Description term="老板身份证图片" sm={24} md={24}>
          {this.renderShowPicture('IDPic')}
          <img
            style={{ display: IDPic ? 'block' : 'none' }}
            src={detail.IDPic}
            alt="老板身份证图片"
          />
        </Description>

        <Description term="店铺介绍">{detail.introduce}</Description>
      </DescriptionList>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  /* handleCancel() {
    message.success('成功取消删除此骑手信息');
  } */

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
  handleCancel = () => {
    this.setState({ previewVisible: false });
  };

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
  };

  render() {
    const {
      shop: { detail },
    } = this.props;
    // const { previewVisible, previewImage, fileList } = this.state;

    const action = (
      <Fragment>
        <Link style={{ marginRight: '10px' }} to={`/shop/edit/${detail.number}`}>
          <Button type="primary">编辑</Button>
        </Link>
        <Popconfirm
          title="你确认要删除此店铺信息吗？"
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
        title="店铺编号：65456485645615"
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={action}
        content={this.description()}
        extraContent={this.extra()}
      />
    );
  }
}

export default ShopDetail;
