import React from 'react';
import { Route, Switch } from 'react-router-dom';

import PATHNAMES from './pathnames';
import {
  HomePage,
  LoginPage,
  NotFoundPage,
  RegistrationPage,
  ResetPassword,
} from './pages';

export function Routes() {
  return (
    <Switch>
      <Route path={PATHNAMES.empty()} exact component={LoginPage} />
      <Route path={PATHNAMES.login()} exact component={LoginPage} />
      <Route path={PATHNAMES.resetPassword()} exact component={ResetPassword} />
      <Route
        path={PATHNAMES.registration()}
        exact
        component={RegistrationPage}
      />
      <Route path={PATHNAMES.home()} exact component={HomePage} />

      <Route path="*" component={NotFoundPage} />
    </Switch>
  );
}
