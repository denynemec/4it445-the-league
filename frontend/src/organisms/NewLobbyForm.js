import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';

import ENDPOINTS from '../endpoints';
import PATHNAMES from '../pathnames';
import { Button, Layout, ErrorBox } from '../atoms';
import { Field } from '../organisms';
import { Modal } from '../molecules';
import { useRequest, translatedValidations } from '../utils';

const schema = ({ t, minEmails, maxEmail }) => {
  const { object, uniqueMinMaxEmails, requiredString } = translatedValidations(
    t,
  );

  return object({
    lobbyName: requiredString,
    emails: uniqueMinMaxEmails({ min: minEmails, max: minEmails }),
  });
};

export const NewLobbyForm = ({
  isOpen,
  onCloseClick,
  eventName,
  minEmails,
  maxEmails,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const newLobbyState = useRequest();

  const minMaxEmails = { min: minEmails, max: maxEmails };

  const onSubmitMemoized = useCallback(
    ({ lobbyName }) => {
      newLobbyState.request(ENDPOINTS.newLobby(), {
        method: 'POST',
        onSuccess: ({ data: { lobbyId } }) => {
          history.push(PATHNAMES.getLobbyDetail(lobbyId));
        },
        data: { lobbyName },
      });
    },
    [newLobbyState, history],
  );

  return (
    <Modal
      headerLabel={t('Organisms.NewLobbyForm.ModalHeaderLabel', { eventName })}
      isOpen={isOpen}
      withFooter={false}
      onCloseClick={onCloseClick}
      isDisabled={newLobbyState.isLoading}
    >
      <ErrorBox errorList={[{ id: 1, error: newLobbyState.error }]} />

      <Formik
        initialValues={{ lobbyName: '', emails: '' }}
        validationSchema={schema({ t, ...minMaxEmails })}
        onSubmit={onSubmitMemoized}
      >
        <Form>
          <Field
            type="text"
            name="lobbyName"
            label={t('Organisms.NewLobbyForm.LobbyName')}
            placeholder={t('Organisms.NewLobbyForm.LobbyNamePlaceholder')}
          />

          <Field
            type="textarea"
            name="emails"
            label={t('Organisms.NewLobbyForm.Emails')}
            placeholder={t(
              'Organisms.NewLobbyForm.EmailsPlaceholder',
              minMaxEmails,
            )}
          />

          <Layout flex justify-center>
            <Button submit primary disabled={newLobbyState.isLoading}>
              {t('Organisms.NewLobbyForm.SubmitNewLobbyForm')}
            </Button>
          </Layout>
        </Form>
      </Formik>
    </Modal>
  );
};
