import React, { Component } from 'react';
import DayPicker from 'react-day-picker';

import 'react-day-picker/lib/style.css';
import './diary.css';

class Diary extends Component {
  constructor(props) {
    super(props);

    const today = new Date();
    var wods = [];
    for (var i = 0; i < 5; i++) {
        wods.push(this.randomDate(new Date(today.getFullYear(), today.getMonth(), 1), today))
    } 

    this.state = { selectedDay: today, wods };
  }

  randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
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
            todayButton="Go to Today"
          />
        </div>
        <hr />
        <div>
          <span>{this.state.selectedDay.toDateString()}</span>
          <span>WODs</span>
        </div>
      </div>
    );
  }
}
  
export default Diary;