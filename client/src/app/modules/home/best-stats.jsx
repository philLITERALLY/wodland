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

import './best-stats.scss';

function BestStats(props) {
  const { selectedTab, weeklyStats } = props;
  const { register, watch } = useForm({ defaultValues: { rangeValue: '6', rangeType: 'weeks' } });

  const tickValue = parseInt(watch('rangeValue'), 10); // how many weeks/months
  const tick = watch('rangeType'); // weeks/months

  let cardHeader; let cardValue; let caseWODs;
  const chartData = [];
  let domain = [];
  let tickFormat = (value) => `${Math.round(value)}`;
  const week = moment().subtract(tickValue - 1, tick).startOf('isoweek');
  const endWeek = moment().startOf('isoweek');

  switch (selectedTab) {
    case 'WODs':
      caseWODs = _.maxBy(weeklyStats, 'wods');
      cardHeader = 'Most WODs in a Week';
      cardValue = `${caseWODs.wods} (${weekYearToDateFormat(caseWODs.week, caseWODs.year)})`;

      for (; week <= endWeek; week.add(1, 'week')) {
        const value = _.find(weeklyStats, { week: week.week(), year: week.year() });
        chartData.push({ x: week.toDate(), y: (value && value.wods) || 0 });
      }

      domain = [0, caseWODs.wods];
      break;
    case 'Time':
      caseWODs = _.maxBy(weeklyStats, 'timeTaken');
      cardHeader = 'Most Time in a Week';
      cardValue = `${secondsToString(caseWODs.timeTaken)} (${weekYearToDateFormat(caseWODs.week, caseWODs.year)})`;

      for (; week <= endWeek; week.add(1, 'week')) {
        const value = _.find(weeklyStats, { week: week.week(), year: week.year() });
        chartData.push({ x: week.toDate(), y: (value && value.timeTaken / 60) || 0 });
      }

      domain = [0, caseWODs.timeTaken / 60];
      tickFormat = (value) => `${Math.round(value)}\nmins`;
      break;
    case 'MEPs':
      caseWODs = _.maxBy(weeklyStats, 'meps');
      cardHeader = 'Most MEPs in a Week';
      cardValue = `${caseWODs.meps} (${weekYearToDateFormat(caseWODs.week, caseWODs.year)})`;

      for (; week <= endWeek; week.add(1, 'week')) {
        const value = _.find(weeklyStats, { week: week.week(), year: week.year() });
        chartData.push({ x: week.toDate(), y: (value && value.meps) || 0 });
      }

      domain = [0, caseWODs.meps];
      break;
    default:
      cardHeader = 'Error?!';
      cardValue = 'Error?!';
      break;
  }

  return (
    <Card className="cardContainer">
      <Card.Header className="cardHeader">
        <div className="cardContent">
          <b>{cardHeader}</b>
          {cardValue}
        </div>
      </Card.Header>
      <div className="chartContainer">
        <VictoryChart
          theme={VictoryTheme.material}
          scale={{ x: 'time' }}
          containerComponent={(<VictoryContainer className="victoryContainer" />)}
        >
          <VictoryLabel text={`${selectedTab} per Week`} x={175} y={40} textAnchor="middle" />
          <VictoryAxis tickCount={3} />
          <VictoryAxis dependentAxis tickCount={5} tickFormat={tickFormat} domain={domain} />
          <VictoryLine
            style={{ data: { stroke: '#61dafb' }, parent: { border: '1px solid #ccc' } }}
            animate={{ duration: 1000, onLoad: { duration: 1000 } }}
            data={chartData}
            interpolation="monotoneX"
          />
        </VictoryChart>
      </div>
      <Card.Footer>
        <div className="chartDropdownContainer">
          <div className="chartDropdown">
            {DropDown(register, '', 'rangeValue', RangeValuesOpts)}
          </div>
          <div className="chartDropdown">
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
