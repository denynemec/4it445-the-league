import React from 'react';

import { useTranslation } from 'react-i18next';

import { Heading } from '../../atoms';
import { LoggedInPageLayout } from '../../templates';

export const AdministrationPage = () => {
  const { t } = useTranslation();

  return (
    <LoggedInPageLayout errorList={[]}>
      <Heading className="flex justify-center pb2">
        {t('Page.Administration.Heading')}
      </Heading>
    </LoggedInPageLayout>
  );
};
