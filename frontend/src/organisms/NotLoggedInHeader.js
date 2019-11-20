import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, NavItem } from 'reactstrap';
import { HeaderBase } from '../molecules/HeaderBase';
import PATHNAMES from '../pathnames';

export const NotLoggedInHeader = () => {
  const { t } = useTranslation();

  return (
    <HeaderBase homeLinkTo={PATHNAMES.login()}>
      <NavItem className="m-1">
        <NavLink href={PATHNAMES.login()}>
          {t('Organisms.NotLoggedInHeader.LoginLink')}
        </NavLink>
      </NavItem>

      <NavItem className="m-1">
        <NavLink href={PATHNAMES.registration()}>
          {t('Organisms.NotLoggedInHeader.RegisterLink')}
        </NavLink>
      </NavItem>
    </HeaderBase>
  );
};
