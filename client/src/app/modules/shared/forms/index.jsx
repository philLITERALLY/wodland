import React from 'react';
import { Form } from 'react-bootstrap';

export const TextField = (register, label, name, type, note, required = false) => (
  <Form.Group controlId={name}>
    <Form.Label>
      {label}
      {required && <span style={{ color: 'red' }}> *</span>}
    </Form.Label>
    <Form.Control
      name={name}
      ref={register({ required })}
      type={type}
      as={type === 'textarea' ? 'textarea' : undefined}
      rows={type === 'textarea' ? 10 : undefined}
      autoComplete="off"
    />
    {note && <Form.Text className="text-muted">{note}</Form.Text>}
  </Form.Group>
);

export const PhotoUpload = (register, label, name) => (
  <Form.Group controlId={name}>
    <Form.File name={name} ref={register} label={label} />
  </Form.Group>
);

export const TimeFields = (register, setValue, getValues, label, name, names, required = false) => (
  <Form.Group controlId={name}>
    <Form.Label>
      {label}
      {required && <span style={{ color: 'red' }}> *</span>}
    </Form.Label>
    <div style={{ display: 'flex' }}>
      <input
        name={names.total}
        type="number"
        ref={register({ required })}
        style={{ display: 'none' }}
      />
      <div style={{ width: '50%', marginRight: '5px' }}>
        <Form.Control
          name={names.mins}
          ref={register}
          onChange={(e) => {
            const mins = parseInt(e.target.value, 10) || 0;
            const currentLeftSecs = parseInt(getValues(names.secs), 10) || 0;

            const total = mins * 60 + currentLeftSecs;
            if (total > 0) setValue(names.total, total);
            else setValue(names.total, undefined);
          }}
          type="text"
          autoComplete="off"
        />
        <Form.Text className="text-muted">Minutes</Form.Text>
      </div>
      <div style={{ width: '50%', marginLeft: '5px' }}>
        <Form.Control
          name={names.secs}
          ref={register}
          onChange={(e) => {
            const secs = parseInt(e.target.value, 10) || 0;
            const currentLeftMins = parseInt(getValues(names.mins), 10) || 0;

            const total = currentLeftMins * 60 + secs;
            if (total > 0) setValue(names.total, total);
            else setValue(names.total, undefined);
          }}
          type="text"
          autoComplete="off"
        />
        <Form.Text className="text-muted">Seconds</Form.Text>
      </div>
    </div>
  </Form.Group>
);

export const ExertionSlider = (register, watch, name) => {
  const effortVal = watch(name);

  let effortTxt = 'N/A';
  if (effortVal < 3) effortTxt = `Easy (${effortVal})`;
  else if (effortVal < 6) effortTxt = `Moderate (${effortVal})`;
  else if (effortVal < 9) effortTxt = `Hard (${effortVal})`;
  else if (effortVal) effortTxt = `Max Effort (${effortVal})`;

  return (
    <Form.Group controlId={name}>
      <Form.Label>Perceived Exertion: {effortTxt}</Form.Label>
      <input
        name={name}
        ref={register}
        type="range"
        className="custom-range"
        min="0"
        max="9"
        defaultValue="0"
      />
      <div style={{ display: 'flex' }}>
        <span style={{ width: '33.33%', textAlign: 'left' }}>Easy</span>
        <span style={{ width: '33.33%', textAlign: 'center' }}>Moderate</span>
        <span style={{ width: '33.33%', textAlign: 'right' }}>Max Effort</span>
      </div>
    </Form.Group>
  );
};

export const DropDown = (register, label, name, options, note, required = false) => (
  <Form.Group controlId={name}>
    <Form.Label>
      {label}
      {required && <span style={{ color: 'red' }}> *</span>}
    </Form.Label>
    <Form.Control
      name={name}
      ref={register({ required })}
      as="select"
    >
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
) =>
  (
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
            ref={register}
            onChange={(e) => {
              const mins = parseInt(e.target.value, 10) || 0;
              const currentLeftSecs = parseInt(getValues(leftNames.secs), 10) || 0;

              const total = mins * 60 + currentLeftSecs;
              if (total > 0) setValue(leftNames.total, total);
              else setValue(leftNames.total, undefined);
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

              const total = currentLeftMins * 60 + secs;
              if (total > 0) setValue(leftNames.total, total);
              else setValue(leftNames.total, undefined);
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

              const total = mins * 60 + currentRightSecs;
              if (total > 0) setValue(rightNames.total, total);
              else setValue(rightNames.total, undefined);
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

              const total = currentRightMins * 60 + secs;
              if (total > 0) setValue(rightNames.total, total);
              else setValue(rightNames.total, undefined);
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
