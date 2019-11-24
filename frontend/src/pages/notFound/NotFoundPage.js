import React from 'react';
import { useTranslation } from 'react-i18next';

import { NotLoggedInPageLayout } from '../../templates';
import { Heading } from '../../atoms';
import { Col } from 'reactstrap';
export const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <NotLoggedInPageLayout>
      <Col
        sm={{ size: 6, offset: 3 }}
        style={{ 'background-color': '#f8f9fa' }}
        className="p-5"
      >
        <Heading>{t('Page.NotFound.Heading')}</Heading>
      </Col>
    </NotLoggedInPageLayout>
  );
};
