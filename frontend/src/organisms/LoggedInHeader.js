import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';

import { Layout, Link } from '../atoms';
import {
  HeaderBase,
  navLinkStyle,
  navButtonStyle,
} from '../molecules/HeaderBase';
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
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <HeaderBase homeLinkTo={PATHNAMES.home()}>
      <Layout flex-grow flex items-center>
        <NavItem>
          <NavLink href={PATHNAMES.home()}>
            {t('Organisms.LoggedInHeader.HomeLink')}
          </NavLink>
        </NavItem>

        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret>
            <FontAwesomeIcon icon={faUser} />
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
          <Button onClick={logoutCallback} outline color="secondary">
            <Layout flex flex-row>
              {t('Organisms.LoggedInHeader.LogoutLink')}
              <Layout pl2>
                <FontAwesomeIcon icon={faSignOutAlt} />
              </Layout>
            </Layout>
          </Button>
        </NavItem>
      </Layout>
    </HeaderBase>
  );
};

export const LoggedInHeader = withRouter(LoggedInHeaderBase);
