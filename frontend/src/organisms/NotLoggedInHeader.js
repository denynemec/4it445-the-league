import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { Layout, Link } from '../atoms';
import {
  HeaderBase,
  navLinkStyle,
  navButtonStyle,
} from '../molecules/HeaderBase';
import PATHNAMES from '../pathnames';

export const NotLoggedInHeader = () => {
  const { t } = useTranslation();

  return (
    <HeaderBase homeLinkTo={PATHNAMES.login()}>
      <Layout flex-grow flex items-center>
        <Link
          to={PATHNAMES.login()}
          className={classNames(navLinkStyle, 'pa3')}
        >
          {t('Organisms.NotLoggedInHeader.LoginLink')}
        </Link>

        <Link
          to={PATHNAMES.registration()}
          noUnderline
          className={navButtonStyle}
        >
          {t('Organisms.NotLoggedInHeader.RegisterLink')}
        </Link>
      </Layout>
    </HeaderBase>
  );
};
