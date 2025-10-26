import { useState } from 'react';
import reactLogo from './assets/react.svg';

import './App.css';
import GDGAttendance from './GDGAttendance';

function App() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <GDGAttendance />
    </div>
  );
}

export default App;
