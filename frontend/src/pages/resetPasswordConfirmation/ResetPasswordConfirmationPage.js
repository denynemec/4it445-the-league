import React, { useCallback } from 'react';
import * as yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';

import ENDPOINTS from '../../endpoints';
import PATHNAMES from '../../pathnames';
import { Heading, Button, Layout } from '../../atoms';
import { Field } from '../../organisms';
import { NotLoggedInPageLayout } from '../../templates';
import { useRequest } from '../../utils';

export const ResetPasswordConfirmationPage = () => {
  const { t } = useTranslation();
  const { userHash } = useParams();
  const history = useHistory();

  const resetPasswordConfirmationState = useRequest();

  const onSubmitMemoized = useCallback(
    ({ password, passwordConfirmation }) => {
      resetPasswordConfirmationState.request(
        ENDPOINTS.resetPasswordConfirmation(),
        {
          method: 'PUT',
          onSuccess: history.push(PATHNAMES.login()),
          data: { password, passwordConfirmation, userHash },
        },
      );
    },
    [resetPasswordConfirmationState, history, userHash],
  );

  const schema = yup.object().shape({
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

  return (
    <NotLoggedInPageLayout
      errorList={[{ id: 1, error: resetPasswordConfirmationState.error }]}
    >
      <Heading className="flex justify-center pb2">
        {t('Page.ResetPasswordConfirmation.FormHeading')}
      </Heading>

      <Formik
        initialValues={{ password: '', passwordConfirmation: '' }}
        validationSchema={schema}
        onSubmit={onSubmitMemoized}
      >
        <Form>
          <Field
            type="password"
            name="password"
            label={t('Page.ResetPasswordConfirmation.PasswordLabel')}
            placeholder={t(
              'Page.ResetPasswordConfirmation.PasswordPlaceholder',
            )}
          />

          <Field
            type="password"
            name="passwordConfirmation"
            label={t(
              'Page.ResetPasswordConfirmation.PasswordConfirmationLabel',
            )}
            placeholder={t(
              'Page.ResetPasswordConfirmation.PasswordConfirmationPlaceholder',
            )}
          />

          <Layout flex justify-center>
            <Button
              submit
              primary
              disabled={resetPasswordConfirmationState.isLoading}
            >
              {t(
                'Page.ResetPasswordConfirmation.SubmitResetPasswordConfirmationButton',
              )}
            </Button>
          </Layout>
        </Form>
      </Formik>
    </NotLoggedInPageLayout>
  );
};
