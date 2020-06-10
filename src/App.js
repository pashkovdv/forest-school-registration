import React, { Component } from 'react';
import './App.css';
import { Typography } from 'antd';
import AppContent from './components/AppContent';

const { Title } = Typography;

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
    };

  }

  render() {
    return (
      <div>
        <div style={{ margin: '20px' }}>
          <Title level={3}>ГБПОУ РК Петрозаводский лесотехнический техникум</Title>
          <Title level={4}>Приёмная комиссия 2020</Title>
        </div>
        <AppContent />
      </div>
    )
  }
}
