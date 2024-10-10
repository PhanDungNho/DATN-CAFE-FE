import React, { Component } from "react";
import { connect } from "react-redux";
 
 
import withRouter from "../../../helpers/withRouter";
 
import ContentHeader from "../common/ContentHeader";
import { Button, Col, Form, Input, Row, Skeleton } from "antd";
import CounterForm from "./CounterForm";
import { getAccounts } from "../../../redux/actions/accountAction";

export class Counter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category: {id: "", name: "", active: true},
      open: false,
      query: "",
    };

    this.timeout = null;
  }

  componentDidMount = () => {
   
    console.log("did mount categories");
  };


  

  render() {
    const {  isLoading } = this.props;

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
<CounterForm></CounterForm>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
 getAccounts
});

const mapDispatchToProps = {
 
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Counter));
