import React from 'react';
import classNames from 'classnames';

import { Layout, Link } from '../atoms';
import {
  HeaderBase,
  navLinkStyle,
  navButtonStyle,
} from '../molecules/HeaderBase';
import PATHNAMES from '../pathnames';

export const NotLoggedInHeader = () => {
  return (
    <HeaderBase homeLinkTo={PATHNAMES.home()}>
      <Layout flex-grow flex items-center>
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
      </Layout>
    </HeaderBase>
  );
};
