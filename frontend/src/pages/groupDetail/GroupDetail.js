import React from 'react';
import { useTranslation } from 'react-i18next';

import { Heading, Layout, LoadingSpinner, Label } from '../../atoms';

import { LoggedInPageLayout } from '../../templates';

export const GroupDetail = ({ name }) => {
  const { t } = useTranslation();

  const errorList = [];

  return (
    <LoggedInPageLayout errorList={errorList}>
      {/* {lobbyListState.isLoading && <LoadingSpinner />}

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
      </Layout> */}
    </LoggedInPageLayout>
  );
};
