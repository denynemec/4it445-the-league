import React from 'react';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import PATHNAMES from '../../pathnames';
import { Heading, Button, Form, Layout, Link } from '../../atoms';
import { NotLoggedInPageLayout } from '../../templates';
import { TextInputWithLabel } from '../../molecules';
import { useLoginState } from './hooks';

const LoginPageBase = ({ history }) => {
  const { t } = useTranslation();
  const [
    username,
    setUsername,
    password,
    setPassword,
    loginState,
    submitLoginForm,
  ] = useLoginState(history);

  return (
    <NotLoggedInPageLayout>
      <Layout flex justify-center pb2>
        <Heading>{t('Page.Login.FormHeading')}</Heading>
      </Layout>

      <Form onSubmit={submitLoginForm}>
        <TextInputWithLabel
          name="username"
          label={t('Page.Login.UsernameLabel')}
          placeholder={t('Page.Login.UsernamePlaceholder')}
          value={username.value}
          error={username.error}
          onChange={setUsername}
        />

        <TextInputWithLabel
          type="password"
          name="password"
          label={t('Page.Login.PasswordLabel')}
          placeholder={t('Page.Login.PasswordPlaceholder')}
          value={password.value}
          error={password.error}
          onChange={setPassword}
        />

        <Layout flex justify-end ph2 pb2>
          <Link to={PATHNAMES.resetPassword()}>
            {t('Page.Login.DidYouForgetPasswordLink')}
          </Link>
        </Layout>

        <Layout flex justify-center>
          <Button submit primary disabled={loginState.isLoading}>
            {t('Page.Login.SubmitLoginButton')}
          </Button>
        </Layout>
      </Form>
    </NotLoggedInPageLayout>
  );
};

export const LoginPage = withRouter(LoginPageBase);
