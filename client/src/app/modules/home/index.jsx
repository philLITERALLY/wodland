import React from 'react';
import PropTypes from 'prop-types';
import { Card, Nav } from 'react-bootstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import BestStats from './best-stats';
import { StyledSpinner } from '../shared/spinner';
import * as actionCreators from '../../actions';
import { secondsToString } from '../../utils/helpers';

import './home.scss';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = { selectedTab: 'WODs' };

    _.bindAll(this, 'tabChange');
  }

  componentDidMount() {
    this.props.getWeeklyStats();
  }

  tabChange(eventKey) {
    this.setState({ selectedTab: eventKey });
  }

  renderCharts() {
    const { weeklyStats } = this.props;
    const { selectedTab } = this.state;

    return (
      <div className="chartNav">
        <Nav justify variant="tabs" defaultActiveKey="WODs" onSelect={this.tabChange}>
          <Nav.Item className="navItem">
            <Nav.Link eventKey="WODs">WODs</Nav.Link>
          </Nav.Item>
          <Nav.Item className="navItem">
            <Nav.Link eventKey="Time">Time</Nav.Link>
          </Nav.Item>
          <Nav.Item className="navItem">
            <Nav.Link eventKey="MEPs">MEPs</Nav.Link>
          </Nav.Item>
        </Nav>
        <BestStats weeklyStats={weeklyStats} selectedTab={selectedTab} />
      </div>
    );
  }

  renderWeeklyStats() {
    const { weeklyStats } = this.props;

    const thisWeek = moment().format('W');
    const thisYear = moment().format('YYYY');
    const thisWeeksStats = _.find(weeklyStats,
      { week: parseInt(thisWeek, 10), year: parseInt(thisYear, 10) });

    const lastWeek = moment().subtract(7, 'days').format('W');
    const lastYear = moment().subtract(7, 'days').format('YYYY');
    const lastWeeksStats = _.find(weeklyStats,
      { week: parseInt(lastWeek, 10), year: parseInt(lastYear, 10) });

    const noActivitiesT = 'No activities this week';
    const noActivitiesL = 'No activities last week';
    const weekInfo = (weekStats) => (
      <div className="weekInfo">
        <b>WODs</b>
        {weekStats.wods}
        <b>Time</b>
        {secondsToString(weekStats.timeTaken)}
        { weekStats.meps && <b>MEPs</b>}
        { weekStats.meps}
      </div>
    );

    return (
      <div>
        <Card className="weekCard">
          <Card.Header className="cardHeader">This Week</Card.Header>
          <Card.Body>{thisWeeksStats ? weekInfo(thisWeeksStats) : noActivitiesT}</Card.Body>
        </Card>
        <Card className="weekCard">
          <Card.Header className="cardHeader">Last Week</Card.Header>
          <Card.Body>{lastWeeksStats ? weekInfo(lastWeeksStats) : noActivitiesL}</Card.Body>
        </Card>
        { weeklyStats.length > 0 && this.renderCharts()}
      </div>
    );
  }

  render() {
    const { fetchedWeeklyStats } = this.props;

    return (
      <div>
        <h1 className="h1Header">
          <p>Hey</p>
          <p>{localStorage.getItem('username')}</p>
        </h1>
        { fetchedWeeklyStats ? this.renderWeeklyStats() : StyledSpinner }
      </div>
    );
  }
}

Home.propTypes = {
  getWeeklyStats: PropTypes.func.isRequired,
  weeklyStats: PropTypes.array.isRequired,
  fetchedWeeklyStats: PropTypes.bool.isRequired,
};

Home.contextTypes = {

};

export default connect(
  state => ({
    fetchingWeeklyStats: state.fetchingWeeklyStats,
    fetchedWeeklyStats: state.fetchedWeeklyStats,
    weeklyStats: state.weeklyStats
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)(Home);
