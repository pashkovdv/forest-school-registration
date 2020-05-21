import React, { Component } from 'react';
import './App.css';
import { Layout } from 'antd';
import AppHeader from "./components/AppHeader";
import AppContent from './components/AppContent';
const { Content } = Layout;

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
    };

  }

  render() {
    return (
      <div>
        <AppHeader title="ГБПОУ РК Петрозаводский лесотехнический техникум" subTitle="Приёмная комиссия 2020" />
        <AppContent></AppContent>
      </div>
    )
  }
}
