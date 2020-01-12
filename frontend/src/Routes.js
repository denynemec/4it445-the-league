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
  DraftDetail,
  ResetPasswordConfirmationPage,
  AdministrationPage,
  NominationDetailPage,
} from './pages';
import { useAuth, hasPrivilege } from './utils';

export function Routes() {
  return (
    <Switch>
      <Route path={PATHNAMES.empty()} exact component={LoginPage} />
      <Route path={PATHNAMES.login()} exact component={LoginPage} />
      <Route path={PATHNAMES.resetPassword()} exact component={ResetPassword} />
      {/* new email route for prefill email, when go from joinToLobby page and not already registered */}
      <Route
        path={PATHNAMES.registrationWithPrefilledEmail()}
        exact
        component={RegistrationPage}
      />
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
      <Route
        path={PATHNAMES.resetPasswordConfirmation()}
        exact
        component={ResetPasswordConfirmationPage}
      />

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
      <PrivateRoute
        path={PATHNAMES.draftDetail()}
        exact
        component={DraftDetail}
      />
      <PrivateRoute
        path={PATHNAMES.nominationDetail()}
        exact
        component={NominationDetailPage}
      />

      {/* Login and privilege required routes */}

      <PrivilegePrivateRoute
        path={PATHNAMES.administration()}
        exact
        component={AdministrationPage}
        privilege="AdministrationPage"
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

const PrivilegePrivateRoute = ({
  component: Component,
  privilege,
  ...rest
}) => {
  const { token, privileges } = useAuth();

  const routeHasPrivilege = hasPrivilege(privileges, privilege);

  return (
    <Route
      {...rest}
      render={props =>
        token && routeHasPrivilege ? (
          <Component privilege={privilege} {...props} />
        ) : (
          <Redirect to={PATHNAMES.login()} />
        )
      }
    />
  );
};
