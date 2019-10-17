import React, { useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

import { Button, Layout, Link } from '../atoms';
import { useAuth } from '../utils/auth';
import PATHNAMES from '../pathnames';

const navLinkTextStyle = 'f6 dib white';
const navLinkStyle = classNames(navLinkTextStyle, 'dim');
const navButtonStyle = classNames(
  navLinkTextStyle,
  'bg-transparent bg-animate hover-bg-white hover-black pv2 ph3 mh3 br-pill ba b--white-20',
);

const TopNavigationBase = ({ history }) => {
  const { user, signout } = useAuth();

  const logoutCallback = useCallback(() => {
    signout();
    history.push(PATHNAMES.login());
    window.location.reload();
  }, [history, signout]);

  return (
    <nav className="flex justify-between bb b--white-10 bg-dark-green white h3">
      <Link
        to={user ? PATHNAMES.home() : PATHNAMES.login()}
        noUnderline
        className="b white flex items-center pv2 ph3"
      >
        The League
      </Link>

      <Layout flex-grow flex items-center>
        {user ? (
          <>
            <span className="b">{user.username}</span>

            <Link
              to={PATHNAMES.home()}
              className={classNames(navLinkStyle, 'pa3')}
            >
              Home
            </Link>

            <Button
              className={navButtonStyle}
              onClick={logoutCallback}
              unstyled
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link
              to={PATHNAMES.login()}
              className={classNames(navLinkStyle, 'pa3')}
            >
              Sign In
            </Link>

            <Link
              to={PATHNAMES.registration()}
              noUnderline
              className={navButtonStyle}
            >
              Sign Up
            </Link>
          </>
        )}
      </Layout>
    </nav>
  );
};

export const TopNavigation = withRouter(TopNavigationBase);
