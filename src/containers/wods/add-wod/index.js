import React from 'react';
import { Accordion, Card, Form, Button } from 'react-bootstrap';

import './new-wod.css';

class NewWOD extends React.Component {
    constructor(props) {
    super(props);
        this.state = { effortVal: undefined };
    }

    saveWOD(event) {
        event.preventDefault();
        console.log('submit: ', event);
    }

    renderWODDetails() {
        return (
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                    WOD Details
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>                
                        <Form.Group controlId="creation_date">
                            <Form.Label>Date Created</Form.Label>
                            <Form.Control type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
                        </Form.Group>
                
                        <Form.Group controlId="type">
                            <Form.Label>Type</Form.Label>
                            <Form.Control as="select" defaultValue="WOD">
                                <option>WOD</option>
                                <option>Girl</option>
                                <option>Hero</option>
                            </Form.Control>
                        </Form.Group>
                
                        <Form.Group controlId="source">
                            <Form.Label>Source</Form.Label>
                            <Form.Control type="text" />
                            <Form.Text className="text-muted">Where is the WOD from?</Form.Text>
                        </Form.Group>
                
                        <Form.Group controlId="wod">
                            <Form.Label>WOD Details</Form.Label>
                            <Form.Control as="textarea" rows={10} />
                        </Form.Group>
                
                        <Form.Group controlId="picture">
                            <Form.File id="pictureFile" label="Picture" />
                        </Form.Group>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        );
    }

    renderCurrentDetails() {
        let effortTxt = 'N/A';
        if (this.state.effortVal < 3) effortTxt = `Easy (${this.state.effortVal})`
        else if (this.state.effortVal < 6) effortTxt = `Moderate (${this.state.effortVal})`
        else if (this.state.effortVal < 9) effortTxt = `Hard (${this.state.effortVal})`
        else if (this.state.effortVal) effortTxt = `Max Effort (${this.state.effortVal})`

        return (
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="1">
                    This Attempt (Optional)
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                    <Card.Body>     
                        <Form.Group controlId="time">
                            <Form.Label>Time</Form.Label>
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '50%', marginRight: '5px' }}>
                                    <Form.Control type="text" autoComplete="off" />
                                    <Form.Text className="text-muted">Minutes</Form.Text>
                                </div>
                                <div style={{ width: '50%', marginLeft: '5px' }} >
                                    <Form.Control type="text" autoComplete="off" />
                                    <Form.Text className="text-muted">Seconds</Form.Text>
                                </div>
                            </div>
                        </Form.Group>
                
                        <Form.Group controlId="score">
                            <Form.Label>Score</Form.Label>
                            <Form.Control type="text" />
                            <Form.Text className="text-muted">Rounds + reps?</Form.Text>
                        </Form.Group>
                
                        <Form.Group controlId="meps">
                            <Form.Label>MEPs</Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>

                        <Form.Group controlId="exertion">
                            <Form.Label>Perceived Exertion: { effortTxt }</Form.Label>
                            <input 
                                type="range" 
                                className="custom-range"
                                min="0"
                                max="9"
                                id="exertion"
                                defaultValue="0"
                                onChange={e => this.setState({ effortVal: e.target.value })}
                            />
                            <div style={{ display: 'flex' }}>
                                <span style={{ width: '33.33%', textAlign: 'left' }}>Easy</span>
                                <span style={{ width: '33.33%', textAlign: 'center' }}>Moderate</span>
                                <span style={{ width: '33.33%', textAlign: 'right' }}>Max Effort</span>
                            </div>
                        </Form.Group>

                        <Form.Group controlId="notes">
                            <Form.Label>Notes</Form.Label>
                            <Form.Control as="textarea" rows={10} />
                            <Form.Text className="text-muted">Time per round? Anything else</Form.Text>
                        </Form.Group>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        );
    }

    render() {
        return (
            <Form onSubmit={this.saveWOD}>
                <Accordion defaultActiveKey="0">
                    { this.renderWODDetails() }
                    { this.renderCurrentDetails() }
                </Accordion>
                <Button variant="primary" type="submit" style={{ margin: '10px auto', display: 'block' }}>
                    Save
                </Button>
            </Form>
        );
    }
}

NewWOD.propTypes = { };

export default NewWOD;
