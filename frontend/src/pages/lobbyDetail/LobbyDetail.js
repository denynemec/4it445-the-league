import React from 'react';
import { useParams } from 'react-router-dom';

import ENDPOINTS from '../../endpoints';
import { LoadingSpinner } from '../../atoms';
import { LoggedInPageLayout } from '../../templates';
import { useFetchRequest, useRequest } from '../../utils';
import { DraftFinished } from './DraftFinished';
import { DraftInProgress } from './DraftInProgress';
import { DraftNotStarted } from './DraftNotStarted';
import { AfterDraftLobbyDetail } from './AfterDraftLobbyDetail';

export const LobbyDetail = () => {
  const { lobbyId } = useParams();

  const lobbyState = useFetchRequest(ENDPOINTS.getLobbyDetail(lobbyId));
  const draftState = useRequest();
  const positonsEnumState = useFetchRequest(
    ENDPOINTS.enumLobbyPositions(lobbyId),
  );

  return (
    <LoggedInPageLayout
      errorList={[
        { id: 1, error: lobbyState.error },
        { id: 2, error: draftState.error },
        { id: 3, error: positonsEnumState.error },
      ]}
    >
      {(lobbyState.isLoading || positonsEnumState.isLoading) && (
        <LoadingSpinner />
      )}

      {lobbyState.data && positonsEnumState.data && (
        <>
          <AfterDraftLobbyDetail />
          {lobbyState.data.draftStatus === 'NOT_STARTED' && (
            <DraftNotStarted
              lobbyPlayersList={lobbyState.data.lobbyPlayersList}
              positions={positonsEnumState.data}
              userIsGroupOwner={lobbyState.data.userIsGroupOwner}
              draftState={draftState}
            />
          )}

          {lobbyState.data.draftStatus === 'IN_PROGRESS' && (
            <DraftInProgress draftState={draftState} />
          )}

          {/* TMP solution for show to draft button */}
          <DraftInProgress draftState={draftState} />

          {lobbyState.data.draftStatus === 'FINISHED' && (
            <DraftFinished
              usersInLobby={lobbyState.data.usersInLobby}
              playersInLobby={lobbyState.data.playersInLobby}
            />
          )}
        </>
      )}
    </LoggedInPageLayout>
  );
};
