import React, { useCallback } from 'react';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';

import ENDPOINTS from '../../endpoints';
import PATHNAMES from '../../pathnames';
import { Heading, Button, Layout, Link } from '../../atoms';
import { NotLoggedInPageLayout } from '../../templates';
import { Field } from '../../organisms';
import { useAuth, useRequest } from '../../utils';

export const LoginPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { signin } = useAuth();
  const loginState = useRequest();

  const onSuccess = useCallback(
    ({ data: { user, token } }) => {
      signin({ user, token });
      history.push(PATHNAMES.home());
    },
    [signin, history],
  );

  const onSubmitMemoized = useCallback(
    ({ email, password }) => {
      loginState.request(ENDPOINTS.login(), {
        method: 'POST',
        onSuccess,
        data: { email, password },
      });
    },
    [loginState, onSuccess],
  );

  const schema = yup.object().shape({
    email: yup
      .string()
      .email()
      .required()
      .label('Email'),
    password: yup
      .string()
      .required()
      .label('Password'),
  });

  return (
    <NotLoggedInPageLayout errorList={[{ id: 1, error: loginState.error }]}>
      <Layout flex self-center flex-column w-75>
        <Layout flex justify-center pb2>
          <Heading>{t('Page.Login.FormHeading')}</Heading>
        </Layout>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={schema}
          onSubmit={onSubmitMemoized}
        >
          <Form>
            <Field
              type="text"
              name="email"
              label={t('Page.Login.EmailLabel')}
              placeholder={t('Page.Login.EmailPlaceholder')}
            />

            <Field
              type="password"
              name="password"
              label={t('Page.Login.PasswordLabel')}
              placeholder={t('Page.Login.PasswordPlaceholder')}
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
        </Formik>
      </Layout>
    </NotLoggedInPageLayout>
  );
};
