import React from 'react';
import { Accordion, Card, Button } from 'react-bootstrap';
import cssModules from 'react-css-modules';

import { secondsToString } from '../../../utils/helpers';

import styles from './wod-card.scss';

function WODCard(wod, index, displayIndex) {
  const renderField = (label, value) => value && (<p><b>{label}: </b> {value}</p>);

  const renderArea = (label, value) => value && (
    <div>
      <p><b>{label}: </b></p>
      <Card style={{ marginBottom: '1rem', width: 'fit-content' }}>
        <div style={{ padding: '0.5rem' }} dangerouslySetInnerHTML={{ __html: value }} />
      </Card>
    </div>
  );

  return (
    <Card key={wod.id}>
      <Accordion.Toggle as={Card.Header} eventKey={wod.id}>
        <span style={{ lineHeight: '38px', verticalAlign: 'middle' }}>
          {`WOD Details${displayIndex ? ` - ${index}` : ''}`}
        </span>
        <Button variant="secondary" style={{ float: 'right' }} onClick={(e) => { e.stopPropagation(); }}>Add Attempt</Button>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={wod.id}>
        <Card.Body>
          { renderField('Created On', wod.creationT && new Date(wod.creationT * 1000).toDateString()) }
          { renderField('Type', wod.type.join(', ')) }
          { renderField('Source', wod.source) }
          { renderArea('Details', wod.exercise) }
          { wod.picture && (
            <div style={{ marginBottom: '1rem' }}>
              <p><b>Picture: </b></p>
              <img alt="ass" src="https://lh3.googleusercontent.com/5qz2R45BhQG2RCFf-4nc6jNRi5oyd7DaCtHdWkYq6Mbgt0ogq-M9Hl6rgZ7_Ta9TxUoZ9HziVaDfQiEuRpzzjqalhcEGk7v6WjlCO35cKpTU8EHSbBCMRHCOScxCH2aCurEPtglaH9JMniltM0Te7zTyQNQqjCJdpQbz8fcYPMK3LT3H0KGs4g5zTbBI4mJoCI6nG2o5u4Uph_J27KIHyKsNDBc4T9wAA8srFgHADsgrWinEusX_QKL4uO3IHos4HAOi_jmO_3j-NgikgIlWxzTU5xnyhMjbTDhMQTCo18HOptuDUMi7NnXT6bNELBMgZt8Hnsn7pQjR61jI61kjwgmz2oY9eCdMzJWF944hgAHWEWTkjqAVK9HxAg47WOs0_NvTH5o_81os7c45DxIH9SmOPzQTIKUTtYI8GOnDYdoaz4Gt2IfQBc4RwIgofMxaTcaocfUJhm7rf2IbTs4Mgsd_zLnqU4uUVEHx6n8h23yP752SxgxgAoRhuvaCUPiuoK1nvbJlxzYOlBUKALKWj89nLL90vSKWTaFuI5Mkk9FJfHzZWN-UY-k06pSgoX9UhDctmxf2VTY_t9zfguP9WcokVP9uxarQShA3i_MV4_zMN9xIjTJbY3VTREqnd9Z50L8FON6mvVmyw56Ir7liLZoHpzeAOVx3JHPYIojngbY3zgcUj1y2bCyp1QDxZRLyRXBGoAFl05NYpQdnL_9xp_u43ryTePwOJbCO684ozm5FmCYupJkOU_o=w273-h591-no?authuser=0" />
            </div>
          )}
          { renderField('Attempts', wod.attempts > 0 && wod.attempts) }
          { renderField('Best Time', wod.bestTime && secondsToString(wod.bestTime)) }
          { renderField('Best Score', wod.bestScore) }
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}

export default cssModules(WODCard, styles, { allowMultiple: true });
