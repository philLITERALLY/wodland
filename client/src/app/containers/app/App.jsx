import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Navbar from '../../modules/navbar';
import IphoneInstallPWA from '../../modules/shared/install-pwa';

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

    // Detect if we've asked to install in the last 5 days
    const today = new Date();
    const lastPrompt = new Date(localStorage.getItem('installPrompt'));
    const days = moment(today).diff(lastPrompt, 'days');
    const installReminder = Number.isNaN(days) || days > 5;

    // Checks if should display install popup notification:
    if (isIos() && !isInStandaloneMode() && installReminder) {
      localStorage.setItem('installPrompt', today);
      this.setState({ showInstallMessage: true });
    }
  }

  renderApp() {
    return (
      <div className="bodyBackground">
        <div className="iphoneHeader" />
        <Navbar history={this.props.history} />
        <div>
          {this.props.children}
        </div>
        {this.state.showInstallMessage && <IphoneInstallPWA />}
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
