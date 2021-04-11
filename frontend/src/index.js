import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { theme } from './styles/theme'
import { LayoutProvider } from './context/LayoutContext'

ReactDOM.render(
  <React.StrictMode>
    <LayoutProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </LayoutProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

