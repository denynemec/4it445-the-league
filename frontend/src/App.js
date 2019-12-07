import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

import { LoadingSpinner, ScrollToTop } from './atoms';
import { ApiProvider } from './utils/api';
import { AuthProvider } from './utils/auth';
import { Routes } from './Routes';

export function App() {
  return (
    <AllProviders>
      <Routes />
    </AllProviders>
  );
}

const alertOptions = {
  position: positions.TOP_RIGHT,
  timeout: 5000,
  offset: '50px',
  transition: transitions.SCALE,
};

function AllProviders({ children }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AlertProvider template={AlertTemplate} {...alertOptions}>
        <AuthProvider>
          <ApiProvider>
            <BrowserRouter>
              <ScrollToTop />
              {children}
            </BrowserRouter>
          </ApiProvider>
        </AuthProvider>
      </AlertProvider>
    </Suspense>
  );
}
