import React, { useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';

import ENDPOINTS from '../../endpoints';
import PATHNAMES from '../../pathnames';
import { Heading, Button, Layout } from '../../atoms';
import { Field } from '../../organisms';
import { NotLoggedInPageLayout } from '../../templates';
import { useRequest, translatedValidations } from '../../utils';

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

  const { object, passwordsDontMatch, requiredString } = translatedValidations(
    t,
  );

  const schema = object({
    password: requiredString,
    passwordConfirmation: passwordsDontMatch('password'),
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
