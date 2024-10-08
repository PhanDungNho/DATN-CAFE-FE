
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ToppingList from './ToppingList';
import ToppingForm from './ToppingForm';
import {
  getToppings,
  updateToppingActive,
  insertTopping,
  findToppingByNameContainsIgnoreCase,
  updateTopping,
  getTopping,
} from '../../../redux/actions/toppingAction';
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

export class ListTopping extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topping: { id: "", name: "", active: true },
      open: false,
      query: "",
    };

    this.timeout = null;
  }

  componentDidMount = () => {
    this.props.getToppings();
    console.log('Component Mounted: Fetching toppings');
  };

  editTopping = (value) => {
    this.setState({ topping: value, open: true });
  };

  onSubmitForm = (values) => {
    const { topping } = this.state;

    if (topping.id) {
      this.props.updateTopping(topping.id, values);
    } else {
      this.props.insertTopping(values);
    }

    this.setState({ open: false });
  };

  handleSearch = (value) => {
    const query = value.target.value;
    this.setState({ query });

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      if (query) {
        console.log("llllllllllllllll")
        this.props.findToppingByNameContainsIgnoreCase(query);
      } else {
        this.props.getToppings();
      }
    }, 1500);
  };

  openModal = () => {
    this.setState({ topping: {}, open: true });
  };

  closeModal = () => {
    this.setState({ open: false });
  };

  render() {
    const { toppings, getToppings, isLoading, router } = this.props;
    const { open, query } = this.state;
    const { navigate } = this.props.router;
    if (isLoading) {
      return (
        <>
          <ContentHeader
            navigate={navigate}
            title="List Topping"
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
          title="List Toppings"
          className="site-page-header"
        />

        <Row style={{ marginBottom: 10 }}>
          <Col md={18}>
            <Form layout="inline" name="searchForm" initialValues={{ query }}>
              <Form.Item name="query">
                <Input
                  placeholder="Search toppings"
                  value={query}
                  onChange={this.handleSearch}
                />
              </Form.Item>
            </Form>
          </Col>
          <Col md={6} style={{ textAlign: 'right', paddingRight: 5 }}>
            <Button type="primary" onClick={() => this.setState({ topping: {}, open: true })}>
              New Topping
            </Button>
          </Col>
        </Row>

        <ToppingList
          editTopping={this.editTopping}
          toppings={toppings}
          getToppings={getToppings}
          router={router}
          updateToppingActive={this.props.updateToppingActive}
        />

        <ToppingForm
          router={router}
          isLoading={isLoading}
          open={open}
          topping={this.state.topping}
          onSubmitForm={this.onSubmitForm}
          onCancel={() => {
            this.setState({ ...this.state, open: false })
          }}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  toppings: state.toppingReducer.toppings,
  topping: state.toppingReducer.topping,
  isLoading: state.toppingReducer.isLoading,
});

const mapDispatchToProps = {
  getToppings,
  getTopping,
  updateTopping,
  updateToppingActive,
  findToppingByNameContainsIgnoreCase,
  insertTopping,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ListTopping));
