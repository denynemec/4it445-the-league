import React, { useCallback } from 'react';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';

import ENDPOINTS from '../../endpoints';
import { ErrorBox, Heading, Button, Layout } from '../../atoms';
import { Field } from '../../organisms';
import { useRequest } from '../../utils';

const schema = yup.object().shape({
  oldPassword: yup
    .string()
    .required()
    .label('Old password'),
  newPassword: yup
    .string()
    .required()
    .label('New password'),
  newPasswordConfirmation: yup
    .string()
    .required()
    .oneOf([yup.ref('newPassword')], 'Both passwords must match')
    .label('New password confirmation'),
});

export const PasswordSettings = () => {
  const { t } = useTranslation();
  const updatePasswordSettingsState = useRequest();

  const onSubmitMemoized = useCallback(
    ({ oldPassword, newPassword }, { resetForm }) => {
      updatePasswordSettingsState.request(ENDPOINTS.updatePassword(), {
        method: 'PUT',
        onSuccess: resetForm,
        data: { oldPassword, newPassword },
      });
    },
    [updatePasswordSettingsState],
  );

  return (
    <>
      <ErrorBox
        className="mv2"
        errorList={[{ id: 1, error: updatePasswordSettingsState.error }]}
      />

      <Formik
        initialValues={{
          oldPassword: '',
          newPassword: '',
          newPasswordConfirmation: '',
        }}
        validationSchema={schema}
        onSubmit={onSubmitMemoized}
      >
        <Form>
          <Heading className="pa2" size="md">
            {t('Page.Settings.PasswordSettings.FormHeading')}
          </Heading>

          <Field
            type="password"
            name="oldPassword"
            label={t('Page.Settings.PasswordSettings.OldPasswordLabel')}
            placeholder={t(
              'Page.Settings.PasswordSettings.OldPasswordPlaceholder',
            )}
          />

          <Field
            type="password"
            name="newPassword"
            label={t('Page.Settings.PasswordSettings.NewPasswordLabel')}
            placeholder={t(
              'Page.Settings.PasswordSettings.NewPasswordPlaceholder',
            )}
          />

          <Field
            type="password"
            name="newPasswordConfirmation"
            label={t(
              'Page.Settings.PasswordSettings.NewPasswordConfirmationLabel',
            )}
            placeholder={t(
              'Page.Settings.PasswordSettings.NewPasswordConfirmationPlaceholder',
            )}
          />

          <Layout flex justify-center>
            <Button
              submit
              primary
              disabled={updatePasswordSettingsState.isLoading}
            >
              {t('Page.Settings.PasswordSettings.SubmitPasswordSettingsButton')}
            </Button>
          </Layout>
        </Form>
      </Formik>
    </>
  );
};
