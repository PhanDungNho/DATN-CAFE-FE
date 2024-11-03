import React, { Component } from "react";
import { PageHeader } from "@ant-design/pro-layout";
import { Divider } from "antd";

class ContentHeader extends Component {
  render() {
    const { navigate, title, className } = this.props;

    return (
      <>
        <PageHeader
          className={className}
          style={{
            marginLeft: 0,
          }}
          title={title}
          onBack={() => navigate(-1)}
        ></PageHeader>
        <Divider />
      </>
    );
  }
}

export default ContentHeader;