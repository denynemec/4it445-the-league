import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ENDPOINTS from '../../endpoints';
import { LoadingSpinner, Heading } from '../../atoms';
import { LoggedInPageLayout } from '../../templates';
import { useFetchRequest } from '../../utils';
import { Table } from './Table';

export const LobbyDetail = () => {
  // const { t } = useTranslation();
  const { lobbyId } = useParams();
  const { t } = useTranslation();

  const lobbyState = useFetchRequest(ENDPOINTS.getLobbyDetail(lobbyId));
  console.log(lobbyState);
  return (
    <LoggedInPageLayout errorList={[{ id: 1, error: lobbyState.error }]}>
      <Heading className="flex justify-center pb2">
        {t('Page.PlayersResults.ResultHeading')}
      </Heading>
      {lobbyState.isLoading && <LoadingSpinner />}

      {lobbyState.data && (
        <Table
          legendData={[
            {
              name: 'name',
              position: 'pos',
              team: 'team',
              earnings: 'earning',
              earningsPercentage: 'percent',
              profitLoss: 'loss',
            },
          ]}
          data={lobbyState.data.playerList}
        />
      )}
    </LoggedInPageLayout>
  );
};
