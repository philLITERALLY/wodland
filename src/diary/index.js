import React, { Component } from 'react';
import DayPicker from 'react-day-picker';

import 'react-day-picker/lib/style.css';

class Diary extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedDay: new Date() };
  }

    render() {
      const modifiers = {
        thursdays: { daysOfWeek: [4] },
        birthday: new Date(2018, 9, 30),
        selectedDay: this.state.selectedDay,
      };

      const modifiersStyles = {
        thursdays: {
          color: '#ffc107',
          backgroundColor: '#fffdee',
        },
        selectedDay: {
          color: 'green',
          backgroundColor: '#fffdee',
        }
      };

      return (
        <div>
          <div>
            <DayPicker
              month={new Date()}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              disabledDays={{ after: new Date() }}
              onDayClick={(day, modifiers, e) => this.setState({ selectedDay: day })}
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