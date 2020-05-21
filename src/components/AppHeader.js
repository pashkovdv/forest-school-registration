import React, { Component } from "react";
import { Layout, PageHeader } from "antd";
const { Header } = Layout;

export default class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <PageHeader
        title={this.props.title} 
        subTitle={this.props.subTitle} 
      >
      </PageHeader>
);
  }
}
