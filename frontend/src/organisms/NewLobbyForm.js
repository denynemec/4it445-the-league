import React, { useCallback } from 'react';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';

import ENDPOINTS from '../endpoints';
import PATHNAMES from '../pathnames';
import { Button, Layout, ErrorBox } from '../atoms';
import { Field } from '../organisms';
import { Modal } from '../molecules';
import { useRequest } from '../utils';

const schema = yup.object().shape({
  lobbyName: yup
    .string()
    .required()
    .label('LobbyName'),
});

export const NewLobbyForm = ({ isOpen, onCloseClick, eventName }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const newLobbyState = useRequest();

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
        initialValues={{ lobbyName: '' }}
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
