import React from 'react';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import PATHNAMES from '../../pathnames';
import { Heading, Button, Form, Layout, Link } from '../../atoms';
import { NotLoggedInPageLayout } from '../../templates';
import { TextInputWithLabel } from '../../molecules';
import { useRegistrationState } from './hooks';

const RegistrationPageBase = ({ history }) => {
  const { t } = useTranslation();
  const {
    email,
    setEmail,
    password,
    passwordConfirmation,
    setPassword,
    setPasswordConfirmation,
    RegistrationState,
    submitRegistrationForm,
  } = useRegistrationState(history);

  return (
    <NotLoggedInPageLayout
      errorList={[{ id: 1, error: RegistrationState.error }]}
    >
      <Layout flex self-center flex-column w-75>
        <Layout flex justify-center pb2>
          <Heading>{t('Page.Registration.FormHeading')}</Heading>
        </Layout>

        <Form onSubmit={submitRegistrationForm}>
          <TextInputWithLabel
            name="email"
            label={t('Page.Registration.EmailLabel')}
            placeholder={t('Page.Registration.EmailPlaceholder')}
            value={email.value}
            error={email.error}
            onChange={setEmail}
          />

          <TextInputWithLabel
            type="password"
            name="password"
            label={t('Page.Registration.PasswordLabel')}
            placeholder={t('Page.Registration.PasswordPlaceholder')}
            value={password.value}
            error={password.error}
            onChange={setPassword}
          />

          <TextInputWithLabel
            type="password"
            name="passwordConfirmation"
            label={t('Page.Registration.PasswordConfirmationLabel')}
            placeholder={t('Page.Registration.PasswordConfirmationPlaceholder')}
            value={passwordConfirmation.value}
            error={passwordConfirmation.error}
            onChange={setPasswordConfirmation}
          />

          <Layout flex justify-end ph2 pb2>
            <Link to={PATHNAMES.login()}>
              {t('Page.Registration.AlreadyRegistred')}
            </Link>
          </Layout>

          <Layout flex justify-center>
            <Button submit primary disabled={RegistrationState.isLoading}>
              {t('Page.Registration.SubmitRegistrationButton')}
            </Button>
          </Layout>
        </Form>
      </Layout>
    </NotLoggedInPageLayout>
  );
};

export const RegistrationPage = withRouter(RegistrationPageBase);
