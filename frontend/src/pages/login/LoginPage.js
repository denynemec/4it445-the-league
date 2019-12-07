import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';
import { Button } from 'reactstrap';

import ENDPOINTS from '../../endpoints';
import PATHNAMES from '../../pathnames';
import { Heading, Layout, Link } from '../../atoms';
import { NotLoggedInPageLayout } from '../../templates';
import { Field } from '../../organisms';
import { useAuth, useRequest, translatedValidations } from '../../utils';

export const LoginPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { signin } = useAuth();
  const loginState = useRequest();

  const onSuccess = useCallback(
    ({ data: { user, token, privileges } }) => {
      signin({ user, token, privileges });
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

  const { object, requiredString, requiredEmail } = translatedValidations(t);

  const schema = object({
    email: requiredEmail,
    password: requiredString,
  });

  return (
    <NotLoggedInPageLayout>
      <Heading className="flex justify-center pb2">
        {t('Page.Login.FormHeading')}
      </Heading>

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
            <Button
              type="submit"
              color="primary"
              disabled={loginState.isLoading}
            >
              {t('Page.Login.SubmitLoginButton')}
            </Button>
          </Layout>
        </Form>
      </Formik>
    </NotLoggedInPageLayout>
  );
};
