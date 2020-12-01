import React from 'react';
import { Form } from 'react-bootstrap';

export const TextField = (register, label, name, type, note) => (
  <Form.Group controlId={name}>
    <Form.Label>{label}</Form.Label>
    <Form.Control name={name} ref={register} type={type} autoComplete="off" />
    {note && <Form.Text className="text-muted">{note}</Form.Text>}
  </Form.Group>
);

export const DropDown = (register, label, name, options, note) => (
  <Form.Group controlId={name}>
    <Form.Label>{label}</Form.Label>
    <Form.Control name={name} ref={register} as="select">
      {options}
    </Form.Control>
    {note && <Form.Text className="text-muted">{note}</Form.Text>}
  </Form.Group>
);

export const BoolRadioButtons = (register, setValue, label, name, note) => (
  <Form.Group controlId="picture">
    <Form.Label>{label}</Form.Label>
    <input name={name} type="hidden" ref={register} />
    <div style={{ display: 'flex' }}>
      <div style={{ width: '50%', marginRight: '5px' }}>
        <Form.Check
          name={name}
          onClick={() => setValue(name, '')}
          type="radio"
          label="N/A"
          id={`${name}NA`}
        />
      </div>
      <div style={{ width: '50%', marginRight: '5px' }}>
        <Form.Check
          name={name}
          onClick={() => setValue(name, false)}
          type="radio"
          label="No"
          id={`${name}NO`}
        />
      </div>
      <div style={{ width: '50%', marginRight: '5px' }}>
        <Form.Check
          name={name}
          onClick={() => setValue(name, true)}
          type="radio"
          label="Yes"
          id={`${name}YES`}
        />
      </div>
    </div>
    {note && <Form.Text className="text-muted">{note}</Form.Text>}
  </Form.Group>
);

export const DateRange = (
  register, label, name, leftName, rightName, leftDate, rightDate, note
) => (
  <Form.Group controlId={name}>
    <Form.Label>{label}</Form.Label>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ width: '47%' }}>
        <Form.Control
          name={leftName}
          ref={register}
          size="sm"
          type="date"
          defaultValue={leftDate}
        />
      </div>
      <span style={{ width: '6%', textAlign: 'center' }}>-</span>
      <div style={{ width: '47%' }}>
        <Form.Control
          name={rightName}
          ref={register}
          size="sm"
          type="date"
          defaultValue={rightDate}
        />
      </div>
    </div>
    {note && <Form.Text className="text-muted">{note}</Form.Text>}
  </Form.Group>
);

export const TimeRange = (register, setValue, getValues, label, name, leftNames, rightNames) => (
  <Form.Group controlId={name}>
    <Form.Label>{label}</Form.Label>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ display: 'flex', width: '47%' }}>
        <input name={leftNames.total} type="number" ref={register} style={{ display: 'none' }} />
        <div style={{ width: '50%', marginRight: '5px' }}>
          <Form.Control
            name={leftNames.mins}
            ref={register({ max: 1 })}
            onChange={(e) => {
              const mins = parseInt(e.target.value, 10) || 0;
              const currentLeftSecs = parseInt(getValues(leftNames.secs), 10) || 0;
              setValue(leftNames.total, mins * 60 + currentLeftSecs);
            }}
            type="text"
            autoComplete="off"
          />
          <Form.Text className="text-muted">Minutes</Form.Text>
        </div>
        <div style={{ width: '50%', marginLeft: '5px' }}>
          <Form.Control
            name={leftNames.secs}
            ref={register}
            onChange={(e) => {
              const secs = parseInt(e.target.value, 10) || 0;
              const currentLeftMins = parseInt(getValues(leftNames.mins), 10) || 0;
              setValue(leftNames.total, currentLeftMins * 60 + secs);
            }}
            type="text"
            autoComplete="off"
          />
          <Form.Text className="text-muted">Seconds</Form.Text>
        </div>
      </div>

      <div style={{ display: 'flex', width: '6%' }}>
        <span style={{ textAlign: 'center', width: '100%', marginTop: '-24px' }}>-</span>
      </div>

      <div style={{ display: 'flex', width: '47%' }}>
        <input name={rightNames.total} type="number" ref={register} style={{ display: 'none' }} />
        <div style={{ width: '50%', marginRight: '5px' }}>
          <Form.Control
            name={rightNames.mins}
            ref={register}
            onChange={(e) => {
              const mins = parseInt(e.target.value, 10) || 0;
              const currentRightSecs = parseInt(getValues(rightNames.secs), 10) || 0;
              setValue(rightNames.total, mins * 60 + currentRightSecs);
            }}
            type="text"
            autoComplete="off"
          />
          <Form.Text className="text-muted">Minutes</Form.Text>
        </div>
        <div style={{ width: '50%', marginLeft: '5px' }}>
          <Form.Control
            name={rightNames.secs}
            ref={register}
            onChange={(e) => {
              const secs = parseInt(e.target.value, 10) || 0;
              const currentRightMins = parseInt(getValues(rightNames.mins), 10) || 0;
              setValue(rightNames.total, currentRightMins * 60 + secs);
            }}
            type="text"
            autoComplete="off"
          />
          <Form.Text className="text-muted">Seconds</Form.Text>
        </div>
      </div>
    </div>
  </Form.Group>
);

export const TextFieldRange = (register, label, name, leftName, rightName, type, note) => (
  <Form.Group controlId={name}>
    <Form.Label>{label}</Form.Label>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ width: '47%' }}>
        <Form.Control name={leftName} ref={register} type={type} autoComplete="off" />
      </div>
      <span style={{ width: '6%', textAlign: 'center' }}>-</span>
      <div style={{ width: '47%' }}>
        <Form.Control name={rightName} ref={register} type={type} autoComplete="off" />
      </div>
    </div>
    {note && <Form.Text className="text-muted">{note}</Form.Text>}
  </Form.Group>
);
