import React from 'react';
import { Card } from 'react-bootstrap';

import './read-only.scss';

export const renderField = (label, value) =>
  value && <p><b>{label}: </b> {value}</p>;

/* eslint-disable react/no-danger */
export const renderArea = (label, value) => value && (
  <div>
    <p><b>{label}: </b></p>
    <Card className="areaCard">
      <div className="areaCardContents" dangerouslySetInnerHTML={{ __html: value }} />
    </Card>
  </div>
);
  /* eslint-enable react/no-danger */
