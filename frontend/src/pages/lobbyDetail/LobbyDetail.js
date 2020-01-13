import React from 'react';
import { useParams } from 'react-router-dom';

import ENDPOINTS from '../../endpoints';
import { LoadingSpinner } from '../../atoms';
import { LoggedInPageLayout } from '../../templates';
import { useFetchRequest, useRequest } from '../../utils';
import { DraftFinished } from './DraftFinished';
import { DraftInProgress } from './DraftInProgress';
import { DraftNotStarted } from './DraftNotStarted';

export const LobbyDetail = () => {
  const { lobbyId } = useParams();

  const lobbyState = useFetchRequest(ENDPOINTS.getLobbyDetail(lobbyId));
  const draftState = useRequest();
  const positonsEnumState = useFetchRequest(
    ENDPOINTS.enumLobbyPositions(lobbyId),
  );

  const teamsEnumState = useFetchRequest(ENDPOINTS.enumTeamsPositions(lobbyId));

  return (
    <LoggedInPageLayout
      errorList={[
        { id: 1, error: lobbyState.error },
        { id: 2, error: draftState.error },
        { id: 3, error: positonsEnumState.error },
        { id: 4, error: teamsEnumState.error },
      ]}
    >
      {(lobbyState.isLoading ||
        positonsEnumState.isLoading ||
        teamsEnumState.isLoading) && <LoadingSpinner />}

      {lobbyState.data && positonsEnumState.data && teamsEnumState.data && (
        <>
          {lobbyState.data.draftStatus === 'NOT_STARTED' && (
            <DraftNotStarted
              lobbyPlayersList={lobbyState.data.lobbyPlayersList}
              positions={positonsEnumState.data}
              teams={teamsEnumState.data}
              userIsGroupOwner={lobbyState.data.userIsGroupOwner}
              draftState={draftState}
              lobbyDetailInfo={lobbyState.data.lobbyDetailInfo}
              userCount={lobbyState.data.userCount}
              notAcceptedInvitation={lobbyState.data.notAcceptedInvitation}
            />
          )}

          {lobbyState.data.draftStatus === 'IN_PROGRESS' && (
            <DraftInProgress
              draftState={draftState}
              lobbyDetailInfo={lobbyState.data.lobbyDetailInfo}
              userCount={lobbyState.data.userCount}
              notAcceptedInvitation={lobbyState.data.notAcceptedInvitation}
              userIsGroupOwner={lobbyState.data.userIsGroupOwner}
            />
          )}

          {lobbyState.data.draftStatus === 'FINISHED' && (
            <DraftFinished
              usersInLobby={lobbyState.data.usersInLobby}
              playersInLobby={lobbyState.data.playersInLobby}
              usersInNomination={lobbyState.data.usersInNomination}
              profitsPerRound={lobbyState.data.profitsPerRound}
              lobbyPlayersList={lobbyState.data.lobbyPlayersList}
              positions={positonsEnumState.data}
              userIsGroupOwner={lobbyState.data.userIsGroupOwner}
              draftState={draftState}
              lobbyDetailInfo={lobbyState.data.lobbyDetailInfo}
              userCount={lobbyState.data.userCount}
              notAcceptedInvitation={lobbyState.data.notAcceptedInvitation}
            />
          )}
        </>
      )}
    </LoggedInPageLayout>
  );
};
