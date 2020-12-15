import React from 'react';
import { Spinner } from 'react-bootstrap';

import './spinner.scss';

export const DefaultSpinner = <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />;

export const StyledSpinner = (
  <div className="spinnerContainer">
    <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" className="spinnerColor" />
  </div>
);
