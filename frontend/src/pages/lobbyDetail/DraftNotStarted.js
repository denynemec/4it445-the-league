import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ENDPOINTS from '../../endpoints';
import PATHNAMES from '../../pathnames';
import { Button, Layout } from '../../atoms';
import { LobbyAvailablePlayersTable } from './LobbyAvailablePlayersTable';

export const DraftNotStarted = ({
  lobbyPlayersList,
  draftState,
  userIsGroupOwner,
  positions,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { lobbyId } = useParams();

  const onDraftStart = useCallback(() => {
    draftState.request(ENDPOINTS.startDraft(lobbyId), {
      method: 'POST',
      onSuccess: () => {
        history.push(PATHNAMES.getDraftDetail(lobbyId));
      },
    });
  }, [draftState, lobbyId, history]);

  return (
    <>
      <LobbyAvailablePlayersTable
        lobbyPlayersList={lobbyPlayersList}
        positions={positions}
      />

      {userIsGroupOwner && (
        <Layout pt3 flex justify-center>
          <Button submit primary onClick={onDraftStart}>
            {t('Page.LobbyDetail.DraftNotStarted.StartDraft')}
          </Button>
        </Layout>
      )}
    </>
  );
};
