import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Login from '../login'
import Navbar from '../navbar'
import AddWOD from '../wods/add-wod';
import SearchWODs from '../wods/search-wods';
import Diary from '../diary';

import './App.css';

const CurrentTasks = () => (
  <div>
    <div>
      <h1>Hey TWat</h1>
      <p>WODs this week: 2</p>
      <p>MEPs this week: 20</p>
    </div>
  </div>
);

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route exact path="/login" component={Login}/>
        <div>
          <Navbar />
          <Route exact path="/" component={CurrentTasks}/>
          <Route path="/add-wod" component={AddWOD}/>
          <Route path="/search-wods" component={SearchWODs}/>
          <Route path="/diary" component={Diary}/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;