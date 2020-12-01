import React from 'react';
import PropTypes from 'prop-types';
import cssModules from 'react-css-modules';
import { Accordion, Card } from 'react-bootstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DayPicker from 'react-day-picker';

import WODCard from '../shared/wod-card';
import * as actionCreators from '../../actions';
import { secondsToString } from '../../utils/helpers';

import 'react-day-picker/lib/style.css';
import styles from './diary.scss';

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
          <div style={{ padding: '0.5rem' }} dangerouslySetInnerHTML={{ __html: value }} />
        </Card>
      </div>
    );
  }
  /* eslint-enable react/no-danger */

  static renderActivity(activity, index) {
    return (
      <div key={activity.id} style={{ padding: '0 0.5rem', wordBreak: 'break-all' }}>
        { index > 1 && <hr /> }

        <h2>Activity {index} Details</h2>
        <p>
          <b>Time Taken: </b>
          { secondsToString(activity.timeTaken) }
        </p>
        { Diary.renderField('Score', activity.score) }
        { Diary.renderField('MEPs', activity.meps) }
        { Diary.renderField('Exertion', activity.exertion) }
        { Diary.renderArea('Notes', activity.notes) }

        { WODCard(activity.wod, index) }
      </div>
    );
  }

  constructor(props) {
    super(props);

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.props.getActivities({ startDate: startOfMonth, endDate: today });

    this.state = { selectedDay: today, wods: [] };

    _.bindAll(this, 'newActivities', 'monthChange');
  }

  componentDidUpdate(prevProps) {
    if (this.props.activities !== prevProps.activities) this.newActivities();
  }

  newActivities() {
    this.setState({ wods: _.flatMap(this.props.activities,
      activity => new Date(activity.date * 1000))
    });
  }

  monthChange(startOfMonth) {
    const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);
    this.props.getActivities({ startDate: startOfMonth, endDate: endOfMonth });
    this.setState({ selectedDay: startOfMonth });
  }

  renderDay() {
    const { props: { activities }, state: { selectedDay } } = this;

    const activitiesToday = _.reduce(activities, (result, activity) => {
      const activityDate = new Date(activity.date * 1000);
      if (Diary.sameDay(selectedDay, activityDate)) result.push(activity);
      return result;
    }, []);

    return activitiesToday.length === 0 ? (
      <h2 style={{ textAlign: 'center' }}>No WODs</h2>
    ) : (
      <Accordion>
        {
          activitiesToday.map((activity, index) => Diary.renderActivity(activity, index + 1))
        }
      </Accordion>
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
          { fetchedActivities && this.renderDay() }
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
};

Diary.contextTypes = {

};

export const StyledDiary = cssModules(Diary, styles, { allowMultiple: true });

export default connect(
  state => ({
    fetchingActivities: state.fetchingActivities,
    fetchedActivities: state.fetchedActivities,
    activities: state.activities
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)(StyledDiary);
