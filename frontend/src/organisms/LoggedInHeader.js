import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import { Button, Layout, Link } from '../atoms';
import {
  HeaderBase,
  navLinkStyle,
  navButtonStyle,
} from '../molecules/HeaderBase';
import { useAuth, hasPrivilege } from '../utils';
import PATHNAMES from '../pathnames';

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
      <Layout flex-grow flex items-center>
        <span className="b pa3">{user && user.nickname}</span>

        {hasAdministrationPagePrivilege && (
          <Link
            to={PATHNAMES.administration()}
            className={classNames(navLinkStyle, 'pa3')}
          >
            {t('Organisms.LoggedInHeader.AdministrationLink')}
          </Link>
        )}

        <Link to={PATHNAMES.home()} className={classNames(navLinkStyle, 'pa3')}>
          {t('Organisms.LoggedInHeader.HomeLink')}
        </Link>

        <Link
          to={PATHNAMES.settings()}
          className={classNames(navLinkStyle, 'pa3')}
        >
          {t('Organisms.LoggedInHeader.SettingsLink')}
        </Link>

        <Button
          className={classNames(navButtonStyle, 'pointer')}
          onClick={logoutCallback}
          unstyled
        >
          <Layout flex flex-row>
            {t('Organisms.LoggedInHeader.LogoutLink')}
            <Layout pl2>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </Layout>
          </Layout>
        </Button>
      </Layout>
    </HeaderBase>
  );
};

export const LoggedInHeader = withRouter(LoggedInHeaderBase);
