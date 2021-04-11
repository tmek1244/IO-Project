import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { AuthProvider } from './context/AuthContext';
import { theme } from './styles/theme'
import { LayoutProvider } from './context/LayoutContext'

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <LayoutProvider>
        <AuthProvider>
          <CssBaseline />
          <App />
        </AuthProvider>
      </LayoutProvider>
    </ThemeProvider>
  </React.StrictMode >,
  document.getElementById('root')
);

