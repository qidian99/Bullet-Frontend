import React, { PureComponent } from 'react';
import {
  Button, Card, Col, Divider, Input, Row, Tag, Avatar, Spin,
} from 'antd';
import {
  EditOutlined,
  PlusOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import 'moment/locale/zh-cn';
import Deals from './components/Deals';
import MenuItems from './components/MenuItems';
import PickupLocations from './components/PickupLocations';
import DriverInviteForm from './components/DriverInviteForm';
import { RESTAURANT_QUERY } from './queries';
import './index.css';

const operationTabList = [
  {
    key: 'deals',
    tab: (
      <span>
        团购&nbsp;
      </span>
    ),
  },
  {
    key: 'drivers',
    tab: (
      <span>
        菜谱&nbsp;
      </span>
    ),
  },
  {
    key: 'pickupLocations',
    tab: (
      <span>
        配送地点&nbsp;
      </span>
    ),
  },
];

const antIcon = <LoadingOutlined style={{ fontSize: 14 }} spin />;

class AccountCenter extends PureComponent {
  constructor(props) {
    super(props);
    const { location: { state } } = props;
    this.state = {
      inputVisible: false,
      inputValue: '',
      submittingTags: false,
      signatureInputVisible: false,
      signatureValue: '',
      submittingSignature: false,
      tabKey: state && state.tabKey ? state.tabKey : 'deals',
      modalVisible: false,
    };
  }

  showModal = () => {
    this.setState({ modalVisible: true });
  };

  closeModal = () => {
    this.setState({ modalVisible: false });
  };

  onTabChange = (key) => {
    this.setState({
      tabKey: key,
    });
  };

  handleClose = async (removedTag) => {
    const { updateRestaurant, currentUser: { tags, signature } } = this.props;
    const newTags = tags.filter((tag) => tag !== removedTag);
    await updateRestaurant({ tags: newTags, signature });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input && this.input.focus());
  };

  saveInputRef = (input) => {
    this.input = input;
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = async () => {
    const { inputValue } = this.state;
    const { currentUser: { tags, signature }, updateRestaurant } = this.props;
    let newTags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      newTags = [...tags, inputValue];
      this.setState({ submittingTags: true });
      await updateRestaurant({ tags: newTags, signature });
      this.setState({
        inputVisible: false,
        inputValue: '',
        submittingTags: false,
      });
    } else {
      this.setState({
        inputVisible: false,
        inputValue: '',
      });
    }
  };

  saveSignatureInputRef = (input) => {
    this.input = input;
  };

  showSignatureInput = () => {
    const { currentUser } = this.props;
    this.setState(
      {
        signatureInputVisible: true,
        signatureValue: currentUser ? currentUser.signature : '',
      },
      () => this.signatureInput && this.signatureInput.focus(),
    );
  }

  handleSignatureChange = (e) => {
    this.setState({ signatureValue: e.target.value });
  };

  handleSignatureConform = async () => {
    const { signatureValue } = this.state;
    const { updateRestaurant, currentUser: { tags } } = this.props;
    this.setState({
      submittingSignature: true,
    });
    await updateRestaurant({ signature: signatureValue, tags });
    this.setState({
      submittingSignature: false,
      signatureInputVisible: false,
    });
  }

  renderChildrenByTabKey = (tabKey) => {
    const { currentUser, currentUserLoading, restaurantId } = this.props;
    const { deals, menuItems, pickupLocations } = currentUser || {};
    const dataLoading = currentUserLoading || !(currentUser && Object.keys(currentUser).length);

    if (tabKey === 'deals') {
      return <Deals deals={deals} loading={dataLoading} />;
    }
    if (tabKey === 'drivers') {
      return (
        <MenuItems
          restaurantId={restaurantId}
          items={menuItems}
          loading={dataLoading}
        />
      );
    }
    if (tabKey === 'pickupLocations') {
      return (
        <PickupLocations
          restaurantId={restaurantId}
          pickupLocations={pickupLocations}
          loading={dataLoading}
        />
      );
    }
    return null;
  };

  render() {
    const {
      inputVisible,
      inputValue,
      submittingTags,
      tabKey,
      signatureInputVisible,
      signatureValue,
      submittingSignature,
      modalVisible,
    } = this.state;
    const { currentUser, currentUserLoading, restaurantId } = this.props;
    const dataLoading = currentUserLoading || !(currentUser && Object.keys(currentUser).length);
    return (
      <div className="account-center">
        <>Place Holder</>
        {/* <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }} loading={dataLoading}>
              {!dataLoading && (
                <div>
                  <div className="avatarHolder">
                    <img alt="" src={currentUser.avatar} />
                    <div className="name">{currentUser.restaurantName}</div>
                    <div>
                      {signatureInputVisible && (
                        <>
                          <Input
                            ref={(ref) => this.saveSignatureInputRef(ref)}
                            type="text"
                            size="small"
                            style={{ width: 170, marginRight: 4 }}
                            value={signatureValue}
                            onChange={this.handleSignatureChange}
                            onBlur={this.handleSignatureConform}
                            onPressEnter={this.handleSignatureConform}
                          />
                          <Spin indicator={antIcon} spinning={submittingSignature} />
                        </>
                      )}
                      {!signatureInputVisible && (
                        <>
                          {currentUser.signature || '个性签名'}
                          <Tag
                            onClick={this.showSignatureInput}
                            style={{ background: '#fff', borderStyle: 'none' }}
                          >
                            <EditOutlined />
                          </Tag>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="detail">
                    <p>
                      <i className="address" />
                      {currentUser.address}
                    </p>
                  </div>
                  <Divider dashed />
                  <div className="tags">
                    <div className="tagsTitle">标签</div>
                    {currentUser.tags.map((tag) => (
                      <Tag key={tag} closable onClose={() => this.handleClose(tag)}>{tag}</Tag>
                    ))}
                    {inputVisible && (
                      <>
                        <Input
                          ref={(ref) => this.saveInputRef(ref)}
                          type="text"
                          size="small"
                          style={{ width: 78, marginRight: 4 }}
                          value={inputValue}
                          onChange={this.handleInputChange}
                          onBlur={this.handleInputConfirm}
                          onPressEnter={this.handleInputConfirm}
                        />
                        <Spin indicator={antIcon} spinning={submittingTags} />
                      </>
                    )}
                    {!inputVisible && (
                      <Tag
                        onClick={this.showInput}
                        style={{ background: '#fff', borderStyle: 'dashed' }}
                      >
                        {!currentUser.tags.length && '添加您的第一个标签 '}
                        <PlusOutlined />
                      </Tag>
                    )}
                  </div>
                  <Divider style={{ marginTop: 16 }} dashed />
                  <div className="team">
                    <div className="teamTitle">团队</div>
                    <Row gutter={36}>
                      {currentUser.drivers
                        && currentUser.drivers.map((item) => (
                          <Col key={item.driverId} lg={24} xl={12}>
                            <Link to="">
                              <Avatar size="small" src={item.avatar} />
                              {`${item.lastName} ${item.firstName}`}
                            </Link>
                          </Col>
                        ))}
                    </Row>
                    <Button
                      ghost
                      size="small"
                      type="primary"
                      onClick={this.showModal}
                    >
                      <PlusOutlined />
                      添加
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              className="tabsCard"
              bordered={false}
              tabList={operationTabList}
              activeTabKey={tabKey}
              onTabChange={this.onTabChange}
              loading={dataLoading}
            >
              {this.renderChildrenByTabKey(tabKey)}
            </Card>
          </Col>
        </Row>
        <DriverInviteForm
          visible={modalVisible}
          onClose={this.closeModal}
          restaurantId={restaurantId}
        /> */}
      </div>
    );
  }
}

const UPDATE_RESTAURANT = gql`
  mutation UpdateRestaurant($signature: String, $tags: [String!]) {
    updateRestaurant(signature: $signature, tags: $tags) {
      restaurant {
        restaurantId
        signature
        tags
      }
    }
  }
`;

export default compose(
  connect(({ auth: { restaurantId } }) => ({ restaurantId })),
  graphql(RESTAURANT_QUERY, {
    props: ({ data: { getCurrUser, loading } }) => ({
      currentUser: getCurrUser,
      currentUserLoading: loading,
    }),
  }),
  graphql(UPDATE_RESTAURANT, {
    props: ({ mutate }) => ({
      updateRestaurant: (variables) => mutate({ variables }),
    }),
  }),
)(AccountCenter);
