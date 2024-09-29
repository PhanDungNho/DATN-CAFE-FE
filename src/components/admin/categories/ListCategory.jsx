import React, { Component } from "react";
import { connect } from "react-redux";
import CategoryList from "./CategoryList";
import {
  findCategoryByNameContainsIgnoreCase,
  getCategories,
  getCategory,
  insertCategory,
  updateCategory,
  updateCategoryActive,
} from "../../../redux/actions/categoryAction";
import withRouter from "../../../helpers/withRouter";
import CategoryForm from "./CategoryForm";
import ContentHeader from "../common/ContentHeader";
import { Button, Col, Form, Input, Row, Skeleton } from "antd";

export class ListCategory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category: {},
      open: false,
      query: "",
    };

    this.timeout = null;
  }

  componentDidMount = () => {
    this.props.getCategories();
    console.log("did mount categories");
  };

  editCategory = (value) => {
    this.setState({ category: value, open: true });
  };

  onSubmitForm = (values) => {
    const { category } = this.state;

    if (category.id) {
      this.props.updateCategory(category.id, values);
    } else {
      this.props.insertCategory(values);
    }

    this.setState({ open: false });
  };

  handleSearch = (value) => {
    const query = value.target.value;
    this.setState({ query });
  
    clearTimeout(this.timeout);
  
    this.timeout = setTimeout(() => {
      if (query) {
        this.props.findCategoryByNameContainsIgnoreCase(query).then((result) => {
          // if (Array.isArray(result)) {
          //   if (result.length === 0) {
          //   }
          // } else {
          //   this.props.getCategories([]);
          // }
        });
      } else {
        this.props.getCategories();
      }
    }, 1000);
  };
  

  render() {
    const { categories, getCategories, router, isLoading } = this.props;
    const { open, query } = this.state;
    const { navigate } = this.props.router;

    if (isLoading) {
      return (
        <>
          <ContentHeader
            navigate={navigate}
            title="List Categories"
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
          title="List Category"
          className="site-page-header"
        ></ContentHeader>

        <Row style={{ marginBottom: 10 }}>
          <Col md={18}>
            <Form layout="inline" name="searchForm" initialValues={{ query }}>
              <Form.Item name="query">
                <Input
                  placeholder="Search"
                  value={query}
                  onChange={this.handleSearch}
                />
              </Form.Item>
            </Form>
          </Col>
          <Col md={6} style={{ textAlign: "right", paddingRight: 5 }}>
            <Button
              type="primary"
              onClick={() => this.setState({ category: {}, open: true })}
            >
              New Category
            </Button>
          </Col>
        </Row>

        <CategoryList
          editCategory={this.editCategory}
          categories={categories}
          getCategories={getCategories}
          router={router}
          updateCategoryActive={this.props.updateCategoryActive}
        />

        <CategoryForm
          router={router}
          isLoading={isLoading}
          open={open}
          category={this.state.category}
          onSubmitForm={this.onSubmitForm}
          onCancel={() => {
            this.setState({ ...this.state, open: false });
          }}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  categories: state.categoryReducer.categories,
  category: state.categoryReducer.category,
  isLoading: state.commonReducer.isLoading,
});

const mapDispatchToProps = {
  getCategories,
  getCategory,
  insertCategory,
  updateCategory,
  updateCategoryActive,
  findCategoryByNameContainsIgnoreCase,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ListCategory));
