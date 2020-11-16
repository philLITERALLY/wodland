import React, { Component } from 'react';

import Navbar from '../../modules/navbar'

import './App.css';

class App extends Component {
  renderApp() {
    return (
      <div className="body-bg">
        <Navbar />
        {this.props.children}
      </div>
    );
  }

  render() {
    return this.renderApp();
    /* if (
      this.props.currentUser.username
      && this.props.currentUser.clients !== null
      && this.props.clientCapabilities.length > 0
      && this.props.enabledFeatures.length > 0
    ) {
      return this.renderApp();
    }
    if (this.props.alertMessages && this.props.alertMessages.length > 0) {
      return this.renderAlerts();
    }
    return null; */
  }
}

export default App;