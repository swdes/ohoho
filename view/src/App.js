import React, { useState, useReducer, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import Home from './pages/home';

import {
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
  createTheme,
  adaptV4Theme,
} from '@mui/material/styles';

const theme = createTheme(adaptV4Theme({
  palette: {
    primary: {
      light: '#33c9dc',
      main: '#FF5722',
      dark: '#d50000',
      contrastText: '#fff'
    },
    background: {
      light: '#ff572217'
    }
  }
}));

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={theme}>
        <div>
          <Router>
            <Routes>
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/signup" element={<Signup />} />
              <Route exact path="/" element={<Home />} />
            </Routes>
          </Router>
        </div>
      </MuiThemeProvider>
    </StyledEngineProvider>
  );
}
export default App;