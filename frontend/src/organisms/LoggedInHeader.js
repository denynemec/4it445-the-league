import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';

import { Button, Layout, Link } from '../atoms';
import {
  HeaderBase,
  navLinkStyle,
  navButtonStyle,
} from '../molecules/HeaderBase';
import { useAuth } from '../utils/auth';
import PATHNAMES from '../pathnames';

const LoggedInHeaderBase = ({ history }) => {
  const { user, signout } = useAuth();
  const { t } = useTranslation();

  const logoutCallback = useCallback(() => {
    signout();
    history.push(PATHNAMES.login());
  }, [history, signout]);

  return (
    <HeaderBase homeLinkTo={PATHNAMES.home()}>
      <Layout flex-grow flex items-center>
        <span className="b">{user && user.username}</span>

        <Link to={PATHNAMES.home()} className={classNames(navLinkStyle, 'pa3')}>
          {t('Organisms.LoggedInHeader.HomeLink')}
        </Link>

        <Button
          className={classNames(navButtonStyle, 'pointer')}
          onClick={logoutCallback}
          unstyled
        >
          {t('Organisms.LoggedInHeader.LogoutLink')}
        </Button>
      </Layout>
    </HeaderBase>
  );
};

export const LoggedInHeader = withRouter(LoggedInHeaderBase);
