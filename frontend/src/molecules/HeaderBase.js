import React from 'react';
import classNames from 'classnames';

import { Layout, Link } from '../atoms';

const navLinkTextStyle = 'f6 dib white';

export const navLinkStyle = classNames(navLinkTextStyle, 'dim');
export const navButtonStyle = classNames(
  navLinkTextStyle,
  'bg-transparent bg-animate hover-bg-white hover-black pv2 ph3 mh3 br-pill ba b--white-20',
);

export const HeaderBase = ({ homeLinkTo, children }) => {
  return (
    <nav className="flex justify-between bb b--white-10 bg-dark-green white h3">
      <Link
        to={homeLinkTo}
        noUnderline
        className="b white flex items-center pv2 ph3"
      >
        The League
      </Link>

      <Layout flex-grow flex items-center>
        {children}
      </Layout>
    </nav>
  );
};
