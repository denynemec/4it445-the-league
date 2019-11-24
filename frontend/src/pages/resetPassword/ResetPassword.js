import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';

import ENDPOINTS from '../../endpoints';
import { Heading, Layout, InfoBox } from '../../atoms';
import { Field } from '../../organisms';
import { NotLoggedInPageLayout } from '../../templates';
import { useRequest, translatedValidations } from '../../utils';
import { Button, Col } from 'reactstrap';

export const ResetPassword = () => {
  const { t } = useTranslation();
  const resetPasswordState = useRequest();
  const [emailSentState, setEmailSentState] = useState('');

  useEffect(() => {
    if (resetPasswordState.isLoading) {
      setEmailSentState('');
    }
  }, [resetPasswordState.isLoading]);

  const onSubmitMemoized = useCallback(
    ({ email }, { resetForm }) => {
      resetPasswordState.request(ENDPOINTS.resetPassword(), {
        method: 'POST',
        onSuccess: ({ data: { email } }) => {
          resetForm();
          setEmailSentState(t('Page.ResetPassword.EmailSent', { email }));
        },
        data: { email },
      });
    },
    [resetPasswordState, t],
  );

  const { object, requiredEmail } = translatedValidations(t);

  const schema = object({
    email: requiredEmail,
  });

  return (
    <NotLoggedInPageLayout
      errorList={[{ id: 1, error: resetPasswordState.error }]}
    >
      <Col
        sm={{ size: 6, offset: 3 }}
        style={{ 'background-color': '#f8f9fa' }}
        className="p-5"
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
              <Button
                submit
                color="primary"
                disabled={resetPasswordState.isLoading}
              >
                {t('Page.ResetPassword.SubmitResetPasswordButton')}
              </Button>
            </Layout>
          </Form>
        </Formik>
        {emailSentState && (
          <InfoBox
            className="mt4"
            infoList={[{ id: 1, info: emailSentState }]}
          />
        )}
      </Col>
    </NotLoggedInPageLayout>
  );
};
