import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';

import ENDPOINTS from '../endpoints';
import PATHNAMES from '../pathnames';
import { ErrorBox } from '../atoms';
import { Field } from '../organisms';

import { Modal, ModalHeader, ModalFooter, Button } from 'reactstrap';
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
  const newLobbyState = useRequest();

  const minEmails = minUsers - 1;
  const maxEmails = maxUsers - 1;

  const onSubmitMemoized = useCallback(
    ({ lobbyName, emails }) => {
      newLobbyState.request(ENDPOINTS.newLobby(), {
        method: 'POST',
        onSuccess: ({ data: { lobbyId } }) => {
          history.push(PATHNAMES.getLobbyDetail(lobbyId));
        },
        data: {
          lobbyName,
          emails: Object.values(emailsStringToEmailArray(emails)),
          eventId,
        },
      });
    },
    [newLobbyState, history, eventId],
  );

  const { object, uniqueMinMaxEmails, requiredString } = translatedValidations(
    t,
  );

  const schema = object({
    lobbyName: requiredString,
    emails: uniqueMinMaxEmails({ min: minEmails, max: maxEmails }),
  });

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <Modal
      isOpen={isOpen}
      withFooter={false}
      onCloseClick={onCloseClick}
      isDisabled={newLobbyState.isLoading}
    >
      <ModalHeader toggle={toggle}>
        {t('Organisms.NewLobbyForm.ModalHeaderLabel', { eventName })}
      </ModalHeader>
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
          <ModalFooter>
            <Button submit color="primary" disabled={newLobbyState.isLoading}>
              {t('Organisms.NewLobbyForm.SubmitNewLobbyForm')}
            </Button>
          </ModalFooter>
        </Form>
      </Formik>
    </Modal>
  );
};
