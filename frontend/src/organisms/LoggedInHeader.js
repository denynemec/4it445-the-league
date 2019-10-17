import React, { useCallback } from 'react';
import classNames from 'classnames';

import { Button, Layout, Link } from '../atoms';
import {
  HeaderBase,
  navLinkStyle,
  navButtonStyle,
} from '../molecules/HeaderBase';
import { useAuth } from '../utils/auth';
import PATHNAMES from '../pathnames';

export const LoggedInHeader = () => {
  const { user, signout } = useAuth();

  const logoutCallback = useCallback(() => {
    signout();
  }, [signout]);

  return (
    <HeaderBase homeLinkTo={PATHNAMES.home()}>
      <Layout flex-grow flex items-center>
        <span className="b">{user && user.username}</span>

        <Link to={PATHNAMES.home()} className={classNames(navLinkStyle, 'pa3')}>
          Home
        </Link>

        <Link
          to={PATHNAMES.login()}
          className={classNames(navLinkStyle, 'pa3')}
        >
          <Button className={navButtonStyle} onClick={logoutCallback} unstyled>
            Logout
          </Button>
        </Link>
      </Layout>
    </HeaderBase>
  );
};
