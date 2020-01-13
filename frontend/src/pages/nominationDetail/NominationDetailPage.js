import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFetchRequest, useRequest } from '../../utils';
import ENDPOINTS from '../../endpoints';

import { LoadingSpinner, Heading, Layout } from '../../atoms';
import { LoggedInPageLayout } from '../../templates';
import { NominationTable } from './NominationTable';
import { TabMenu } from 'primereact/tabmenu';
import { Button } from 'reactstrap';

export const NominationDetailPage = () => {
  const { t } = useTranslation();
  // TODO zfunkčnit TabMenu
  // TODO validace

  const draftedTabMenu = {
    label: t('Page.Nomination.Drafted'),
    value: 'Drafted',
  };

  const nominatedTabMenu = {
    label: t('Page.Nomination.Nominated'),
    value: 'Nominated',
  };

  const confirmedNominationTabMenu = {
    label: t('Page.Nomination.ConfirmedNomination'),
    value: 'ConfirmedNomination',
  };

  const [errorListState, setErrorListState] = useState({
    errors: [{ error: null }],
  });

  const [tableMenu, setTableMenu] = useState({
    items: [draftedTabMenu, nominatedTabMenu],
  });

  const [activeTabMenuItemState, setActiveTabMenuItemState] = useState(
    undefined,
  );
  const [nominationState, setNominationState] = useState(undefined);
  const { lobbyId } = useParams();

  const onSuccessFetchNominationState = response => {
    setNominationState(response);
    if (response.data.nominatedPlayersCurrentUser.length) {
      setActiveTabMenuItemState(nominatedTabMenu);
    } else {
      setActiveTabMenuItemState(draftedTabMenu);
    }
    if (response.data.confirmedPlayersNomination.length) {
      setTableMenu(prevState => ({
        items: [...prevState.items, confirmedNominationTabMenu],
      }));
    }
  };

  const initialNominationState = useFetchRequest(
    ENDPOINTS.getNominationDetail(lobbyId),
    {
      onSuccess: onSuccessFetchNominationState,
    },
  );

  const updatedNominationState = useRequest();
  const finalNominationState = useRequest();

  const positionsEnumState = useFetchRequest(
    ENDPOINTS.enumLobbyPositions(lobbyId),
  );

  const updateNominationState = switchTo => {
    updatedNominationState.request(ENDPOINTS.getNominationDetail(lobbyId), {
      method: 'GET',
      onSuccess: response => {
        setNominationState(response);
        setActiveTabMenuItemState(switchTo);
      },
    });
  };

  const submitNomination = () => {
    finalNominationState.request(ENDPOINTS.submitNomination(lobbyId), {
      method: 'POST',
      data: { matchId: nominationState.data.nextMatchId },
    });
  };

  const validateAndSubmit = () => {
    finalNominationState.request(ENDPOINTS.validateNomination(lobbyId), {
      method: 'GET',
      onSuccess: response => {
        if (response.data.playersCount.count !== 11) {
          setErrorListState(prevState => ({
            errors: [
              ...prevState.errors,
              { error: 'Nesmí být méně než 11 hráčů' },
            ],
          }));
        }

        if (response.data.nominatedGoalkeepersCount.count < 1) {
          setErrorListState(prevState => ({
            errors: [
              ...prevState.errors,
              { error: 'Musí být alespoň jeden brankář.' },
            ],
          }));
        }

        if (
          response.data.nominatedDefendersCount.count >
          5 + response.data.filledPositionsCount
        ) {
          setErrorListState(prevState => ({
            errors: [
              ...prevState.errors,
              { error: 'Maximální počet obránců je 5.' },
            ],
          }));
        }
        if (
          response.data.nominatedMidfieldersCount.count >
          5 + response.data.filledPositionsCount
        ) {
          setErrorListState(prevState => ({
            errors: [
              ...prevState.errors,
              { error: 'Maximální počet záložníků je 5.' },
            ],
          }));
        }
        if (
          response.data.nominatedAttackersCount.count >
          3 + response.data.filledPositionsCount
        ) {
          setErrorListState(prevState => ({
            errors: [
              ...prevState.errors,
              { error: 'Maximální počet útočníků jsou 3.' },
            ],
          }));
        }

        if (errorListState.errors.length <= 1) {
          submitNomination();
        }
      },
    });
  };

  return (
    <LoggedInPageLayout
      errorList={[
        { id: 1, error: initialNominationState.error },
        { id: 2, error: positionsEnumState.error },
        { id: 3, error: updatedNominationState.error },
        errorListState.errors,
      ]}
    >
      {(initialNominationState.isLoading ||
        updatedNominationState.isLoading ||
        positionsEnumState.isLoading) && <LoadingSpinner />}

      {((initialNominationState.data && updatedNominationState.data) ||
        initialNominationState.data) &&
        positionsEnumState.data &&
        nominationState &&
        activeTabMenuItemState && (
          <>
            <TabMenu
              model={tableMenu.items}
              activeItem={activeTabMenuItemState}
              onTabChange={event => {
                setActiveTabMenuItemState(event.value);
              }}
            />
            {activeTabMenuItemState.value === 'Drafted' && (
              <>
                <Layout pt3>
                  <Heading className="flex justify-center pb2" size="md">
                    {t('Page.Nomination.Drafted')}
                  </Heading>
                  <NominationTable
                    positions={positionsEnumState.data}
                    playersList={nominationState.data.draftedPlayersCurrentUser}
                    matchId={nominationState.data.nextMatchId}
                    currentTab={activeTabMenuItemState}
                    switchTo={nominatedTabMenu}
                    onChangeUpdateState={updateNominationState}
                  />
                </Layout>
                <Layout pt3 flex justify-center>
                  <Button color="primary" onClick={() => validateAndSubmit()}>
                    {t('Page.Nomination.ConfirmNomination')}
                  </Button>
                </Layout>
              </>
            )}

            {activeTabMenuItemState.value === 'Nominated' && (
              <>
                <Layout pt3>
                  <Heading className="flex justify-center pb2" size="md">
                    {t('Page.Nomination.Nominated')}
                  </Heading>
                  <NominationTable
                    positions={positionsEnumState.data}
                    playersList={
                      nominationState.data.nominatedPlayersCurrentUser
                    }
                    matchId={nominationState.data.nextMatchId}
                    currentTab={activeTabMenuItemState}
                    onChangeUpdateState={updateNominationState}
                  />
                </Layout>
                <Layout pt3 flex justify-center>
                  <Button color="primary" onClick={() => validateAndSubmit()}>
                    {t('Page.Nomination.ConfirmNomination')}
                  </Button>
                </Layout>
              </>
            )}

            {activeTabMenuItemState.value === 'ConfirmedNomination' && (
              <>
                <Layout pt3>
                  <Heading className="flex justify-center pb2" size="md">
                    {t('Page.Nomination.Nominated')}
                  </Heading>
                  <NominationTable
                    positions={positionsEnumState.data}
                    playersList={
                      nominationState.data.confirmedPlayersNomination
                    }
                    matchId={nominationState.data.nextMatchId}
                    currentTab={activeTabMenuItemState}
                    onChangeUpdateState={updateNominationState}
                  />
                </Layout>
              </>
            )}
          </>
        )}
    </LoggedInPageLayout>
  );
};
