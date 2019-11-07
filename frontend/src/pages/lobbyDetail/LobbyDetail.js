import React from 'react';
import { useParams } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';

import ENDPOINTS from '../../endpoints';
import { LoadingSpinner } from '../../atoms';
import { LoggedInPageLayout } from '../../templates';
import { useFetchRequest } from '../../utils';

export const LobbyDetail = () => {
  // const { t } = useTranslation();
  const { lobbyId } = useParams();

  const lobbyState = useFetchRequest(ENDPOINTS.fetchDraft(lobbyId));

  return (
    <LoggedInPageLayout errorList={[{ id: 1, error: lobbyState.error }]}>
      {lobbyState.isLoading && <LoadingSpinner />}

      {lobbyState.data && 'Lobby detail page skeleton '}
    </LoggedInPageLayout>
  );
};
