import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Card } from 'react-bootstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DayPicker from 'react-day-picker';
import { Timeline, TimelineEvent } from 'react-event-timeline';

import WODCard from '../shared/wod-card';
import * as actionCreators from '../../actions';
import { secondsToString } from '../../utils/helpers';

import 'react-day-picker/lib/style.css';
import './diary.scss';

class Diary extends React.Component {
  static sameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear()
      && date1.getMonth() === date2.getMonth()
      && date1.getDate() === date2.getDate();
  }

  static renderField(label, value) {
    return value && <p><b>{label}: </b> {value}</p>;
  }

  /* eslint-disable react/no-danger */
  static renderArea(label, value) {
    return value && (
      <div>
        <p><b>{label}: </b></p>
        <Card style={{ marginBottom: '1rem', width: 'fit-content' }}>
          <div style={{ padding: '0.5rem', whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: value }} />
        </Card>
      </div>
    );
  }
  /* eslint-enable react/no-danger */

  constructor(props) {
    super(props);

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.props.getActivities({ startDate: startOfMonth, endDate: endOfMonth });

    this.state = { selectedDay: today, wods: [] };

    _.bindAll(this, 'newActivities', 'monthChange');
  }

  componentDidUpdate(prevProps) {
    if (this.props.activities !== prevProps.activities) this.newActivities();
  }

  newActivities() {
    this.setState({
      wods: _.flatMap(this.props.activities,
        activity => new Date(activity.date * 1000))
    });
  }

  monthChange(startOfMonth) {
    const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);
    this.props.getActivities({ startDate: startOfMonth, endDate: endOfMonth });
    this.setState({ selectedDay: startOfMonth });
  }

  renderActivity(activity) {
    const activityDate = new Date(activity.date * 1000);
    const dateStr = activityDate.toLocaleTimeString([], { timeStyle: 'short' });
    return (
      <TimelineEvent
        title=""
        createdAt={dateStr}
        key={activity.id}
        bubbleStyle={{ border: '' }}
      >
        { Diary.renderField('Time Taken', secondsToString(activity.timeTaken))}
        { Diary.renderField('Score', activity.score)}
        { Diary.renderField('MEPs', activity.meps)}
        { Diary.renderField('Exertion', activity.exertion)}
        { Diary.renderArea('Notes', activity.notes)}
        <Accordion>
          {WODCard(activity.wod, null, false, this.props.history)}
        </Accordion>
      </TimelineEvent>
    );
  }

  renderDay() {
    const { props: { activities }, state: { selectedDay } } = this;

    const activitiesToday = _.reduce(activities, (result, activity) => {
      const activityDate = new Date(activity.date * 1000);
      if (Diary.sameDay(selectedDay, activityDate)) result.push(activity);
      return result;
    }, []);

    const sortedActivities = _.sortBy(activitiesToday, 'date');

    return activitiesToday.length === 0 ? (
      <h2 style={{ textAlign: 'center' }}>No WODs</h2>
    )
      : (
        <Timeline>
          {sortedActivities.map((activity) => this.renderActivity(activity))}
        </Timeline>
      );
  }

  render() {
    const {
      state: { wods, selectedDay },
      props: { fetchingActivities, fetchedActivities }
    } = this;

    const modifiers = { wods, selectedDay };
    const modifiersStyles = {
      wods: { color: '#E76F51' },
      selectedDay: { color: '#264653', backgroundColor: '#2A9D8F' }
    };

    return (
      <div>
        <div style={{ margin: 'auto', width: 'fit-content' }}>
          <DayPicker
            month={new Date()}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            disabledDays={{ after: new Date(), before: fetchingActivities && new Date() }}
            onDayClick={(day) => this.setState({ selectedDay: day })}
            onMonthChange={this.monthChange}
            todayButton="Go to Today"
          />
        </div>
        <hr />
        <div style={{ margin: 'auto', paddingBottom: '1rem' }}>
          {fetchedActivities && this.renderDay()}
        </div>
      </div>
    );
  }
}

Diary.propTypes = {
  getActivities: PropTypes.func.isRequired,
  activities: PropTypes.array.isRequired,
  fetchingActivities: PropTypes.bool.isRequired,
  fetchedActivities: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
};

Diary.contextTypes = {

};

export default connect(
  state => ({
    fetchingActivities: state.fetchingActivities,
    fetchedActivities: state.fetchedActivities,
    activities: state.activities
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)(Diary);
