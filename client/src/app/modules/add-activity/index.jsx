import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Form, Button } from 'react-bootstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useForm } from 'react-hook-form';
import queryString from 'query-string';
import { windowScrollTo } from 'seamless-scroll-polyfill';

import ShowWOD from './show-wod';
import AddWOD from './add-wod';
import AddAttempt from './add-attempt';
import { DefaultSpinner } from '../shared/spinner';
import * as actionCreators from '../../actions';

import './activity.scss';

function AddActivity(props) {
  useEffect(() => {
    windowScrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  const { addActivity, history, addingActivity, location } = props;
  let wodID = queryString.parse(location.search).wodID;
  wodID = wodID && parseInt(wodID, 10);

  const { register, handleSubmit, watch, setValue, getValues, errors } = useForm({
    defaultValues: {
      creationT: new Date().toISOString().slice(0, 10),
    }
  });

  const onSubmit = data => {
    // if wod ID exists add it to data
    Object.assign(data, { wodID });

    // only use fields with values
    let details = _.pickBy(data, _.identity);
    details = _.reduce(details, (result, value, name) => {
      const newResult = _.clone(result);
      switch (name) {
        case 'creationT':
        case 'date':
          newResult[name] = new Date(value).getTime() / 1000;
          return newResult;
        case 'type':
          newResult[name] = [value];
          return newResult;
        case 'pictureFile':
          if (value.length !== 0) newResult[name] = value[0];
          return newResult;
        case 'timeTaken':
        case 'score':
        case 'meps':
        case 'exertion':
          if (value !== '0') newResult[name] = parseInt(value, 10);
          return newResult;
        case 'timeTakenMins':
        case 'timeTakenSecs':
          return newResult;
        default:
          newResult[name] = value;
          return newResult;
      }
    }, {});

    addActivity(details, history);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Accordion defaultActiveKey={wodID ? '1' : '0'}>
        {wodID ? <ShowWOD wodID={wodID} /> : AddWOD(register)}
        {AddAttempt(wodID, register, watch, setValue, getValues)}
      </Accordion>
      { _.map(errors, (error, index) => <div className="error" key={index}>{error.message}</div>) }
      <div className="saveContainer">
        <Button variant="primary" type="submit" className="saveBtn" disabled={addingActivity}>
          {addingActivity ? DefaultSpinner : 'Save'}
        </Button>
      </div>
    </Form>
  );
}

AddActivity.propTypes = {
  addActivity: PropTypes.func.isRequired,
  addingActivity: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

AddActivity.contextTypes = {

};

export default connect(
  state => ({
    addingActivity: state.addingActivity,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)(AddActivity);
