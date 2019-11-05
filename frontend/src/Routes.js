import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import PATHNAMES from './pathnames';
import {
  HomePage,
  LoginPage,
  NotFoundPage,
  RegistrationPage,
  ResetPassword,
  EventDetail,
  LobbyDetail,
  ActivateUserPage,
  SettingsPage,
  JoinToLobbyPage,
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
      <Route
        path={PATHNAMES.activateUser()}
        exact
        component={ActivateUserPage}
      />
      <Route path={PATHNAMES.joinToLobby()} exact component={JoinToLobbyPage} />

      {/* Login required routes */}
      <PrivateRoute path={PATHNAMES.home()} exact component={HomePage} />
      <PrivateRoute
        path={PATHNAMES.settings()}
        exact
        component={SettingsPage}
      />
      <PrivateRoute
        path={PATHNAMES.eventDetail()}
        exact
        component={EventDetail}
      />
      <PrivateRoute
        path={PATHNAMES.lobbyDetail()}
        exact
        component={LobbyDetail}
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
