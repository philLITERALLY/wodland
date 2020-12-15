import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { WODCardBody } from '../shared/wod-card';
import { DefaultSpinner } from '../shared/spinner';
import * as actionCreators from '../../actions';

import './activity.scss';

class ShowWOD extends React.Component {
  componentDidMount() {
    const { getWODs, wodID } = this.props;
    getWODs({ wodID });
  }

  render() {
    const { fetchedWODs, wods } = this.props;

    return (
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="0">
          WOD Details
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            { fetchedWODs ? WODCardBody(wods[0]) : DefaultSpinner }
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  }
}

ShowWOD.propTypes = {
  getWODs: PropTypes.func.isRequired,
  wodID: PropTypes.number.isRequired,
  fetchedWODs: PropTypes.bool.isRequired,
  wods: PropTypes.array,
};

ShowWOD.contextTypes = {

};

export default connect(
  state => ({
    fetchingWODs: state.fetchingWODs,
    fetchedWODs: state.fetchedWODs,
    wods: state.wods
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)(ShowWOD);
