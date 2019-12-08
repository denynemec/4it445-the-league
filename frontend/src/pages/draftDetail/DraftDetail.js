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
    updateDraftState(response, response.data.draftPlayersList);
  };

  const fetchDraftState = useFetchRequest(ENDPOINTS.fetchDraft(lobbyId), {
    onSuccess: onSuccessFetchDraftState,
  });
  const positonsEnumState = useFetchRequest(
    ENDPOINTS.enumLobbyPositions(lobbyId),
  );

  const updateDraftState = useCallback(
    (
      {
        data: {
          activeDraftOrder,
          draftOrder,
          isPaused,
          timeLeft,
          myTeamIdList = [],
          selectedPlayersIdList = [],
        },
      },
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

      setTimeout(() => {
        refrestDraftState.request(ENDPOINTS.fetchDraft(lobbyId), {
          method: 'GET',
          onSuccess: response =>
            updateDraftState(response, draftStateData.draftPlayersListRaw),
        });
      }, 3000);
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
      ]}
    >
      {(fetchDraftState.isLoading || positonsEnumState.isLoading) && (
        <LoadingSpinner />
      )}

      {typeof draftStateData !== 'undefined' && positonsEnumState.data && (
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
              draftPlayersList={draftStateData.draftPlayersList}
            />
          </Layout>
        </>
      )}
    </LoggedInPageLayout>
  );
};

const getMyTeam = (draftPlayers, myTeamIdList) =>
  draftPlayers.filter(({ id }) => myTeamIdList.includes(id));

const getDraftPlayers = (draftPlayers, selectedPlayersIdList) =>
  draftPlayers.map(draftPlayer => {
    let selected = false;

    if (selectedPlayersIdList.includes(draftPlayer.id)) {
      selected = true;
    }

    return { ...draftPlayer, selected };
  });

// Static text for now, in future re-design and circular timer or something like that?
const TimerCountdown = ({ timeLeft, isPaused }) => (
  <Layout flex justify-center>
    {`Zbyvajici cas: ${timeLeft} s${isPaused ? ' (Draft pozastaven)' : ''}`}
  </Layout>
);
