import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ENDPOINTS from '../../endpoints';
import PATHNAMES from '../../pathnames';
import { Button, LoadingSpinner } from '../../atoms';
import { LoggedInPageLayout } from '../../templates';
import { LobbyAvailablePlayersTable } from './LobbyAvailablePlayersTable';
import { useFetchRequest, useRequest } from '../../utils';
import { PlayersTable } from './PlayersTable';
import { UsersMenu } from './UsersMenu';

export const LobbyDetail = () => {
  const { t } = useTranslation();
  const { lobbyId } = useParams();
  const history = useHistory();

  const lobbyState = useFetchRequest(ENDPOINTS.getLobbyDetail(lobbyId));
  const draftState = useRequest();

  return (
    <LoggedInPageLayout
      errorList={[
        { id: 1, error: lobbyState.error },
        { id: 2, error: draftState.error },
      ]}
    >
      {lobbyState.isLoading && <LoadingSpinner />}

      {lobbyState.data && (
        <DraftButtons
          history={history}
          draftStarted={lobbyState.data.draftStarted}
          draftState={draftState}
          t={t}
          lobbyId={lobbyId}
        />
      )}
      {lobbyState.data && (
        <UsersMenu usersInLobby={lobbyState.data.usersInLobby} />
      )}
      {lobbyState.data && (
        <PlayersTable players={lobbyState.data.playersInLobby} />
      )}
    </LoggedInPageLayout>
  );
};

const DraftButtons = ({ draftStarted, history, draftState, t, lobbyId }) => {
  const onDraftStart = useCallback(() => {
    draftState.request(ENDPOINTS.startDraft(lobbyId), {
      method: 'POST',
      onSuccess: () => {
        history.push(PATHNAMES.getDraftDetail(lobbyId));
      },
    });
  }, [draftState, lobbyId, history]);

  // TODO add check is user is group owner - from BE
  const userIsGroupOwner = true;

  return (
    <>
      <LobbyAvailablePlayersTable />
      {draftStarted && (
        <Button
          primary
          onClick={() => history.push(PATHNAMES.getDraftDetail(lobbyId))}
        >
          {t('Page.LobbyDetail.ToDraft')}
        </Button>
      )}

      {!draftStarted &&
        !userIsGroupOwner &&
        t('Page.LobbyDetail.DraftNotStarted')}

      {!draftStarted && userIsGroupOwner && (
        <Button primary onClick={onDraftStart}>
          {t('Page.LobbyDetail.StartDraft')}
        </Button>
      )}
    </>
  );
};
