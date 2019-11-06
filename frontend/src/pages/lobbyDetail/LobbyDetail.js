import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ENDPOINTS from '../../endpoints';
import { LoadingSpinner, Heading, Layout } from '../../atoms';
import { LoggedInPageLayout } from '../../templates';
import { useFetchRequest } from '../../utils';
import { Table } from './Table';
import { CountEarnings } from './CountEarnings';
import { CountProfitLoss } from './CountProfitLoss';
import { TotalPercentageForSeason } from './TotalPercentageForSeason';

export const LobbyDetail = () => {
  const { t } = useTranslation();
  const { lobbyId } = useParams();

  let tableHeader = [
    {
      name: 'Page.PlayersResults.PlayersTable.Name',
      position: 'Page.PlayersResults.PlayersTable.Position',
      team: 'Page.PlayersResults.PlayersTable.Team',
      earnings: 'Page.PlayersResults.PlayersTable.Earnings',
      earningsPercentage: 'Page.PlayersResults.PlayersTable.EarningsPercentage',
      profitLoss: 'Page.PlayersResults.PlayersTable.ProfitLoss',
    },
  ];

  const lobbyState = useFetchRequest(ENDPOINTS.getLobbyDetail(lobbyId));
  return (
    <LoggedInPageLayout errorList={[{ id: 1, error: lobbyState.error }]}>
      <Layout>
        <Heading className="flex justify-center pb2">
          {t('Page.PlayersResults.ResultHeading')}
        </Heading>
      </Layout>
      <Layout>
        {lobbyState.isLoading && <LoadingSpinner />}
        {lobbyState.data && (
          <CountEarnings playersData={lobbyState.data.playerList} />
        )}
        {lobbyState.data && (
          <CountProfitLoss playersData={lobbyState.data.playerList} />
        )}
        {lobbyState.data && (
          <TotalPercentageForSeason playersData={lobbyState.data.playerList} />
        )}
        {lobbyState.data && (
          <Table legendData={tableHeader} data={lobbyState.data.playerList} />
        )}
      </Layout>
    </LoggedInPageLayout>
  );
};
