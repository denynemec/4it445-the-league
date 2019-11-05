import React, { useEffect, useState, useCallback } from 'react';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';

import ENDPOINTS from '../../endpoints';
import { Heading, Button, Layout, InfoBox } from '../../atoms';
import { Field } from '../../organisms';
import { NotLoggedInPageLayout } from '../../templates';
import { useRequest } from '../../utils';

const schema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required()
    .label('Email'),
});

export const ResetPassword = () => {
  const { t } = useTranslation();
  const resetPasswordState = useRequest();
  const [emailSentState, setEmailSentState] = useState('');

  const onSuccess = useCallback(
    ({ data: { email } }) => {
      setEmailSentState(t('Page.ResetPassword.EmailSent', { email }));
    },
    [setEmailSentState, t],
  );

  useEffect(() => {
    if (resetPasswordState.isLoading) {
      setEmailSentState('');
    }
  }, [resetPasswordState.isLoading]);

  const onSubmitMemoized = useCallback(
    ({ email }) => {
      resetPasswordState.request(ENDPOINTS.resetPassword(), {
        method: 'POST',
        onSuccess,
        data: { email },
      });
    },
    [resetPasswordState, onSuccess],
  );

  return (
    <NotLoggedInPageLayout
      errorList={[{ id: 1, error: resetPasswordState.error }]}
    >
      <Heading className="flex justify-center pb2">
        {t('Page.ResetPassword.FormHeading')}
      </Heading>

      <Formik
        initialValues={{ email: '' }}
        validationSchema={schema}
        onSubmit={onSubmitMemoized}
      >
        <Form>
          <Field
            type="text"
            name="email"
            label={t('Page.ResetPassword.EmailLabel')}
            placeholder={t('Page.ResetPassword.EmailPlaceholder')}
          />

          <Layout flex justify-center>
            <Button submit primary disabled={resetPasswordState.isLoading}>
              {t('Page.ResetPassword.SubmitResetPasswordButton')}
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
