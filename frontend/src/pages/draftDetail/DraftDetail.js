import React, { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ENDPOINTS from '../../endpoints';
import { LoadingSpinner, Heading, Layout } from '../../atoms';
import { LoggedInPageLayout } from '../../templates';
import { DraftPlayersTable } from './DraftPlayersTable';
import { useFetchRequest, useRequest } from '../../utils';
import { DraftOrder } from './DraftOrder';
import { MyTeam } from './MyTeam';

export const DraftDetail = () => {
  const { t } = useTranslation();
  const { lobbyId } = useParams();

  const refrestDraftState = useRequest();

  const [draftStateData, setDraftStateData] = useState(undefined);

  const onSuccessFetchDraftState = response => {
    updateDraftState(
      response,
      response.data.draftOrder,
      response.data.draftPlayersList,
    );
  };

  const fetchDraftState = useFetchRequest(ENDPOINTS.fetchDraft(lobbyId), {
    onSuccess: onSuccessFetchDraftState,
  });
  const positonsEnumState = useFetchRequest(
    ENDPOINTS.enumLobbyPositions(lobbyId),
  );
  const teamsEnumState = useFetchRequest(ENDPOINTS.enumTeamsPositions(lobbyId));

  const updateDraftState = useCallback(
    (
      {
        data: {
          activeDraftOrder,
          isPaused,
          timeLeft,
          myTeamIdList,
          selectedPlayersIdList,
          userOnTurn,
        },
      },
      draftOrder,
      draftPlayersListRaw,
    ) => {
      setDraftStateData({
        activeDraftOrder,
        draftOrder,
        isPaused,
        timeLeft,
        myTeam: getMyTeam(draftPlayersListRaw, myTeamIdList),
        draftPlayersList: getDraftPlayers(
          draftPlayersListRaw,
          selectedPlayersIdList,
        ),
        userOnTurn,
        refreshDraftState: true,
        draftPlayersListRaw,
      });
    },
    [],
  );

  useEffect(() => {
    if (
      typeof draftStateData !== 'undefined' &&
      draftStateData.refreshDraftState
    ) {
      setDraftStateData(prevState => ({
        ...prevState,
        refreshDraftState: false,
      }));

      refrestDraftState.request(ENDPOINTS.refrestDraftState(lobbyId), {
        method: 'GET',
        onSuccess: response =>
          updateDraftState(
            response,
            draftStateData.draftOrder,
            draftStateData.draftPlayersListRaw,
          ),
      });
    }
  }, [
    draftStateData,
    updateDraftState,
    refrestDraftState,
    lobbyId,
    setDraftStateData,
  ]);

  return (
    <LoggedInPageLayout
      errorList={[
        { id: 1, error: fetchDraftState.error },
        { id: 2, error: positonsEnumState.error },
        { id: 3, error: teamsEnumState.error },
      ]}
    >
      {(fetchDraftState.isLoading ||
        positonsEnumState.isLoading ||
        teamsEnumState.isLoading) && <LoadingSpinner />}

      {typeof draftStateData !== 'undefined' &&
        positonsEnumState.data &&
        teamsEnumState.data && (
          <>
            <Heading className="flex justify-center pb2">
              {t('Page.Draft.Heading')}
            </Heading>

            <TimerCountdown
              timeLeft={draftStateData.timeLeft}
              isPaused={draftStateData.isPaused}
            />

            <Layout pt3>
              <Heading className="flex justify-center pb2" size="md">
                {t('Page.Draft.DraftOrderHeading')}
              </Heading>

              <DraftOrder
                data={draftStateData.draftOrder}
                activeDraftOrder={draftStateData.activeDraftOrder}
              />
            </Layout>

            <Layout pt3>
              <Heading className="flex justify-center pb2" size="md">
                {t('Page.Draft.MyTeamHeading')}
              </Heading>

              <MyTeam data={draftStateData.myTeam} />
            </Layout>

            <Layout pt3>
              <Heading className="flex justify-center pb2" size="md">
                {t('Page.Draft.DraftTableHeading')}
              </Heading>

              <DraftPlayersTable
                positions={positonsEnumState.data}
                teams={teamsEnumState.data}
                draftPlayersList={draftStateData.draftPlayersList}
                userOnTurn={draftStateData.userOnTurn}
              />
            </Layout>
          </>
        )}
    </LoggedInPageLayout>
  );
};

const getMyTeam = (draftPlayers, myTeamIdList) =>
  draftPlayers.filter(({ playerId }) => myTeamIdList.includes(playerId));

const getDraftPlayers = (draftPlayers, selectedPlayersIdList) =>
  draftPlayers.map(draftPlayer => {
    let selected = false;

    if (selectedPlayersIdList.includes(draftPlayer.playerId)) {
      selected = true;
    }

    return { ...draftPlayer, selected };
  });

// Static text for now, in future re-design and circular timer or something like that?
const TimerCountdown = ({ timeLeft, isPaused }) => {
  const min = Math.floor(timeLeft / 60);

  const sec = Math.floor(timeLeft % 60);

  return (
    <Layout flex justify-center>
      {`Zbyvajici cas: ${min} min ${sec} s${
        isPaused ? ' (Draft pozastaven)' : ''
      }`}
    </Layout>
  );
};
