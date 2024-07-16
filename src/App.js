import React from 'react';
import { MyProvider } from './context/MyContext';
import OlympicSchedule from './components/OlympicSchedule';

function App() {
  return (
    <MyProvider>
      <OlympicSchedule />
    </MyProvider>
  );
}

export default App;