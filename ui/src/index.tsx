import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { DockerMuiThemeProvider } from '@docker/docker-mui-theme';
import { HashRouter } from 'react-router-dom';
import './styles.scss';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <DockerMuiThemeProvider>
      <CssBaseline />
      <HashRouter>
        <App />
      </HashRouter>
    </DockerMuiThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
