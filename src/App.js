import React from 'react';
import './App.css';
import Home from './Home.js';
import { Router } from 'react-router-dom/cjs/react-router-dom.min.js';

const App = () => {
  return (
    <Router baename="/currency-converter">
      <div className='container'>
        <nav className='navbar navbar-expand-lg navbar-light bg-light'>
          <h1>Currency Converter</h1>
        </nav>
        <Home />
        <footer className='text-lg-start bg-body-tertiary text-muted'>
          <a href='https://github.com/MisterAdili'>See me on GitHub</a>
        </footer>
      </div>
    </Router>
  );
}

export default App;
