import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Form, Button, Spinner } from 'react-bootstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useForm } from 'react-hook-form';
import queryString from 'query-string';

import ShowWOD from './show-wod';
import AddWOD from './add-wod';
import AddAttempt from './add-attempt';
import * as actionCreators from '../../actions';

import './activity.scss';

function AddActivity(props) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
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
          if (value.length !== 0) newResult[name] = value;
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

  const spinner = <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />;
  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Accordion defaultActiveKey={wodID ? '1' : '0'}>
        {wodID ? <ShowWOD wodID={wodID} /> : AddWOD(register)}
        {AddAttempt(wodID, register, watch, setValue, getValues)}
      </Accordion>
      {!_.isEmpty(errors) && (
        <div style={{ color: 'red', textAlign: 'center', paddingTop: '10px' }}>
          {`Missing required fields (${Object.keys(errors).join(', ')})`}
        </div>
      )}
      <Button
        variant="primary"
        type="submit"
        style={{ margin: '10px auto', display: 'block' }}
        disabled={addingActivity}
      >
        {addingActivity ? spinner : 'Save'}
      </Button>
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
