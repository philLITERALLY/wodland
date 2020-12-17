import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Card, Form, Button } from 'react-bootstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useForm } from 'react-hook-form';
import { elementScrollIntoView } from 'seamless-scroll-polyfill';

import * as actionCreators from '../../actions';
import { DefaultSpinner } from '../shared/spinner';
import { DropDown, TextField, DateRange, TimeRange, TextFieldRange } from '../shared/forms';
import WODCard from '../shared/wod-card';
import { BoolOpts, WODTypeOpts } from '../../constants';

import './search-wods.scss';

function SearchWODs(props) {
  const foundWODs = React.useRef(null);
  const { getWODs, clearWODs, fetchingWODs, fetchedWODs, wods, history } = props;
  const { register, handleSubmit, watch, getValues, setValue } = useForm();

  const initStartDate = new Date(2014, 10, 4).toISOString().slice(0, 10);
  const initEndDate = new Date().toISOString().slice(0, 10);

  const onSubmit = data => {
    // only use fields with values
    let filters = _.pickBy(data, _.identity);
    filters = _.reduce(filters, (result, value, name) => {
      const newResult = _.clone(result);
      switch (name) {
        case 'startDate':
          // if startDate is different than initial, use start of that day
          if (value !== initStartDate) newResult[name] = new Date(value);
          return newResult;
        case 'endDate':
          // if endDate is different than initial, use end of that day
          if (value !== initEndDate) {
            newResult[name] = new Date(new Date(value).getTime() + 86399999);
          }
          return newResult;
        case 'bestTimeMinMins':
        case 'bestTimeMinSecs':
        case 'bestTimeMaxMins':
        case 'bestTimeMaxSecs':
          return newResult;
        default:
          newResult[name] = value;
          return newResult;
      }
    }, {});

    getWODs(filters);
  };

  React.useEffect(() => {
    // if wods change scroll to them
    if (wods) elementScrollIntoView(foundWODs.current, ({ behavior: 'smooth', block: 'start' }));
  });

  const renderWODDetails = () => (
    <Card>
      <Accordion.Toggle as={Card.Header} eventKey="0">
        WOD Details
      </Accordion.Toggle>
      <Accordion.Collapse eventKey="0">
        <Card.Body>
          {DateRange(register, 'Created Date Range', 'creationDate', 'startDate', 'endDate', initStartDate, initEndDate)}
          {DropDown(register, 'Type', 'type', WODTypeOpts)}
          {TextField(register, 'Source', 'source', 'text', 'Where was the WOD from? e.g. Crossfit, Berserk Online, The Girls, Hero WOD')}
          {TextField(register, 'Include Exercises', 'includeExercise', 'text', 'Enter any exercises to include (separate with comma)')}
          {TextField(register, 'Exclude Exercises', 'excludeExercise', 'text', 'Enter any exercises to exclude (separate with comma)')}
          { /* DropDown(register, 'Picture Included', 'picture', BoolOpts) */ }
          {DropDown(register, 'Attempted Before', 'tried', BoolOpts)}
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );

  const leftSideFields = { total: 'bestTimeMin', mins: 'bestTimeMinMins', secs: 'bestTimeMinSecs' };
  const rightSideFields = { total: 'bestTimeMax', mins: 'bestTimeMaxMins', secs: 'bestTimeMaxSecs' };

  const renderBestAttempt = () => (
    <Card>
      <Accordion.Toggle as={Card.Header} eventKey="1">
        Best Attempt Details
      </Accordion.Toggle>
      <Accordion.Collapse eventKey="1">
        <Card.Body>
          {TimeRange(register, setValue, getValues, 'Time Range', 'time', leftSideFields, rightSideFields)}
          {TextFieldRange(register, 'Score Range', 'score', 'bestScoreLow', 'bestScoreHigh', 'number', 'Rounds + reps?')}
          {TextFieldRange(register, 'MEP Range', 'meps', 'bestMEPSLow', 'bestMEPSHigh', 'number')}
          {TextFieldRange(register, 'Perceived Exertion Range', 'exertion', 'bestExertionLow', 'bestExertionHigh', 'number')}
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );

  const wodList = wods && wods.length > 0
    ? (
      <Accordion>
        { wods && wods.map((wod, index) => WODCard(wod, index + 1, true, history))}
      </Accordion>
    )
    : (
      <div className="noWODs">
        <h2 className="noWODsText">No matching WODs</h2>
      </div>
    );

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)} onChange={clearWODs}>
        <Accordion defaultActiveKey="0">
          {renderWODDetails()}
        </Accordion>
        <Accordion>
          {watch('tried') === 'true' && renderBestAttempt()}
        </Accordion>
        <div className="wodSearch">
          <Button variant="primary" type="submit" className="wodSearchBtn" disabled={fetchingWODs}>
            {fetchingWODs ? DefaultSpinner : 'Search WODs'}
          </Button>
        </div>
      </Form>
      <div ref={foundWODs}>
        {fetchedWODs && wodList}
      </div>
    </div>
  );
}

SearchWODs.propTypes = {
  getWODs: PropTypes.func.isRequired,
  clearWODs: PropTypes.func.isRequired,
  fetchingWODs: PropTypes.bool.isRequired,
  fetchedWODs: PropTypes.bool.isRequired,
  wods: PropTypes.arrayOf(PropTypes.object),
  history: PropTypes.object.isRequired,
};

export default connect(
  state => ({
    fetchingWODs: state.fetchingWODs,
    fetchedWODs: state.fetchedWODs,
    wods: state.wods
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)(SearchWODs);
