import React from 'react';
import { Accordion, Card } from 'react-bootstrap';

import { TextField, TimeFields, ExertionSlider } from '../shared/forms';

import './activity.scss';

function AddAttempt(wodID, register, watch, setValue, getValues) {
  const timeFields = { total: 'timeTaken', mins: 'timeTakenMins', secs: 'timeTakenSecs' };
  const required = wodID || !!watch('date') || !!watch('timeTaken');

  return (
    <Card>
      <Accordion.Toggle as={Card.Header} eventKey="1">
        {`Attempt${wodID ? '' : ' (Optional)'}`}
      </Accordion.Toggle>
      <Accordion.Collapse eventKey="1">
        <Card.Body>
          {TextField(register, 'When', 'date', 'datetime-local', '', required)}
          {TimeFields(register, setValue, getValues, 'Time Taken', 'timeTaken', timeFields, required)}
          {TextField(register, 'Score', 'score', 'number', 'Rounds + reps?')}
          {TextField(register, 'MEPs', 'meps', 'number', 'Rounds + reps?')}
          {ExertionSlider(register, watch, 'exertion')}
          {TextField(register, 'Notes', 'notes', 'textarea', 'Time per round? Anything else')}
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}

AddAttempt.propTypes = {
};

AddAttempt.contextTypes = {

};

export default AddAttempt;
