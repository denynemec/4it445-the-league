import React from 'react';
import { useTranslation } from 'react-i18next';

import { NotLoggedInPageLayout } from '../../templates';
import { Heading } from '../../atoms';

export const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <NotLoggedInPageLayout>
      <Heading>{t('Page.NotFound.Heading')}</Heading>
    </NotLoggedInPageLayout>
  );
};
