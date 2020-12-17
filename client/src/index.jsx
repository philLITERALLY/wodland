import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
// import { createLogger } from 'redux-logger';

import App from './app/containers/app/App';
import Login from './app/modules/login';
import Home from './app/modules/home';
import AddActivity from './app/modules/add-activity';
import SearchWODs from './app/modules/search-wods';
import Diary from './app/modules/diary';

import reducers from './app/reducers';
import reportWebVitals from './app/utils/reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';

require('./global.scss');

// const loggerMiddleware = createLogger();
const store = createStore(reducers, applyMiddleware(
  thunkMiddleware, // loggerMiddleware
));

const PrivateRoute = ({ ...rest }) => (
  <Route
    {...rest}
    render={props => (
      localStorage.getItem('username') && localStorage.getItem('password') && localStorage.getItem('token')
        ? (
          <App location={props.location} history={props.history}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/add-activity" component={AddActivity} />
              <Route path="/search-wods" component={SearchWODs} />
              <Route path="/diary" component={Diary} />
            </Switch>
          </App>
        ) : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )}
  />
);

PrivateRoute.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
};

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <PrivateRoute path="/" />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
