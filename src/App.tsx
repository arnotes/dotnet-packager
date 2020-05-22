import React from 'react';
import logo from './logo.svg';
import './App.css';
import { fileSvc } from './services/fileService';
import { shellSvc } from './services/shellService';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={e => {
          fileSvc.getSettings();
          shellSvc.dotnetVersion();
        }}>asdf</button>
      </header>
    </div>
  );
}

export default App;
