import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Button, Icon, Row, Col, message, Popconfirm } from 'antd';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import styles from './Detail.less';

const { Description } = DescriptionList;

@connect(({ customs, loading }) => ({
  customs,
  loading,
}))
class customsDetail extends PureComponent {
  state = {
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
      type: 'customs/customsDetail',
      payload: {
        number,
        errorCallback(msg) {
          message.error(msg);
        },
      },
    });
  }

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
  };

  handleCancel = () => {
    this.setState({ previewVisible: false });
  };

  handleConfirm = () => {
    const {
      dispatch,
      customs: {
        detail: { number },
      },
    } = this.props;

    dispatch({
      type: 'customs/customsDelete',
      payload: {
        number,
        errorCallback(msg) {
          message.error(msg);
        },
        successCallback() {
          message.success('删除成功');
          dispatch(routerRedux.replace('/customs/list'));
        },
      },
    });
  };

  extra() {
    const {
      customs: { detail },
    } = this.props;
    return (
      <Row>
        <Col xs={24} sm={24}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{detail.status}</div>
        </Col>
        <Col xs={24} sm={24}>
          <div className={styles.textSecondary}>登记时间</div>
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
      customs: { detail },
    } = this.props;
    return (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="用户名称">{detail.name}</Description>
        <Description term="用户地址">{detail.place}</Description>
        <Description term="用户电话">{detail.phoneNumber}</Description>

        <Description term="月支出">{detail.pay}</Description>
        <Description term="月订单数目">{detail.page}</Description>
        <Description term="更新时间">
          {moment(detail.updateTime).format('YYYY-MM-DD HH:mm:ss')}
        </Description>

        <Description term="用户介绍">{detail.introduce}</Description>
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

  render() {
    const {
      customs: { detail },
    } = this.props;

    const action = (
      <Fragment>
        <Link style={{ marginRight: '10px' }} to={`/customs/edit/${detail.number}`}>
          <Button type="primary">编辑</Button>
        </Link>
        <Popconfirm
          title="你确认要删除此用户信息吗？"
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
        title={`用户编号：${detail.number}`}
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

export default customsDetail;
