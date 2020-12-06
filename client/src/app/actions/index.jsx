/* eslint-disable no-console */
import axios from 'axios';
import { createAction } from 'redux-actions';

import { ActionTypes } from '../constants';

function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const instance = () => axios.create({
  baseURL: 'https://sleepy-beach-56365.herokuapp.com/',
  headers: authHeader()
});

export function login(username = '', password = '', history) {
  return () => instance().post('api/login', { username, password }).then(
    (resp) => {
      // store user details and jwt token in local storage
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      localStorage.setItem('token', resp.data.token);
      history.replace('/');
    },
    (err) => Promise.reject(err.response.data.code)
  );
}

export function logout(history) {
  // remove user from local storage to log user out
  return () => instance().post('api/logout').then(
    () => {
      // store user details and jwt token in local storage
      // this keeps user logged in between page refreshes
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      localStorage.removeItem('token');
      history.replace('/login');
    },
    (err) => Promise.reject(err.response.data.code)
  );
}

const createFetchingWeeklyStats = createAction(ActionTypes.FETCHING_WEEKLY_STATS);
const createFetchedWeeklyStats = createAction(ActionTypes.FETCHED_WEEKLY_STATS);
const createFailedFetchingWeeklyStats = createAction(ActionTypes.FAILED_FETCHING_WEEKLY_STATS);
export function getWeeklyStats() {
  return dispatch => {
    dispatch(createFetchingWeeklyStats());
    instance().get('api/WeeklyStats').then(
      (resp) => dispatch(createFetchedWeeklyStats(resp.data)),
      () => dispatch(createFailedFetchingWeeklyStats())
    );
  };
}

export function getWOD(filters) {
  console.log('getWOD filters: ', filters);
  return () => instance().get('api/WOD/:wodID', { params: { ...filters } }).then(
    (resp) => {
      console.log('getWOD resp: ', resp);
    },
    (err) => {
      console.log('getWOD err: ', err);
    }
  );
}

const createFetchingWODs = createAction(ActionTypes.FETCHING_WODS);
const createFetchedWODs = createAction(ActionTypes.FETCHED_WODS);
const createFailedFetchingWODs = createAction(ActionTypes.FAILED_FETCHING_WODS);
export const clearWODs = createAction(ActionTypes.CLEAR_WODS);
export function getWODs(filters) {
  return dispatch => {
    dispatch(createFetchingWODs());
    instance().get('api/WODs', { params: { ...filters } }).then(
      (resp) => dispatch(createFetchedWODs(resp.data)),
      () => dispatch(createFailedFetchingWODs())
    );
  };
}

const createFetchingActivities = createAction(ActionTypes.FETCHING_ACTIVITIES);
const createFetchedActivities = createAction(ActionTypes.FETCHED_ACTIVITIES);
const createFailedFetchingActivities = createAction(ActionTypes.FAILED_FETCHING_ACTIVITIES);
export function getActivities(filters) {
  return dispatch => {
    dispatch(createFetchingActivities());
    instance().get('api/Activities', { params: { ...filters } }).then(
      (resp) => dispatch(createFetchedActivities(resp.data)),
      () => dispatch(createFailedFetchingActivities())
    );
  };
}

export function AddActivity() {
  return () => instance().post('api/WOD', { headers: authHeader() }).then(
    (resp) => {
      console.log('resp: ', resp);
    },
    (err) => {
      console.log('err: ', err);
    }
  );
}

export function addActivity() {
  return () => instance().post('api/Activity', { headers: authHeader() }).then(
    (resp) => {
      console.log('resp: ', resp);
    },
    (err) => {
      console.log('err: ', err);
    }
  );
}
