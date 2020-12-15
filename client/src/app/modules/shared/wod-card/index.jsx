import React from 'react';
import { Accordion, Card, Button } from 'react-bootstrap';
import _ from 'lodash';
import { Timeline, TimelineEvent } from 'react-event-timeline';

import { renderField, renderArea } from '../read-only';
import { secondsToString } from '../../../utils/helpers';

import './wod-card.scss';

function timelineEvent(activity, attempts, bestTimeActivity, bestScoreActivity) {
  let isBestScore; let isBestTime;
  if (attempts > 1) {
    isBestScore = bestScoreActivity && bestScoreActivity.id === activity.id;
    isBestTime = !bestScoreActivity && bestTimeActivity.id === activity.id;
  }

  const activityDate = new Date(activity.date * 1000);
  const dateStr = activityDate.toLocaleTimeString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  return (
    <TimelineEvent
      title=""
      createdAt={dateStr}
      key={activity.id}
      bubbleStyle={{ border: (isBestScore || isBestTime) && '2px solid rgb(111, 186, 28)' }}
      icon={(isBestScore || isBestTime) && 'PB'}
      collapsible
    >
      <p>
        <b>Time Taken: </b>
        {secondsToString(activity.timeTaken)}
      </p>
      { renderField('Score', activity.score)}
      { renderField('MEPs', activity.meps)}
      { renderField('Exertion', activity.exertion)}
      { renderArea('Notes', activity.notes)}
    </TimelineEvent>
  );
}

export function WODCardBody(wod) {
  let bestTimeActivity; let bestScoreActivity;
  let attempts; let bestTime; let bestScore;
  let sortedActivities;
  if (wod.activities) {
    // get count of attempts
    attempts = wod.activities.length;

    // get best time
    bestTimeActivity = _.minBy(wod.activities, 'timeTaken');
    bestTime = bestTimeActivity && secondsToString(bestTimeActivity.timeTaken);

    // get best score
    bestScoreActivity = _.maxBy(wod.activities, 'score');
    bestScore = bestScoreActivity && bestScoreActivity.score;

    // sort activities by date desc
    sortedActivities = _.sortBy(wod.activities, 'date').reverse();
  }

  return (
    <div>
      {renderField('Created On', wod.creationT && new Date(wod.creationT * 1000).toDateString())}
      {renderField('Type', wod.type.join(', '))}
      {renderField('Source', wod.source)}
      {renderArea('Details', wod.exercise)}
      {/* wod.picture && (
      <div marginBottom: '1rem'
        <p><b>Picture: </b></p>
        <img alt="ass" src="https://lh3.googleusercontent.com/5qz2R45BhQG2RCFf-4nc6jNRi5oyd7DaCtHdWkYq6Mbgt0ogq-M9Hl6rgZ7_Ta9TxUoZ9HziVaDfQiEuRpzzjqalhcEGk7v6WjlCO35cKpTU8EHSbBCMRHCOScxCH2aCurEPtglaH9JMniltM0Te7zTyQNQqjCJdpQbz8fcYPMK3LT3H0KGs4g5zTbBI4mJoCI6nG2o5u4Uph_J27KIHyKsNDBc4T9wAA8srFgHADsgrWinEusX_QKL4uO3IHos4HAOi_jmO_3j-NgikgIlWxzTU5xnyhMjbTDhMQTCo18HOptuDUMi7NnXT6bNELBMgZt8Hnsn7pQjR61jI61kjwgmz2oY9eCdMzJWF944hgAHWEWTkjqAVK9HxAg47WOs0_NvTH5o_81os7c45DxIH9SmOPzQTIKUTtYI8GOnDYdoaz4Gt2IfQBc4RwIgofMxaTcaocfUJhm7rf2IbTs4Mgsd_zLnqU4uUVEHx6n8h23yP752SxgxgAoRhuvaCUPiuoK1nvbJlxzYOlBUKALKWj89nLL90vSKWTaFuI5Mkk9FJfHzZWN-UY-k06pSgoX9UhDctmxf2VTY_t9zfguP9WcokVP9uxarQShA3i_MV4_zMN9xIjTJbY3VTREqnd9Z50L8FON6mvVmyw56Ir7liLZoHpzeAOVx3JHPYIojngbY3zgcUj1y2bCyp1QDxZRLyRXBGoAFl05NYpQdnL_9xp_u43ryTePwOJbCO684ozm5FmCYupJkOU_o=w273-h591-no?authuser=0" />
      </div>
      ) */}
      {renderField('Number of Attempts', attempts)}
      {renderField('Best Time', bestTime)}
      {renderField('Best Score', bestScore)}
      {sortedActivities && <p><b>Attempts: </b></p>}
      {sortedActivities && (
      <Timeline>
        { sortedActivities.map((activity) =>
          timelineEvent(activity, attempts, bestTimeActivity, bestScoreActivity))}
      </Timeline>
      )}
    </div>
  );
}

function WODCard(wod, index, displayIndex, history) {
  return (
    <Card key={wod.id}>
      <Accordion.Toggle as={Card.Header} eventKey={wod.id}>
        <span className="wodDetailsHeader">
          {`WOD Details${displayIndex ? ` - ${index}` : ''}`}
        </span>
        <Button
          variant="secondary"
          className="addAttempt"
          onClick={(e) => {
            e.stopPropagation();
            history.push(`/add-activity?wodID=${wod.id}`);
          }}
        >
          Add Attempt
        </Button>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={wod.id}>
        <Card.Body>
          { WODCardBody(wod) }
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}

export default WODCard;
