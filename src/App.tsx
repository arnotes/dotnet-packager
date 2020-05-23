import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import { settingsAction } from './redux/reducers/settings';
import { fileSvc } from './services/fileService';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import ClippedDrawer from './components/ClippedDrawer';
import { BrowserRouter, Switch, Route} from "react-router-dom";
import ProjectList from './components/ProjectList';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
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
      <ThemeProvider theme={darkTheme}>
        <ClippedDrawer>
          <Switch>
            <Route path="/">
              <ProjectList/>
            </Route>
          </Switch>
        </ClippedDrawer>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
