import React from 'react';
import Map from '../map/Map';

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
        <Map></Map>
      </ThemeProvider>
    </MuiThemeProvider>
  );
}

export default App;
