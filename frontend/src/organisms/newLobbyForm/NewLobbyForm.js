import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Heading, Button, Form, Layout, Link } from '../../atoms';
import { ErrorBox, TextInputWithLabel } from '../../molecules';
import { useNewLobbyState } from './hooks';

const NewLobbyFormBase = ({ history }) => {
  const { t } = useTranslation();
  const {
    lobbyName,
    setLobbyName,
    newLobbyState,
    submitNewLobbyForm,
  } = useNewLobbyState(history);

  return (
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
  );
};

export const NewLobbyForm = withRouter(NewLobbyFormBase);
