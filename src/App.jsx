import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import GDGAttendance from './GDGAttendance';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-screen h-screen flex flex-col">
      <GDGAttendance />
    </div>
  );
}

export default App;
