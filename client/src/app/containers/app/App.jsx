import React from 'react';
import PropTypes from 'prop-types';

import Navbar from '../../modules/navbar';

import './App.scss';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showInstallMessage: false };
  }

  componentDidMount() {
    // Detects if device is on iOS
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    // Detects if device is in standalone mode
    const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

    // Checks if should display install popup notification:
    if (isIos() && !isInStandaloneMode()) {
      this.setState({ showInstallMessage: true });
    }
  }

  renderApp() {
    console.log('this.state: ', this.state);
    return (
      <div className="body-bg">
        <Navbar history={this.props.history} />
        {this.props.children}
      </div>
    );
  }

  render() {
    return this.renderApp();
  }
}

App.propTypes = {
  history: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
};

export default App;
