import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';

import { Heading, Layout, LoadingSpinner, Label } from '../../atoms';
import { TextInputWithLabel } from '../../molecules';
import { LoggedInPageLayout } from '../../templates';
import { useFetchData } from './hooks';

const GroupDetailBase = ({ name, history }) => {
  const { t } = useTranslation();

  const { eventListState, lobbyListState } = useFetchData();

  const [filterLobby, setFilterLobby] = useState('');
  const [filterEvent, setFilterEvent] = useState('');

  const errorList = [
    { id: 1, error: eventListState.error },
    { id: 2, error: lobbyListState.error },
  ];

  return (
    <LoggedInPageLayout errorList={errorList}>
      {(eventListState.isLoading || lobbyListState.isLoading) && (
        <LoadingSpinner />
      )}
      <Layout flex justify-between items-center>
        <Heading size="xl" className="flex self-bottom">
          {t('Page.GroupDetail.GroupHeader', { name })}
        </Heading>
      </Layout>
      <Layout>
        <Heading size="md" className="flex self-bottom">
          {t('Page.GroupDetail.BasicInformationHeader')}
        </Heading>
        <Label>{t('Page.GroupDetail.PlayersJoined')}</Label>
        <Label>{t('Page.GroupDetail.MaxPlayers')}</Label>
        <Label>{t('Page.GroupDetail.GameEvent')}</Label>
        <Heading size="md" className="flex self-bottom">
          {t('Page.GroupDetail.PlayersHeader')}
        </Heading>
        <Heading size="md" className="flex self-bottom">
          {t('Page.GroupDetail.GameRules')}
        </Heading>
      </Layout>
    </LoggedInPageLayout>
  );
};

export const GroupDetail = withRouter(GroupDetailBase);
