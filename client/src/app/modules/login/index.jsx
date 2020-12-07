import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Form, Button } from 'react-bootstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import image from '../../../assets/images/logo512.png';
import IphoneInstallPWA from '../shared/install-pwa';
import * as actionCreators from '../../actions';

import './login.scss';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showInstallMessage: false,
      username: '',
      password: '',
      invalid: false
    };

    _.bindAll(this, 'loginPost');
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
    const today = moment().toDate();
    const lastPrompt = moment(localStorage.getItem('installPrompt'));
    const days = moment(today).diff(lastPrompt, 'days');
    const installReminder = Number.isNaN(days) || days > 5;

    // Checks if should display install popup notification:
    if (isIos() && !isInStandaloneMode() && installReminder) {
      localStorage.setItem('installPrompt', today);
      this.setState({ showInstallMessage: true });
    }
  }

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  loginPost(event) {
    const {
      props: { login, history },
      state: { username, password }
    } = this;
    event.preventDefault();

    return login(username, password, history).then(
      () => { },
      () => this.setState({ invalid: true })
    );
  }

  render() {
    return (
      <div className="background" style={{ backgroundColor: '#FFF', height: '100vh' }}>
        <div className="login">
          <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
            <img src={image} className="modal-border-rounded" height="100" width="100" alt="Install PWA" />
          </div>
          <Form onSubmit={this.loginPost}>
            <Form.Group size="lg" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                autoFocus
                type="username"
                value={this.state.username}
                onChange={(e) => this.setState({ username: e.target.value })}
                isInvalid={this.state.invalid}
              />
            </Form.Group>
            <Form.Group size="lg" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={this.state.password}
                onChange={(e) => this.setState({ password: e.target.value })}
                isInvalid={this.state.invalid}
              />
              <Form.Control.Feedback type="invalid">
                Incorrect Username or Password
              </Form.Control.Feedback>
            </Form.Group>
            <Button block size="lg" type="submit" disabled={!this.validateForm()}>
              Login
            </Button>
          </Form>
        </div>
        {this.state.showInstallMessage && <IphoneInstallPWA />}
      </div>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

Login.contextTypes = {

};

export default connect(
  null,
  dispatch => bindActionCreators(actionCreators, dispatch),
)(Login);
