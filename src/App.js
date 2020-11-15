import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Navbar from './navbar'
import AddWOD from './wods/add-wod';
import SearchWODs from './wods/search-wods';
import Diary from './diary';

import './App.css';

const Template = (props) => (
  <div>
    <p className="page-info">
      {props.title}:
    </p>
    <ul className={props.status}>
        <li>Task 1</li>
        <li>Task 2</li>
        <li>Task 3</li>
    </ul>
  </div>
);

const CurrentTasks = () => (
  <Template title="Current Tasks" status="Current"/>
);

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar />
          <Route exact path="/" component={CurrentTasks}/>
          <Route path="/Add-WOD" component={AddWOD}/>
          <Route path="/Search-WODs" component={SearchWODs}/>
          <Route path="/Diary" component={Diary}/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;