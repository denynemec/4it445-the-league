import React from 'react';
import { useTranslation } from 'react-i18next';

import { Heading, Layout } from '../../atoms';
import { LoggedInPageLayout } from '../../templates';
import { BaseSettings } from './BaseSettings';
import { PasswordSettings } from './PasswordSettings';

export const SettingsPage = () => {
  const { t } = useTranslation();

  return (
    <LoggedInPageLayout>
      <Heading className="flex justify-center pb2">
        {t('Page.Settings.PageHeading')}
      </Heading>

      <BaseSettings />

      <Layout bb pv2 />

      <PasswordSettings />
    </LoggedInPageLayout>
  );
};
