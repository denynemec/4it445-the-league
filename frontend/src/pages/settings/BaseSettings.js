import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';
import { useAlert } from 'react-alert';

import ENDPOINTS from '../../endpoints';
import { Heading, Layout, LoadingSpinner } from '../../atoms';
import { Field } from '../../organisms';
import {
  useRequest,
  useAuth,
  useFetchRequest,
  translatedValidations,
} from '../../utils';

import { Button } from 'reactstrap';

export const BaseSettings = () => {
  const { t } = useTranslation();
  const { user, signin, ...restAuth } = useAuth();
  const alert = useAlert();

  const settingsState = useFetchRequest(ENDPOINTS.getSettings());
  const updateBaseSettingsState = useRequest();

  const onSubmitMemoized = useCallback(
    ({ nickname, firstName, lastName }) => {
      updateBaseSettingsState.request(ENDPOINTS.updateSettings(), {
        method: 'PUT',
        onSuccess: ({ data: { nickname } }) => {
          alert.success('Success');
          signin({ ...restAuth, user: { ...user, nickname } });
        },
        data: { nickname, firstName, lastName },
      });
    },
    [updateBaseSettingsState, signin, restAuth, user, alert],
  );

  const { object, requiredString } = translatedValidations(t);

  const schema = object({
    nickname: requiredString,
    firstName: requiredString,
    lastName: requiredString,
  });

  return (
    <>
      {settingsState.data && (
        <Formik
          initialValues={{
            nickname: settingsState.data.nickname,
            firstName: settingsState.data.firstName,
            lastName: settingsState.data.lastName,
          }}
          validationSchema={schema}
          onSubmit={onSubmitMemoized}
        >
          <Form>
            <Layout pa2>
              <Heading size="lg">
                {t('Page.Settings.BaseSettings.FormHeading')}
              </Heading>
            </Layout>

            <Field
              type="text"
              name="firstName"
              label={t('Page.Settings.BaseSettings.FirstNameLabel')}
              placeholder={t('Page.Settings.BaseSettings.FirstNamePlaceholder')}
            />

            <Field
              type="text"
              name="lastName"
              label={t('Page.Settings.BaseSettings.LastNameLabel')}
              placeholder={t('Page.Settings.BaseSettings.LastNamePlaceholder')}
            />

            <Field
              type="text"
              name="nickname"
              label={t('Page.Settings.BaseSettings.NicknameLabel')}
              placeholder={t('Page.Settings.BaseSettings.NicknamePlaceholder')}
            />

            <Layout flex justify-center>
              <Button
                color="primary"
                disabled={updateBaseSettingsState.isLoading}
              >
                {t('Page.Settings.BaseSettings.SubmitSettingsButton')}
              </Button>
            </Layout>
          </Form>
        </Formik>
      )}

      {settingsState.isLoading && <LoadingSpinner />}
    </>
  );
};
