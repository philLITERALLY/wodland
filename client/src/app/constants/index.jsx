import React from 'react';

export const ActionTypes = {
  FETCHING_WEEKLY_STATS: 'FETCHING_WEEKLY_STATS',
  FAILED_FETCHING_WEEKLY_STATS: 'FAILED_FETCHING_WEEKLY_STATS',
  FETCHED_WEEKLY_STATS: 'FETCHED_WEEKLY_STATS',

  FETCHING_ACTIVITIES: 'FETCHING_ACTIVITIES',
  FAILED_FETCHING_ACTIVITIES: 'FAILED_FETCHING_ACTIVITIES',
  FETCHED_ACTIVITIES: 'FETCHED_ACTIVITIES',

  FETCHING_WODS: 'FETCHING_WODS',
  FAILED_FETCHING_WODS: 'FAILED_FETCHING_WODS',
  FETCHED_WODS: 'FETCHED_WODS',
  CLEAR_WODS: 'CLEAR_WODS',

  ADDING_ACTIVITY: 'ADDING_ACTIVITY',
  FAILED_ADDING_ACTIVITIES: 'FAILED_ADDING_ACTIVITIES',
  ADDED_ACTIVITIES: 'ADDED_ACTIVITIES',
};

export const WODTypeOpts = [
  <option value="" key="--">--</option>,
  <option key="EMOM">EMOM</option>,
  <option key="AMRAP">AMRAP</option>,
  <option key="RFT">RFT</option>,
  <option key="TABATA">TABATA</option>,
  <option key="For Time">For Time</option>,
  <option key="Max Reps">Max Reps</option>,
  <option key="Chipper">Chipper</option>,
  <option key="Ladder">Ladder</option>,
];

export const RangeValuesOpts = [
  <option key="2">2</option>,
  <option key="3">3</option>,
  <option key="4">4</option>,
  <option key="5">5</option>,
  <option key="6">6</option>,
  <option key="7">7</option>,
  <option key="8">8</option>,
  <option key="9">9</option>,
  <option key="10">10</option>,
  <option key="11">11</option>,
  <option key="12">12</option>,
];

export const RangeTypeOpts = [
  <option value="weeks" key="Week">Weeks</option>,
  <option value="months" key="Month">Months</option>,
];
