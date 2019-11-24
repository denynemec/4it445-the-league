import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik } from 'formik';
import { useParams } from 'react-router-dom';

import PATHNAMES from '../../pathnames';
import ENDPOINTS from '../../endpoints';
import { Heading, Layout, Link, InfoBox } from '../../atoms';
import { NotLoggedInPageLayout } from '../../templates';
import { useRequest, translatedValidations } from '../../utils';
import { Field } from '../../organisms';
import { Button, Col } from 'reactstrap';

export const RegistrationPage = () => {
  const { t } = useTranslation();
  const { email } = useParams();
  const registrationState = useRequest();

  const [emailSentState, setEmailSentState] = useState('');

  useEffect(() => {
    if (registrationState.isLoading) {
      setEmailSentState('');
    }
  }, [registrationState.isLoading]);

  const onSubmitMemoized = useCallback(
    ({ email, password }, { resetForm }) => {
      registrationState.request(ENDPOINTS.registration(), {
        method: 'POST',
        onSuccess: ({ data: { email } }) => {
          resetForm();
          setEmailSentState(t('Page.Registration.EmailSent', { email }));
        },
        data: { email, password },
      });
    },
    [registrationState, t],
  );

  const {
    object,
    requiredString,
    requiredEmail,
    passwordsDontMatch,
  } = translatedValidations(t);

  const schema = object({
    email: requiredEmail,
    password: requiredString,
    passwordConfirmation: passwordsDontMatch('password'),
  });

  const prefilledEmail = typeof email === 'undefined' ? '' : email;

  return (
    <NotLoggedInPageLayout
      errorList={[{ id: 1, error: registrationState.error }]}
    >
      <Col
        sm={{ size: 6, offset: 3 }}
        style={{ 'background-color': '#f8f9fa' }}
        className="p-5"
      >
        <Heading className="flex justify-center pb2">
          {t('Page.Registration.FormHeading')}
        </Heading>

        <Formik
          initialValues={{
            email: prefilledEmail,
            password: '',
            passwordConfirmation: '',
          }}
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
              placeholder={t(
                'Page.Registration.PasswordConfirmationPlaceholder',
              )}
            />

            <Layout flex justify-end ph2 pb2>
              <Link to={PATHNAMES.login()}>
                {t('Page.Registration.AlreadyRegistred')}
              </Link>
            </Layout>

            <Layout flex justify-center>
              <Button
                submit
                color="primary"
                disabled={registrationState.isLoading}
              >
                {t('Page.Registration.SubmitRegistrationButton')}
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
