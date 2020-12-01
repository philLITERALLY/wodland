import React from 'react';
import PropTypes from 'prop-types';

import Navbar from '../../modules/navbar';

import './App.scss';

class App extends React.Component {
  renderApp() {
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
