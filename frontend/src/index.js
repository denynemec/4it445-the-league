import React from 'react';
import ReactDOM from 'react-dom';
import 'tachyons';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

import './i18n';
import './index.css';
import { App } from './App';

const alertOptions = {
  position: positions.TOP_RIGHT,
  timeout: 5000,
  offset: '50px',
  transition: transitions.SCALE,
};

const Root = () => (
  <AlertProvider template={AlertTemplate} {...alertOptions}>
    <App />
  </AlertProvider>
);

ReactDOM.render(<Root />, document.getElementById('root'));
