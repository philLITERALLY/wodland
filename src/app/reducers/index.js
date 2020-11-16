import _ from 'lodash';
import { handleActions } from 'redux-actions';

import { ActionTypes, unauthRedirectURL } from '../constants';

const appReducer = handleActions({
  [ActionTypes.FETCHED_ACTIVITIES]: (state, action) => _.assign({}, state, { 
    activities: action.payload 
  }),
}, {
  activities: [],
  wods: []
});

// Add in hooks here to modify the root level state based on action type.
export const rootReducer = (state, action) => {
  if (action.type === 'SET_LOGIN_REDIRECT' && action.payload !== unauthRedirectURL) {
    // Reset state when the user logs out.
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export default rootReducer;