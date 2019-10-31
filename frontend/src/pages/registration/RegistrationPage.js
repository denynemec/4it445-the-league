import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik } from 'formik';
import * as yup from 'yup';

import PATHNAMES from '../../pathnames';
import ENDPOINTS from '../../endpoints';
import { Heading, Button, Layout, Link, InfoBox } from '../../atoms';
import { NotLoggedInPageLayout } from '../../templates';
import { useRequest } from '../../utils';
import { Field } from '../../organisms';

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
  passwordConfirmation: yup
    .string()
    .required()
    .oneOf([yup.ref('password')], 'Both passwords must match')
    .label('Password Confirmation'),
});

export const RegistrationPage = () => {
  const { t } = useTranslation();

  const registrationState = useRequest();

  const [emailSentState, setEmailSentState] = useState('');

  const onSuccess = useCallback(
    ({ data: { email } }) => {
      setEmailSentState(t('Page.Registration.EmailSent', { email }));
    },
    [setEmailSentState, t],
  );

  useEffect(() => {
    if (registrationState.isLoading) {
      setEmailSentState('');
    }
  }, [registrationState.isLoading]);

  const onSubmitMemoized = useCallback(
    ({ email, password }) => {
      registrationState.request(ENDPOINTS.registration(), {
        method: 'POST',
        onSuccess,
        data: { email, password },
      });
    },
    [registrationState, onSuccess],
  );

  return (
    <NotLoggedInPageLayout
      errorList={[{ id: 1, error: registrationState.error }]}
    >
      <Heading className="flex justify-center pb2">
        {t('Page.Registration.FormHeading')}
      </Heading>

      <Formik
        initialValues={{ email: '', password: '', passwordConfirmation: '' }}
        validationSchema={schema}
        onSubmit={onSubmitMemoized}
      >
        <Form>
          <Field
            type="text"
            name="email"
            label={t('Page.Registration.EmailLabel')}
            placeholder={t('Page.Registration.EmailPlaceholder')}
          />

          <Field
            type="password"
            name="password"
            label={t('Page.Registration.PasswordLabel')}
            placeholder={t('Page.Registration.PasswordPlaceholder')}
          />

          <Field
            type="password"
            name="passwordConfirmation"
            label={t('Page.Registration.PasswordConfirmationLabel')}
            placeholder={t('Page.Registration.PasswordConfirmationPlaceholder')}
          />

          <Layout flex justify-end ph2 pb2>
            <Link to={PATHNAMES.login()}>
              {t('Page.Registration.AlreadyRegistred')}
            </Link>
          </Layout>

          <Layout flex justify-center>
            <Button submit primary disabled={registrationState.isLoading}>
              {t('Page.Registration.SubmitRegistrationButton')}
            </Button>
          </Layout>
        </Form>
      </Formik>

      {emailSentState && (
        <InfoBox className="mt4" infoList={[{ id: 1, info: emailSentState }]} />
      )}
    </NotLoggedInPageLayout>
  );
};
