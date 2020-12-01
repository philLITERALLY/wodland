import React from 'react';
import PropTypes from 'prop-types';
import cssModules from 'react-css-modules';
import { Form, Button } from 'react-bootstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from '../../actions';

import styles from './login.scss';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = { username: '', password: '', invalid: false };

    _.bindAll(this, 'loginPost');
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
      <div className="background">
        <div className="login">
          <h1 className="header">WOD Land</h1>
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

export const StyledLogin = cssModules(Login, styles, { allowMultiple: true });

export default connect(
  null,
  dispatch => bindActionCreators(actionCreators, dispatch),
)(StyledLogin);
