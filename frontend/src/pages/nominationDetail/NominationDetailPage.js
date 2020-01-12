import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFetchRequest, useRequest } from '../../utils';
import ENDPOINTS from '../../endpoints';

import { LoadingSpinner } from '../../atoms';
import { LoggedInPageLayout } from '../../templates';
import { NominationTable } from './NominationTable';
import { TabMenu } from 'primereact/tabmenu';

export const NominationDetailPage = () => {
  // TODO zfunkčnit TabMenu
  // TODO validace
  const [tableMenu, setTableMenu] = useState([
    {
      label: 'Drafted',
    },
    {
      label: 'Nominated',
    },
  ]);

  const [nominationState, setNominationState] = useState(undefined);
  const { lobbyId } = useParams();
  const initialNominationState = useFetchRequest(
    ENDPOINTS.getNominationDetail(lobbyId),
    { onSuccess: response => setNominationState(response) },
  );

  const updatedNominationState = useRequest();

  const positionsEnumState = useFetchRequest(
    ENDPOINTS.enumLobbyPositions(lobbyId),
  );

  const { t } = useTranslation();

  const updateNominationState = () => {
    updatedNominationState.request(ENDPOINTS.getNominationDetail(lobbyId), {
      method: 'GET',
      onSuccess: response => {
        setNominationState(response);
      },
    });
  };

  return (
    <LoggedInPageLayout
      errorList={[
        { id: 1, error: initialNominationState.error },
        { id: 2, error: positionsEnumState.error },
        { id: 3, error: updatedNominationState.error },
      ]}
    >
      {(initialNominationState.isLoading ||
        positionsEnumState.isLoading ||
        updatedNominationState.isLoading) && <LoadingSpinner />}

      {(initialNominationState.data || updatedNominationState) &&
        positionsEnumState.data &&
        nominationState && (
          <>
            <TabMenu model={tableMenu} />
            <NominationTable
              positions={positionsEnumState.data}
              playersList={nominationState.data.draftedPlayersCurrentUser}
              matchId={nominationState.data.nextMatchId}
              action="nominate"
              onChange={updateNominationState}
            />
            <NominationTable
              positions={positionsEnumState.data}
              playersList={nominationState.data.nominatedPlayersCurrentUser}
              matchId={nominationState.data.nextMatchId}
              action="unnominate"
              onChange={updateNominationState}
            />
          </>
        )}
    </LoggedInPageLayout>
  );
};
