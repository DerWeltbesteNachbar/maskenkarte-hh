import React from 'react';
import Overview from '../overview/Overview';

import { ThemeProvider } from 'styled-components';
import {
  createMuiTheme,
  ThemeProvider as MuiThemeProvider
} from '@material-ui/core/styles';

const myTheme = createMuiTheme();

function App() {
  return (
    <MuiThemeProvider theme={myTheme}>
      <ThemeProvider theme={myTheme}>
        <Overview></Overview>
      </ThemeProvider>
    </MuiThemeProvider>
  );
}

export default App;
