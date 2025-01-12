import React from 'react';
import './App.css';
import Home from './Home.js';

const App = () => {
  return (
    <div className='container'>
      <nav className='navbar navbar-expand-lg navbar-light bg-light'>
        <h1>Currency Converter</h1>
      </nav>
      <Home />
      <footer className='text-lg-start bg-body-tertiary text-muted'>
        <a href='https://github.com/MisterAdili'>See me on GitHub</a>
      </footer>
    </div>
  );
}

export default App;
