import React from 'react';
import ReactDOM from 'react-dom';
import 'tachyons';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import './i18n';
import './index.css';
import { App } from './App';

ReactDOM.render(<App />, document.getElementById('root'));
