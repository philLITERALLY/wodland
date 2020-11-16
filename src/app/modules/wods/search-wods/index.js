import React from 'react';
import { Accordion, Card, Form, Button } from 'react-bootstrap';

import './search-wods.css';

class SearchWODs extends React.Component {
    constructor(props) {
    super(props);
        this.state = { tried: false };
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
                            <Form.Label>Created Date Range</Form.Label>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ width: '47%' }}>
                                    <Form.Control size="sm" type="date" defaultValue={new Date(2014, 11, 13).toISOString().slice(0, 10)} />
                                </div>
                                <span style={{ width: '6%', textAlign: 'center' }}>-</span>
                                <div style={{ width: '47%' }} >
                                    <Form.Control size="sm" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
                                </div>
                            </div>
                        </Form.Group>
                
                        <Form.Group controlId="type">
                            <Form.Label>Type</Form.Label>
                            <Form.Control as="select" defaultValue="--">
                                <option>--</option>
                                <option>WOD</option>
                                <option>Girl</option>
                                <option>Hero</option>
                            </Form.Control>
                        </Form.Group>
                
                        <Form.Group controlId="source">
                            <Form.Label>Source</Form.Label>
                            <Form.Control type="text" />
                            <Form.Text className="text-muted">Where was the WOD from?</Form.Text>
                        </Form.Group>
                
                        <Form.Group controlId="wod">
                            <Form.Label>Exercises</Form.Label>
                            <Form.Control type="text" />
                            <Form.Text className="text-muted">Enter any exercises (separate with comma)</Form.Text>
                        </Form.Group>
                
                        <Form.Group controlId="picture">
                            <Form.Label>Picture Included</Form.Label>
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '50%', marginRight: '5px' }}>
                                    <Form.Check
                                        type="radio"
                                        label="N/A"
                                        name="formHorizontalRadios"
                                        id="pictureNA"
                                    />
                                </div>
                                <div style={{ width: '50%', marginRight: '5px' }}>
                                <Form.Check
                                    type="radio"
                                    label="No"
                                    name="formHorizontalRadios"
                                    id="pictureNO"
                                />
                                </div>
                                <div style={{ width: '50%', marginRight: '5px' }}>
                                <Form.Check
                                    type="radio"
                                    label="Yes"
                                    name="formHorizontalRadios"
                                    id="pictureYES"
                                />
                                </div>
                            </div>
                        </Form.Group>
                
                    <Form.Group controlId="tried">
                        <Form.Label>Attempted Before</Form.Label>
                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', marginRight: '5px' }}>
                                <Form.Check
                                    type="radio"
                                    label="N/A"
                                    name="formHorizontalRadios"
                                    id="triedNA"
                                    onChange={e => this.setState({ tried: false })}
                                />
                            </div>
                            <div style={{ width: '50%', marginRight: '5px' }}>
                            <Form.Check
                                type="radio"
                                label="No"
                                name="formHorizontalRadios"
                                id="triedNO"
                                onChange={e => this.setState({ tried: false })}
                            />
                            </div>
                            <div style={{ width: '50%', marginRight: '5px' }}>
                            <Form.Check
                                type="radio"
                                label="Yes"
                                name="formHorizontalRadios"
                                id="triedYES"
                                onChange={e => this.setState({ tried: true })}
                            />
                            </div>
                        </div>
                    </Form.Group>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        );
    }

    renderBestAttempt() {
        return (
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="1">
                    Best Attempt
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                    <Card.Body>     
                        <Form.Group controlId="time">
                            <Form.Label>Time Range</Form.Label>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ display: 'flex', width: '47%' }}>
                                    <div style={{ width: '50%', marginRight: '5px' }}>
                                        <Form.Control type="text" autoComplete="off" />
                                        <Form.Text className="text-muted">Minutes</Form.Text>
                                    </div>
                                    <div style={{ width: '50%', marginLeft: '5px' }} >
                                        <Form.Control type="text" autoComplete="off" />
                                        <Form.Text className="text-muted">Seconds</Form.Text>
                                    </div>
                                </div>

                                <span style={{ width: '6%', textAlign: 'center' }}>-</span>

                                <div style={{ display: 'flex', width: '47%' }}>
                                    <div style={{ width: '50%', marginRight: '5px' }}>
                                        <Form.Control type="text" autoComplete="off" />
                                        <Form.Text className="text-muted">Minutes</Form.Text>
                                    </div>
                                    <div style={{ width: '50%', marginLeft: '5px' }} >
                                        <Form.Control type="text" autoComplete="off" />
                                        <Form.Text className="text-muted">Seconds</Form.Text>
                                    </div>
                                </div>
                            </div>
                        </Form.Group>
                
                        <Form.Group controlId="score">
                            <Form.Label>Score Range</Form.Label>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ width: '47%' }}>
                                    <Form.Control type="text" />
                                </div>
                                <span style={{ width: '6%', textAlign: 'center' }}>-</span>
                                <div style={{ width: '47%' }} >
                                    <Form.Control type="text" />
                                </div>
                            </div>
                            <Form.Text className="text-muted">Rounds + reps?</Form.Text>
                        </Form.Group>
                
                        <Form.Group controlId="meps">
                            <Form.Label>MEP Range</Form.Label>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ width: '47%' }}>
                                    <Form.Control type="text" />
                                </div>
                                <span style={{ width: '6%', textAlign: 'center' }}>-</span>
                                <div style={{ width: '47%' }} >
                                    <Form.Control type="text" />
                                </div>
                            </div>
                        </Form.Group>

                        <Form.Group controlId="exertion">
                            <Form.Label>Perceived Exertion Range</Form.Label>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ width: '47%' }}>
                                    <Form.Control type="text" />
                                </div>
                                <span style={{ width: '6%', textAlign: 'center' }}>-</span>
                                <div style={{ width: '47%' }} >
                                    <Form.Control type="text" />
                                </div>
                            </div>
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
                    { this.state.tried && this.renderBestAttempt() }
                </Accordion>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button variant="primary" type="submit" style={{ margin: '10px auto', display: 'block' }}>
                        Search WODs
                    </Button>
                    <Button variant="secondary" type="submit" style={{ margin: '10px auto', display: 'block' }}>
                        Feeling Lucky
                    </Button>
                </div>
            </Form>
        );
    }
}

SearchWODs.propTypes = { };

export default SearchWODs;
