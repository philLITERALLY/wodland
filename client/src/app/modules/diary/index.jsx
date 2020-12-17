import React from 'react';
import PropTypes from 'prop-types';
import { Accordion } from 'react-bootstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DayPicker from 'react-day-picker';
import { Timeline, TimelineEvent } from 'react-event-timeline';

import { renderField, renderArea } from '../shared/read-only';
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
    this.setState({ selectedDay: undefined });
  }

  renderActivity(activity) {
    const activityDate = new Date(activity.date * 1000);
    const dateStr = activityDate.toLocaleTimeString([], { timeStyle: 'short' });
    return (
      <TimelineEvent
        title=""
        createdAt={dateStr}
        key={activity.id}
        bubbleStyle={{ border: '', backgroundColor: '#61dafb' }}
      >
        { renderField('Time Taken', secondsToString(activity.timeTaken))}
        { renderField('Score', activity.score)}
        { renderField('MEPs', activity.meps)}
        { renderField('Exertion', activity.exertion)}
        { renderArea('Notes', activity.notes)}
        <Accordion>
          {WODCard(activity.wod, null, false, this.props.history)}
        </Accordion>
      </TimelineEvent>
    );
  }

  renderDay() {
    const { props: { activities }, state: { selectedDay } } = this;

    if (!selectedDay) return <h2 className="noActivities">Select a Day</h2>;

    const activitiesToday = _.reduce(activities, (result, activity) => {
      const activityDate = new Date(activity.date * 1000);
      if (Diary.sameDay(selectedDay, activityDate)) result.push(activity);
      return result;
    }, []);

    const sortedActivities = _.sortBy(activitiesToday, 'date');

    return activitiesToday.length === 0 ? <h2 className="noActivities">No Activities</h2> : (
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
      wods: { color: '#e76f51' },
      selectedDay: { color: '#0489ae', backgroundColor: '#61dafb' }
    };

    return (
      <div>
        <div className="dayPickerContainer">
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
        <div className="dayContainer">
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
