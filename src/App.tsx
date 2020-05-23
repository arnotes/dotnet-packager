import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import { settingsAction } from './redux/reducers/settings';
import { fileSvc } from './services/fileService';

function App() {
  const dispatch = useDispatch();
  
  useEffect(()=>{
    const settings = fileSvc.getSettings();
    dispatch(settingsAction(settings));
  },[dispatch]);

  return (    
    <div className="App">
      <header className="App-header">
        <pre>

        </pre>
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

        }}>asdf</button>
      </header>
    </div>
  );
}

export default App;
