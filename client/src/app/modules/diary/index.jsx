import PropTypes from 'prop-types';
import React from 'react';
import { Accordion, Card } from 'react-bootstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DayPicker from 'react-day-picker';

import WODCard from '../shared/wod-card';
import * as actionCreators from '../../actions';
import { secondsToString } from '../../utils/helpers';

import 'react-day-picker/lib/style.css';
import './diary.css';

class Diary extends React.Component {
  constructor(props) {
    super(props);

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.props.getActivities({ startDate: startOfMonth, endDate: today });

    this.state = { selectedDay: today, wods: [] };

    _.bindAll(this, 'monthChange');
  }
  
  componentDidUpdate(prevProps) {
    const { activities } = this.props;
    if (this.props.activities !== prevProps.activities) {
      this.setState({ wods: _.flatMap(activities, activity => new Date(activity.date * 1000)) });
    }
  }

  monthChange(startOfMonth) {
    const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);
    this.props.getActivities({ startDate: startOfMonth, endDate: endOfMonth });
    this.setState({ selectedDay: startOfMonth });
  }

  sameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  renderField(label, value) {
    return value && <p><b>{label}: </b> {value}</p>;
  }

  renderArea(label, value) {
    return value && (
      <div>
        <p><b>{label}: </b></p>
        <Card style={{ marginBottom: '1rem', width: 'fit-content' }}>
          <div style={{ padding: '0.5rem' }} dangerouslySetInnerHTML={{ __html: value }} />
        </Card>
      </div>
    );
  }

  renderActivity(activity, index) {    
    return (
      <div key={activity.id} style={{ padding: '0 0.5rem', wordBreak: 'break-all' }}>
        { index > 1 && <hr /> }

        <h2>Activity {index} Details</h2>
        <p>
          <b>Time Taken: </b> 
          { secondsToString(activity.timeTaken) }
        </p>
        { this.renderField('Score', activity.score) }
        { this.renderField('MEPs', activity.meps) }
        { this.renderField('Exertion', activity.exertion) }
        { this.renderArea('Notes', activity.notes) }

        { WODCard(activity.wod, index) }
      </div>
    )
  }

  renderDay() {
    const { props: { activities }, state: { selectedDay } } = this;

    const activitiesToday = _.reduce(activities, (result, activity) => {
      const activityDate = new Date(activity.date * 1000)
      if (this.sameDay(selectedDay, activityDate)) result.push(activity);
      return result;
    }, []);
    
    return activitiesToday.length === 0 ? (
      <h2 style={{ textAlign: 'center' }}>No WODs</h2>
    ) : (
      <Accordion>
        {
          activitiesToday.map((activity, index) =>  this.renderActivity(activity, index + 1))
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
  location: PropTypes.object,
  login: PropTypes.func,
  error: PropTypes.string,
  reset: PropTypes.func,
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