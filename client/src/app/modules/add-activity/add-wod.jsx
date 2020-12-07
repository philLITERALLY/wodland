import React from 'react';
import { Accordion, Card } from 'react-bootstrap';

import { TextField, DropDown /* , PhotoUpload */ } from '../shared/forms';
import { WODTypeOpts } from '../../constants';

import './activity.scss';

function AddWOD(register) {
  return (
    <Card>
      <Accordion.Toggle as={Card.Header} eventKey="0">
        WOD Details
      </Accordion.Toggle>
      <Accordion.Collapse eventKey="0">
        <Card.Body>
          {TextField(register, 'Date Created', 'creationT', 'date', '', true)}
          {DropDown(register, 'Type', 'type', WODTypeOpts, '', true)}
          {TextField(register, 'Source', 'source', 'text', 'Where is the WOD from? e.g. Crossfit, Berserk Online, The Girls, Hero WOD')}
          {TextField(register, 'WOD Details', 'exercise', 'textarea')}
          {/* PhotoUpload(register, 'Picture', 'pictureFile') */}
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}

AddWOD.propTypes = {
};

AddWOD.contextTypes = {

};

export default AddWOD;
