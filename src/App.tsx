import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import { settingsAction } from './redux/reducers/settings';
import { fileSvc } from './services/fileService';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import ClippedDrawer from './components/ClippedDrawer';
import { BrowserRouter, Switch, Route} from "react-router-dom";
import ProjectList from './components/ProjectList';
import { CssBaseline } from '@material-ui/core';
import { Routes } from './models/routes';
import PackagerForm from './components/PackagerForm';
import SearchBar from './components/SearchBar';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#1b5e20'
    },
    secondary: {
      main: '#2979ff',
    },    
  },
});

function App() {
  const dispatch = useDispatch();
  
  useEffect(()=>{
    const settings = fileSvc.getSettings();
    dispatch(settingsAction(settings));
  },[dispatch]);

  return (
    <BrowserRouter>
      <CssBaseline />
      <ThemeProvider theme={darkTheme}>
        <ClippedDrawer>
          <Switch>
            <Route path={Routes.HOME}>
              <ProjectList>
                <SearchBar/>
                <PackagerForm/>
              </ProjectList>
            </Route>
          </Switch>
        </ClippedDrawer>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
