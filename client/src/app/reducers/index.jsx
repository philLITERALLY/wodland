import _ from 'lodash';
import { handleActions } from 'redux-actions';

import { ActionTypes } from '../constants';

const reducers = handleActions({
  /* Fetching Weekly Stats */
  [ActionTypes.FETCHING_WEEKLY_STATS]: state => (
    _.assign({}, state, {
      fetchingWeeklyStats: true,
      failedfetchingWeeklyStats: false,
      fetchedWeeklyStats: false,
    })
  ),

  [ActionTypes.FAILED_FETCHING_WEEKLY_STATS]: state => (
    _.assign({}, state, {
      fetchingWeeklyStats: false,
      failedfetchingWeeklyStats: true,
      fetchedWeeklyStats: false
    })
  ),

  [ActionTypes.FETCHED_WEEKLY_STATS]: (state, action) => (
    _.assign({}, state, {
      fetchingWeeklyStats: false,
      fetchedWeeklyStats: true,
      weeklyStats: action.payload
    })
  ),

  /* Fetching Activities */
  [ActionTypes.FETCHING_ACTIVITIES]: state => (
    _.assign({}, state, {
      fetchingActivities: true,
      failedfetchingActivities: false,
      fetchedActivities: false,
    })
  ),

  [ActionTypes.FAILED_FETCHING_ACTIVITIES]: state => (
    _.assign({}, state, {
      fetchingActivities: false,
      failedfetchingActivities: true,
      fetchedActivities: false
    })
  ),

  [ActionTypes.FETCHED_ACTIVITIES]: (state, action) => (
    // add any new activities in to state
    _.assign({}, state, {
      fetchingActivities: false,
      fetchedActivities: true,
      activities: _.unionBy(state.activities, action.payload, 'id')
    })
  ),

  /* Fetching WODs */
  [ActionTypes.FETCHING_WODS]: state => (
    _.assign({}, state, {
      fetchingWODs: true,
      failedfetchingWODs: false,
      fetchedWODs: false,
      wods: undefined
    })
  ),

  [ActionTypes.FAILED_FETCHING_WODS]: state => (
    _.assign({}, state, {
      fetchingWODs: false,
      failedfetchingWODs: true,
      fetchedWODs: false,
      wods: undefined
    })
  ),

  [ActionTypes.FETCHED_WODS]: (state, action) => (
    // add any new activities in to state
    _.assign({}, state, {
      fetchingWODs: false,
      fetchedWODs: true,
      wods: action.payload
    })
  ),

  [ActionTypes.CLEAR_WODS]: state => (
    _.assign({}, state, {
      fetchingWODs: false,
      failedfetchingWODs: false,
      fetchedWODs: false,
      wods: undefined
    })
  ),
}, {
  /* Weekly Stats */
  fetchingWeeklyStats: false,
  failedfetchingWeeklyStats: false,
  fetchedWeeklyStats: false,
  weeklyStats: [],
  /* Activities */
  fetchingActivities: false,
  failedfetchingActivities: false,
  fetchedActivities: false,
  activities: [],
  /* WODs */
  fetchingWODs: false,
  failedfetchingWODs: false,
  fetchedWODs: false,
  wods: undefined
});

export default reducers;
