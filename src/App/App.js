import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Navbar from '../Navbar'
import AddWOD from '../WODs/add-wod';
import SearchWODs from '../WODs/search-wods';
import Diary from '../Diary';

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