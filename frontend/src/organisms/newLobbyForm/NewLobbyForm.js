import React from 'react';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button, Form, Layout, ErrorBox } from '../../atoms';
import { Modal, TextInputWithLabel } from '../../molecules';
import { useNewLobbyState } from './hooks';

const NewLobbyFormBase = ({ isOpen, onCloseClick, history, eventName }) => {
  const { t } = useTranslation();
  const {
    lobbyName,
    setLobbyName,
    newLobbyState,
    submitNewLobbyForm,
  } = useNewLobbyState(history);

  return (
    <Modal
      headerLabel={t('Organisms.NewLobbyForm.ModalHeaderLabel', { eventName })}
      isOpen={isOpen}
      withFooter={false}
      onCloseClick={onCloseClick}
      isDisabled={newLobbyState.isLoading}
    >
      {newLobbyState.error && (
        <ErrorBox errorList={[{ id: 1, error: newLobbyState.error }]} />
      )}

      <Form onSubmit={submitNewLobbyForm}>
        <TextInputWithLabel
          name="lobbyName"
          label={t('Organisms.NewLobbyForm.LobbyName')}
          placeholder={t('Organisms.NewLobbyForm.LobbyNamePlaceholder')}
          value={lobbyName.value}
          error={lobbyName.error}
          onChange={setLobbyName}
        />

        <Layout flex justify-center>
          <Button submit primary disabled={newLobbyState.isLoading}>
            {t('Organisms.NewLobbyForm.SubmitNewLobbyForm')}
          </Button>
        </Layout>
      </Form>
    </Modal>
  );
};

export const NewLobbyForm = withRouter(NewLobbyFormBase);
