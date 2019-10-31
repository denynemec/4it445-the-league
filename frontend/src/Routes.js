import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import PATHNAMES from './pathnames';
import {
  HomePage,
  LoginPage,
  NotFoundPage,
  RegistrationPage,
  ResetPassword,
  GroupDetail,
  ActivateUserPage,
  SettingsPage,
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
      <Route path={PATHNAMES.groupDetail()} exact component={GroupDetail} />
      <Route
        path={PATHNAMES.activateUser()}
        exact
        component={ActivateUserPage}
      />

      {/* Login required routes */}
      <PrivateRoute path={PATHNAMES.home()} exact component={HomePage} />
      <PrivateRoute
        path={PATHNAMES.settings()}
        exact
        component={SettingsPage}
      />

      {/* Not found route */}
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
