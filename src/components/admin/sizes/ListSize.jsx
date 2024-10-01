// src/components/ListSize.jsx

import React, { Component } from 'react';
import { connect } from 'react-redux';
import SizeList from './SizeList';
import SizeForm from './SizeForm';
import {
  getSizes,
  updateSizeActive,
  insertSize,
  findSizeByNameContainsIgnoreCase,
  updateSize,
} from '../../../redux/actions/sizeAction';
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Skeleton,
  Modal,
} from 'antd';
import ContentHeader from '../common/ContentHeader';
import withRouter from '../../../helpers/withRouter';

export class ListSize extends Component {
  constructor(props) {
    super(props);

    this.state = {
      size: { id: "", name: "", active: true },
      open: false,
      query: '',
    };

    this.timeout = null;
  }

  componentDidMount = () => {
    this.props.getSizes();
    console.log('Component Mounted: Fetching sizes');
  };

  editSize = (value) => {
    this.setState({ size: value, open: true });
  };

  onSubmitForm = (values) => {
    const { size } = this.state;

    if (size.id) {
      this.props.updateSize(size.id, values);
      // You might have a separate action for updating size details
    } else {
      this.props.insertSize(values);
    }

    this.setState({ open: false });
  };

  handleSearch = (event) => {
    const query = event.target.value;
    this.setState({ query });

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      if (query) {
        this.props.findSizeByNameContainsIgnoreCase(query);
      } else {
        this.props.getSizes();
      }
    }, 1500); // Reduced debounce time for better UX
  };

  openModal = () => {
    this.setState({ size: {}, open: true });
  };

  closeModal = () => {
    this.setState({ open: false });
  };

  render() {
    const { sizes, isLoading, error } = this.props;
    const { open, query } = this.state;
    const { navigate } = this.props.router;
    if (isLoading) {
      return (
        <>
          <ContentHeader
            navigate={navigate}
            title="List Size"
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
          title="List Sizes"
          className="site-page-header"
        />

        <Row style={{ marginBottom: 10 }}>
          <Col md={18}>
            <Form layout="inline" name="searchForm" initialValues={{ query }}>
              <Form.Item name="query">
                <Input
                  placeholder="Search sizes"
                  value={query}
                  onChange={this.handleSearch}
                  allowClear
                />
              </Form.Item>
            </Form>
          </Col>
          <Col md={6} style={{ textAlign: 'right', paddingRight: 5 }}>
            <Button type="primary" onClick={() => this.setState({ size: {}, open: true })}>
              New Size
            </Button>
          </Col>
        </Row>

        <SizeList
          editSize={this.editSize}
          sizes={sizes}
          updateSizeActive={this.props.updateSizeActive}
        />

        <SizeForm
          onSubmitForm={this.onSubmitForm}
          isLoading={isLoading}
          size={this.state.size}
          onCancel={() => {
            this.setState({ ...this.state, open: false })
          }}
          open={open}
          updateSizeActive={updateSizeActive}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  sizes: state.sizeReducer.sizes,
  isLoading: state.sizeReducer.isLoading,
  error: state.sizeReducer.error,
});

const mapDispatchToProps = {
  getSizes,
  updateSizeActive,
  findSizeByNameContainsIgnoreCase,
  insertSize,
  updateSize,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ListSize));
