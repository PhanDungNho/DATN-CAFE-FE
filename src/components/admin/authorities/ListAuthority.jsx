// src/components/ListAuthority.jsx

import React, { Component } from 'react';
import { connect } from 'react-redux';
import AuthorityList from './AuthorityList';
import {
  getAccounts,
  findAccountByNameContainsIgnoreCase,

} from '../../../redux/actions/accountAction.jsx';
import {
  Col,
  Form,
  Input,
  Row,
  Skeleton,
} from 'antd';
import ContentHeader from '../common/ContentHeader';
import withRouter from '../../../helpers/withRouter';

export class ListAuthority extends Component {
  constructor(props) {
    super(props);

    this.state = {
      account: { username: "", fullName: "", amountPaid: "", phone: "", active: true, image: "" },
      open: false,
      query: '',
    };

    this.timeout = null;
  }

  componentDidMount = () => {
    this.props.getAccounts();
    console.log('Component Mounted: Fetching accounts');
  };

  editAuthority = (value) => {
    this.setState({ authority: value, open: true });
  };

  onSubmitForm = (values) => {
    const { authority } = this.state;

    if (authority.id) {
      this.props.updateAuthority(authority.id, values);
      // You might have a separate action for updating authority details
    } else {
      this.props.insertAuthority(values);
    }

    this.setState({ open: false });
  };

  handleSearch = (event) => {
    const query = event.target.value;
    this.setState({ query });

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      if (query) {
        this.props.findAccountByNameContainsIgnoreCase(query);
      } else {
        this.props.getAccounts();
      }
    }, 1500); // Reduced debounce time for better UX
  };

  openModal = () => {
    this.setState({ authority: {}, open: true });
  };

  closeModal = () => {
    this.setState({ open: false });
  };

  render() {
    const { accounts, isLoading } = this.props;
    const {  query } = this.state;
    const { navigate } = this.props.router;
    if (isLoading) {
      return (
        <>
          <ContentHeader
            navigate={navigate}
            title="List Authority"
            className="site-page-header"
          ></ContentHeader>
          <Skeleton active />
        </>
      );
    }
    return (
      <>
        <ContentHeader
          navigate={navigate}
          title="List Authorities"
          className="site-page-header"
        />

        <Row style={{ marginBottom: 10 }}>
          <Col md={18}>
            <Form layout="inline" name="searchForm" initialValues={{ query }}>
              <Form.Item name="query">
                <Input
                  placeholder="Search accounts"
                  value={query}
                  onChange={this.handleSearch}
                  allowClear
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>

        <AuthorityList
          // editAuthority={this.editAuthority}
          accounts={accounts}
          getAccounts={getAccounts}
        //   updateAuthorityActive={this.props.updateAuthorityActive}
        />

        
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  accounts: state.accountReducer.accounts,
  isLoading: state.authorityReducer.isLoading,
  error: state.authorityReducer.error,
});

const mapDispatchToProps = {
  getAccounts,
  findAccountByNameContainsIgnoreCase
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ListAuthority));
