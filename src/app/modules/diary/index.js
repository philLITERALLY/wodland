import PropTypes from 'prop-types';
import React from 'react';
import { Accordion, Card } from 'react-bootstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DayPicker from 'react-day-picker';

import * as actionCreators from '../../actions';

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
    console.log('startOfMonth: ', startOfMonth);
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

  renderWOD(wod, index) {
    return (
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey={index}>
            WOD Details
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={index}>
          <Card.Body>             
              { this.renderField('Type', wod.type) }
              { this.renderField('Source', wod.source) }
              { this.renderArea('Details', wod.exercise) }
              { wod.picture && (
                <div>
                  <p>Picture:</p>
                  <img alt="ass" src="https://lh3.googleusercontent.com/5qz2R45BhQG2RCFf-4nc6jNRi5oyd7DaCtHdWkYq6Mbgt0ogq-M9Hl6rgZ7_Ta9TxUoZ9HziVaDfQiEuRpzzjqalhcEGk7v6WjlCO35cKpTU8EHSbBCMRHCOScxCH2aCurEPtglaH9JMniltM0Te7zTyQNQqjCJdpQbz8fcYPMK3LT3H0KGs4g5zTbBI4mJoCI6nG2o5u4Uph_J27KIHyKsNDBc4T9wAA8srFgHADsgrWinEusX_QKL4uO3IHos4HAOi_jmO_3j-NgikgIlWxzTU5xnyhMjbTDhMQTCo18HOptuDUMi7NnXT6bNELBMgZt8Hnsn7pQjR61jI61kjwgmz2oY9eCdMzJWF944hgAHWEWTkjqAVK9HxAg47WOs0_NvTH5o_81os7c45DxIH9SmOPzQTIKUTtYI8GOnDYdoaz4Gt2IfQBc4RwIgofMxaTcaocfUJhm7rf2IbTs4Mgsd_zLnqU4uUVEHx6n8h23yP752SxgxgAoRhuvaCUPiuoK1nvbJlxzYOlBUKALKWj89nLL90vSKWTaFuI5Mkk9FJfHzZWN-UY-k06pSgoX9UhDctmxf2VTY_t9zfguP9WcokVP9uxarQShA3i_MV4_zMN9xIjTJbY3VTREqnd9Z50L8FON6mvVmyw56Ir7liLZoHpzeAOVx3JHPYIojngbY3zgcUj1y2bCyp1QDxZRLyRXBGoAFl05NYpQdnL_9xp_u43ryTePwOJbCO684ozm5FmCYupJkOU_o=w273-h591-no?authuser=0" />
                </div>
              )}
              </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  }

  renderActivity(activity, index) {
    const mins = Math.floor(activity.timeTaken % 3600 / 60);
    const secs = Math.floor(activity.timeTaken % 3600 % 60);
    
    return (
      <div key={activity.id} style={{ padding: '0 0.5rem', wordBreak: 'break-all' }}>
        { index > 1 && <hr /> }

        <h2>Activity {index} Details</h2>
        <p>
          <b>Time Taken: </b> 
          { mins > 0 && `${mins} mins ` }
          { secs > 0 && `${secs} secs` }
        </p>
        { this.renderField('Score', activity.score) }
        { this.renderField('MEPs', activity.meps) }
        { this.renderField('Exertion', activity.exertion) }
        { this.renderArea('Notes', activity.notes) }

        { this.renderWOD(activity.wod, index) }
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
    
    if (activitiesToday.length === 0) return <h2>No WODs</h2>;
    else {
      return (
        <Accordion>
          {
            activitiesToday.map((activity, index) => 
              this.renderActivity(activity, index + 1))
          }
        </Accordion>
      )
    }
  }

  render() {
    const modifiers = {
      wods: this.state.wods,
      selectedDay: this.state.selectedDay,
    };

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
            disabledDays={{ after: new Date() }}
            onDayClick={(day) => this.setState({ selectedDay: day })}
            onMonthChange={this.monthChange}
            todayButton="Go to Today"
          />
        </div>
        <hr />
        <div>
          { this.renderDay() }
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
  t: PropTypes.func,
  router: PropTypes.object,
};

export default connect(
  state => ({ activities: state.activities }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)(Diary);