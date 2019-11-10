import React, { useCallback } from 'react';
import { Formik, Form } from 'formik';
import { useTranslation } from 'react-i18next';

import { Heading, Layout, Button } from '../../atoms';
import { Field } from '../../organisms';
import { LoggedInPageLayout } from '../../templates';
import { useRequest, translatedValidations } from '../../utils';

export const AdministrationPage = () => {
  const { t } = useTranslation();

  const administrationState = useRequest();

  const onSubmitMemoized = useCallback((data, { resetForm }) => {
    console.log(data);

    resetForm();
  }, []);

  const { object } = translatedValidations(t);

  const schema = object({});

  return (
    <LoggedInPageLayout
      errorList={[{ id: 1, error: administrationState.error }]}
    >
      <Heading className="flex justify-center pb2">
        {t('Page.Administration.Heading')}
      </Heading>

      <Formik
        initialValues={{ eventPlayers: null }}
        validationSchema={schema}
        onSubmit={onSubmitMemoized}
      >
        <Form>
          <Layout flex flex-row>
            <Field
              type="file"
              name="eventPlayers"
              label={t('Page.Administration.EventPlayersLabel')}
              placeholder={t('Page.Administration.EventPlayersPlaceholder')}
              accept=".csv"
            />
          </Layout>

          <Layout flex justify-center>
            <Button submit primary disabled={administrationState.isLoading}>
              {t('Page.Administration.SubmitAdministration')}
            </Button>
          </Layout>
        </Form>
      </Formik>
    </LoggedInPageLayout>
  );
};
