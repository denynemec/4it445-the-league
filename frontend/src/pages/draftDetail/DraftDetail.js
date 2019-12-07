import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ENDPOINTS from '../../endpoints';
import { LoadingSpinner, Heading, Layout } from '../../atoms';
import { LoggedInPageLayout } from '../../templates';
import { DraftPlayersTable } from './DraftPlayersTable';
import { useFetchRequest } from '../../utils';
import { DraftOrder } from './DraftOrder';
import { MyTeam } from './MyTeam';

export const DraftDetail = () => {
  const { t } = useTranslation();
  const { lobbyId } = useParams();

  const fetchDraftState = useFetchRequest(ENDPOINTS.fetchDraft(lobbyId));
  const positonsEnumState = useFetchRequest(
    ENDPOINTS.enumLobbyPositions(lobbyId),
  );

  return (
    <LoggedInPageLayout>
      {(fetchDraftState.isLoading || positonsEnumState.isLoading) && (
        <LoadingSpinner />
      )}

      {fetchDraftState.data && positonsEnumState.data && (
        <>
          <Heading className="flex justify-center pb2">
            {t('Page.Draft.Heading')}
          </Heading>

          {/* Static text for now, in future re-design and circular timer or something like that? */}
          <Layout flex justify-center>
            {`Zbyvajici cas: ${fetchDraftState.data.timeLeft} s${
              fetchDraftState.data.isPaused ? ' (Draft pozastaven)' : ''
            }`}
          </Layout>

          <Layout pt3>
            <Heading className="flex justify-center pb2" size="md">
              {t('Page.Draft.DraftOrderHeading')}
            </Heading>

            <DraftOrder
              data={fetchDraftState.data.draftOrder}
              activeDraftOrder={fetchDraftState.data.activeDraftOrder}
            />
          </Layout>

          <Layout pt3>
            <Heading className="flex justify-center pb2" size="md">
              {t('Page.Draft.MyTeamHeading')}
            </Heading>

            <MyTeam data={fetchDraftState.data.myTeam} />
          </Layout>

          <Layout pt3>
            <Heading className="flex justify-center pb2" size="md">
              {t('Page.Draft.DraftTableHeading')}
            </Heading>

            <DraftPlayersTable
              positions={positonsEnumState.data}
              draftPlayersList={fetchDraftState.data.draftPlayersList}
            />
          </Layout>
        </>
      )}
    </LoggedInPageLayout>
  );
};
