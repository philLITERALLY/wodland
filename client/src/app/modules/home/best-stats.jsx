import PropTypes from 'prop-types';
import React from 'react';
import { Card } from 'react-bootstrap';
import _ from 'lodash';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import {
  VictoryChart, VictoryTheme, VictoryContainer, VictoryLabel, VictoryAxis, VictoryLine
} from 'victory';

import { RangeValuesOpts, RangeTypeOpts } from '../../constants';
import { DropDown } from '../shared/forms';
import { secondsToString, weekYearToDateFormat } from '../../utils/helpers';

function BestStats(props) {
  const { selectedTab, weeklyStats } = props;
  const { register, watch } = useForm({ defaultValues: { rangeValue: '6', rangeType: 'weeks' } });

  const tickValue = parseInt(watch('rangeValue'), 10); // how many weeks/months
  const tick = watch('rangeType'); // weeks/months

  let cardContent; let
    caseWODs;
  const chartData = [];
  let domain = [];
  let tickFormat = (value) => `${Math.round(value)}`;
  const week = moment().subtract(tickValue - 1, tick).startOf('isoweek');
  const endWeek = moment().startOf('isoweek');

  switch (selectedTab) {
    case 'WODs':
      caseWODs = _.maxBy(weeklyStats, 'wods');
      cardContent = (
        <div style={{ display: 'grid' }}>
          <b>Most WODs in a Week</b>
          {`${caseWODs.wods} (${weekYearToDateFormat(caseWODs.week, caseWODs.year)})`}
        </div>
      );

      for (; week <= endWeek; week.add(1, 'week')) {
        const value = _.find(weeklyStats, { week: week.week(), year: week.year() });
        chartData.push({ x: week.toDate(), y: (value && value.wods) || 0 });
      }

      domain = [0, caseWODs.wods];
      break;
    case 'Time':
      caseWODs = _.maxBy(weeklyStats, 'timeTaken');
      cardContent = (
        <div style={{ display: 'grid' }}>
          <b>Most Time in a Week</b>
          {`${secondsToString(caseWODs.timeTaken)} (${weekYearToDateFormat(caseWODs.week, caseWODs.year)})`}
        </div>
      );

      for (; week <= endWeek; week.add(1, 'week')) {
        const value = _.find(weeklyStats, { week: week.week(), year: week.year() });
        chartData.push({ x: week.toDate(), y: (value && value.timeTaken / 60) || 0 });
      }

      domain = [0, caseWODs.timeTaken / 60];
      tickFormat = (value) => `${Math.round(value)}\nmins`;
      break;
    case 'MEPs':
      caseWODs = _.maxBy(weeklyStats, 'meps');
      cardContent = (
        <div style={{ display: 'grid' }}>
          <b>Most MEPs in a Week</b>
          {`${caseWODs.meps} (${weekYearToDateFormat(caseWODs.week, caseWODs.year)})`}
        </div>
      );

      for (; week <= endWeek; week.add(1, 'week')) {
        const value = _.find(weeklyStats, { week: week.week(), year: week.year() });
        chartData.push({ x: week.toDate(), y: (value && value.meps) || 0 });
      }

      domain = [0, caseWODs.meps];
      break;
    default:
      cardContent = 'Error?!';
      break;
  }

  return (
    <Card style={{ borderTop: '0' }}>
      <Card.Header>
        {cardContent}
      </Card.Header>
      <div style={{ display: 'flex', padding: '1rem' }}>
        <VictoryChart
          theme={VictoryTheme.material}
          scale={{ x: 'time' }}
          containerComponent={(
            <VictoryContainer
              style={{ pointerEvents: 'auto', userSelect: 'auto', touchAction: 'auto' }}
            />
          )}
        >
          <VictoryLabel text={`${selectedTab} per Week`} x={175} y={40} textAnchor="middle" />
          <VictoryAxis tickCount={3} />
          <VictoryAxis dependentAxis tickCount={5} tickFormat={tickFormat} domain={domain} />
          <VictoryLine
            style={{ data: { stroke: '#c43a31' }, parent: { border: '1px solid #ccc' } }}
            animate={{ duration: 1000, onLoad: { duration: 1000 } }}
            data={chartData}
            interpolation="monotoneX"
          />
        </VictoryChart>
      </div>
      <Card.Footer>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '50%', paddingRight: '5px' }}>
            {DropDown(register, '', 'rangeValue', RangeValuesOpts)}
          </div>
          <div style={{ width: '50%', paddingLeft: '5px' }}>
            {DropDown(register, '', 'rangeType', RangeTypeOpts)}
          </div>
        </div>
      </Card.Footer>
    </Card>
  );
}

BestStats.propTypes = {
  selectedTab: PropTypes.string.isRequired,
  weeklyStats: PropTypes.array.isRequired,
};

export default BestStats;
