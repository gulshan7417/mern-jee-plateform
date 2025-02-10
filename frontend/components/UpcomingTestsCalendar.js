// frontend/components/UpcomingTestsCalendar.js
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const UpcomingTestsCalendar = ({ tests }) => {
  // You can mark dates with tests scheduled.
  return (
    <div>
      <Calendar
        // Customize calendar as needed
      />
      <div>
        {tests.map((test) => (
          <div key={test._id}>{test.title} on {new Date(test.date).toLocaleDateString()}</div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingTestsCalendar;
