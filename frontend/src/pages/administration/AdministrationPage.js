import React, { useCallback } from 'react';
import { Formik, Form } from 'formik';
import { useTranslation } from 'react-i18next';

import { Heading, Layout, Button, LoadingSpinner } from '../../atoms';
import { Field, SelectField } from '../../organisms';
import { LoggedInPageLayout } from '../../templates';
import {
  useRequest,
  translatedValidations,
  useFetchRequest,
} from '../../utils';
import ENDPOINTS from '../../endpoints';

export const AdministrationPage = () => {
  const { t } = useTranslation();

  const eventsState = useFetchRequest(ENDPOINTS.enumEvents());

  const administrationState = useRequest();

  const onSubmitMemoized = useCallback((data, { resetForm }) => {
    console.log(data);

    resetForm();
  }, []);

  const { object, selectRequired, fileRequired } = translatedValidations(t);

  const schema = object({ events: selectRequired, eventPlayers: fileRequired });

  return (
    <LoggedInPageLayout
      errorList={[
        { id: 1, error: eventsState.error },
        { id: 2, error: administrationState.error },
      ]}
    >
      {eventsState.isLoading && <LoadingSpinner />}

      {eventsState.data && (
        <>
          <Heading className="flex justify-center pb2">
            {t('Page.Administration.Heading')}
          </Heading>

          <Formik
            initialValues={{ events: -1, eventPlayers: '' }}
            validationSchema={schema}
            onSubmit={onSubmitMemoized}
          >
            {({ setFieldValue }) => (
              <Form>
                <SelectField
                  name="events"
                  data={eventsState.data}
                  label={t('Page.Administration.EventsLabel')}
                />

                <Field
                  id="eventPlayers"
                  type="file"
                  name="eventPlayers"
                  label={t('Page.Administration.EventPlayersLabel')}
                  accept=".csv"
                  onChange={event => {
                    console.log(event.currentTarget);
                    setFieldValue('eventPlayers', event.currentTarget.files[0]);
                  }}
                />

                <Layout flex justify-center>
                  <Button
                    submit
                    primary
                    disabled={administrationState.isLoading}
                  >
                    {t('Page.Administration.UploadEventPlayers')}
                  </Button>
                </Layout>
              </Form>
            )}
          </Formik>
        </>
      )}
    </LoggedInPageLayout>
  );
};
