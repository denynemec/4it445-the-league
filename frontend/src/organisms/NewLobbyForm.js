import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';
import ENDPOINTS from '../endpoints';
import PATHNAMES from '../pathnames';
import { Layout, ErrorBox } from '../atoms';
import { Field } from '../organisms';
import { Modal } from '../molecules';
import { Button } from 'reactstrap';
import { useAlert } from 'react-alert';
import {
  useRequest,
  translatedValidations,
  emailsStringToEmailArray,
} from '../utils';

export const NewLobbyForm = ({
  isOpen,
  onCloseClick,
  eventName,
  minUsers,
  maxUsers,
  eventId,
}) => {
  const { t } = useTranslation();

  const history = useHistory();
  const alert = useAlert();
  const newLobbyState = useRequest();
  const minEmails = minUsers - 1;
  const maxEmails = maxUsers - 1;

  const onSubmitMemoized = useCallback(
    ({ lobbyName, emails }) => {
      newLobbyState.request(ENDPOINTS.newLobby(), {
        method: 'POST',
        onSuccess: ({ data: { lobbyId } }) => {
          alert.success('Lobby created successfully');
          history.push(PATHNAMES.getLobbyDetail(lobbyId));
        },
        data: {
          lobbyName,
          emails: Object.values(emailsStringToEmailArray(emails)),
          eventId,
        },
      });
    },

    [newLobbyState, history, eventId, alert],
  );

  const { object, uniqueMinMaxEmails, requiredString } = translatedValidations(
    t,
  );

  const schema = object({
    lobbyName: requiredString,

    emails: uniqueMinMaxEmails({ min: minEmails, max: maxEmails }),
  });

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
        validationSchema={schema}
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
            placeholder={t('Organisms.NewLobbyForm.EmailsPlaceholder', {
              min: minEmails,

              max: maxEmails,
            })}
          />

          <Layout flex justify-center>
            <Button submit color="primary" disabled={newLobbyState.isLoading}>
              {t('Organisms.NewLobbyForm.SubmitNewLobbyForm')}
            </Button>
          </Layout>
        </Form>
      </Formik>
    </Modal>
  );
};
