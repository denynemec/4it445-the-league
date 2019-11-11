import React, { useCallback, useRef } from 'react';
import { Formik, Form } from 'formik';
import { useTranslation } from 'react-i18next';

import { Heading, Layout, Button, LoadingSpinner } from '../../atoms';
import { Field, SelectField } from '../../organisms';
import { LoggedInPageLayout } from '../../templates';
import {
  useRequest,
  translatedValidations,
  useFetchRequest,
  useApi,
} from '../../utils';
import ENDPOINTS from '../../endpoints';

export const AdministrationPage = () => {
  const { t } = useTranslation();

  const eventState = useFetchRequest(ENDPOINTS.enumEvents());

  const administrationState = useRequest();
  const api = useApi();
  const eventPlayersInputRef = useRef(null);

  const onSubmitMemoized = useCallback((data, { resetForm }) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => formData.append(key, value));

    api.post('/abc', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    resetForm();
    if (eventPlayersInputRef.current) {
      eventPlayersInputRef.current.value = '';
    }
  }, []);

  const { object, selectRequired, fileRequired } = translatedValidations(t);

  const schema = object({ events: selectRequired, eventPlayers: fileRequired });

  return (
    <LoggedInPageLayout
      errorList={[
        { id: 1, error: eventState.error },
        { id: 2, error: administrationState.error },
      ]}
    >
      {eventState.isLoading && <LoadingSpinner />}

      {eventState.data && (
        <>
          <Heading className="flex justify-center pb2">
            {t('Page.Administration.Heading')}
          </Heading>

          <Formik
            initialValues={{
              event: -1,
              eventPlayers: '',
            }}
            validationSchema={schema}
            onSubmit={onSubmitMemoized}
          >
            {({ setFieldValue }) => (
              <Form>
                <SelectField
                  name="event"
                  data={eventState.data}
                  label={t('Page.Administration.EventLabel')}
                />

                <Field
                  id="eventPlayers"
                  type="file"
                  name="eventPlayers"
                  label={t('Page.Administration.EventPlayersLabel')}
                  accept=".csv"
                  onChange={event => {
                    const [file] = event.currentTarget.files;
                    setFieldValue('eventPlayers', file);
                  }}
                  inputRef={eventPlayersInputRef}
                  value={undefined}
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
