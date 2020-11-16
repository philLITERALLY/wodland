import axios from 'axios';
import { createAction } from 'redux-actions';

import { ActionTypes } from '../constants';

const instance = axios.create({
    withCredentials: true,
    baseURL: 'https://sleepy-beach-56365.herokuapp.com'
});

export function authHeader() {
    // return authorization header with jwt token
    let token = localStorage.getItem('token');

    if (token) {
        return { 'Authorization': 'Bearer ' + token };
    } else {
        return {};
    }
}

export function login(username = '', password = '', history) {
    return () => instance.post('/login', { username, password }).then(
        (resp) => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('token', resp.data.token);
            history.push('/');
        },
        (err) => {
            return Promise.reject(err.response.data.code);
        }
    );
}

export function logout(history) {
    // remove user from local storage to log user out
    return () => instance.post('/logout').then(
        (resp) => {
            console.log('logout resp: ', resp);
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.removeItem('token')
            history.push('/login');
        },
        (err) => {
            return Promise.reject(err.response.data.code);
        }
    );
}

export function getWOD(filters) {
    console.log('getWOD filters: ', filters);
    return () => instance.get('/WOD/:wodID', { params: {...filters}, headers: authHeader() }).then(
        (resp) => {
            console.log('getWOD resp: ', resp);
        },
        (err) => {
            console.log('getWOD err: ', err);
        }
    );
}

export function getWODs(filters) {
    console.log('getWODs filters: ', filters);
    return () => instance.get('/WODs', { params: {...filters}, headers: authHeader() }).then(
        (resp) => {
            console.log('getWODs resp: ', resp);
        },
        (err) => {
            console.log('getWODs err: ', err);
        }
    );
}

const createFetchedActivities = createAction(ActionTypes.FETCHED_ACTIVITIES);
export function getActivities(filters) {
    return dispatch => instance.get('/Activities', { params: {...filters}, headers: authHeader() }).then(
        (resp) => {
            dispatch(createFetchedActivities(resp.data));
        },
        (err) => {
            console.log('err: ', err);
        }
    );
}

export function addWOD() {
    return () => instance.post('/WOD', { headers: authHeader() }).then(
        (resp) => {
            console.log('resp: ', resp);
        },
        (err) => {
            console.log('err: ', err);
        }
    );
}

export function addActivity() {
    return () => instance.post('/Activity', { headers: authHeader() }).then(
        (resp) => {
            console.log('resp: ', resp);
        },
        (err) => {
            console.log('err: ', err);
        }
    );
}