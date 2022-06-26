import React from 'react';
import './assets/styles/App.scss';
import MainValidator from './validators/MainValidator';
import Sidebar from './components/sidebar/Sidebar';
import AppRouter from './components/AppRouter';

function App() {
  MainValidator();

  return (
    <>
      <AppRouter />
      <Sidebar />
    </>
  );
}

export default App;
