import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import PATHNAMES from './pathnames';
import {
  HomePage,
  LoginPage,
  NotFoundPage,
  RegistrationPage,
  ResetPassword,
} from './pages';
import { useAuth } from './utils';

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

      {/* Login required routes */}
      <PrivateRoute path={PATHNAMES.home()} exact component={HomePage} />

      <Route path="*" component={NotFoundPage} />
    </Switch>
  );
}

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { token } = useAuth();

  return (
    <Route
      {...rest}
      render={props =>
        token ? <Component {...props} /> : <Redirect to={PATHNAMES.login()} />
      }
    />
  );
};
