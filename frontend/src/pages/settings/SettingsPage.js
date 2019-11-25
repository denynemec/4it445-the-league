import React from 'react';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line
import { Heading, Layout } from '../../atoms';
import { LoggedInPageLayout } from '../../templates';
import { BaseSettings } from './BaseSettings';
import { PasswordSettings } from './PasswordSettings';
import { Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog } from '@fortawesome/free-solid-svg-icons';

export const SettingsPage = () => {
  const { t } = useTranslation();

  return (
    <LoggedInPageLayout>
      <Heading className="flex justify-center pb2" size="xl">
        <FontAwesomeIcon className="text-primary mr-2" icon={faUserCog} />
        {t('Page.Settings.PageHeading')}
      </Heading>
      <Row>
        <Col xs={{ size: 6 }} className="border-right">
          <BaseSettings />
        </Col>

        <Col xs={{ size: 6 }}>
          <PasswordSettings />
        </Col>
      </Row>
    </LoggedInPageLayout>
  );
};
