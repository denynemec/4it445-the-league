import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';

import { HeaderBase } from '../molecules/HeaderBase';
import { useAuth, hasPrivilege } from '../utils';
import PATHNAMES from '../pathnames';
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  NavLink,
  NavItem,
  Button,
} from 'reactstrap';
const LoggedInHeaderBase = ({ history }) => {
  const { user, signout, privileges } = useAuth();
  const { t } = useTranslation();

  const logoutCallback = useCallback(() => {
    signout();
    history.push(PATHNAMES.login());
  }, [history, signout]);

  const hasAdministrationPagePrivilege = hasPrivilege(
    privileges,
    'AdministrationPage',
  );

  return (
    <HeaderBase homeLinkTo={PATHNAMES.home()}>
      <NavItem className="m-1">
        <NavLink href={PATHNAMES.home()} className="text-white">
          {t('Organisms.LoggedInHeader.HomeLink')}
        </NavLink>
      </NavItem>

      <UncontrolledDropdown nav inNavbar className="m-1">
        <DropdownToggle nav caret className="text-white">
          <FontAwesomeIcon className="mr-1" icon={faUser} />
          {user && user.nickname}
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem>
            <NavLink href={PATHNAMES.settings()}>
              {t('Organisms.LoggedInHeader.SettingsLink')}
            </NavLink>
          </DropdownItem>
          <DropdownItem divider />
          {hasAdministrationPagePrivilege && (
            <DropdownItem>
              <NavLink href={PATHNAMES.administration()}>
                {t('Organisms.LoggedInHeader.AdministrationLink')}
              </NavLink>
            </DropdownItem>
          )}
        </DropdownMenu>
      </UncontrolledDropdown>
      <NavItem>
        <Button onClick={logoutCallback} color="secondary" className="m-1">
          {t('Organisms.LoggedInHeader.LogoutLink')}

          <FontAwesomeIcon className="ml-2" icon={faSignOutAlt} />
        </Button>
      </NavItem>
    </HeaderBase>
  );
};

export const LoggedInHeader = withRouter(LoggedInHeaderBase);
