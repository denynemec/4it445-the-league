import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ENDPOINTS from '../../endpoints';
import PATHNAMES from '../../pathnames';
import { Heading, LoadingSpinner, Layout, Button, InfoBox } from '../../atoms';
import { LayoutedLobby } from '../../molecules';
import { NotLoggedInPageLayout } from '../../templates';
import { useAuth, useFetchRequest, useRequest } from '../../utils';

export const JoinToLobbyPage = () => {
  const { t } = useTranslation();
  const { lobbyHash } = useParams();
  const { signin } = useAuth();
  const history = useHistory();

  const lobbyDetailState = useFetchRequest(
    ENDPOINTS.getJoinToLobbyDetail(lobbyHash),
  );

  const joinToLobbyState = useRequest();

  const onJoinToLobbyMemoized = useCallback(() => {
    joinToLobbyState.request(ENDPOINTS.joinToLobby(), {
      method: 'PUT',
      onSuccess: ({ data: { userIsRegistered, token, user } }) => {
        if (userIsRegistered) {
          signin({ token, user });
          history.push(PATHNAMES.home());
        }

        history.push(PATHNAMES.registration());
      },
      data: { lobbyHash },
    });
  }, [lobbyHash, history, signin, joinToLobbyState]);

  return (
    <NotLoggedInPageLayout
      errorList={[
        { id: 1, error: lobbyDetailState.error },
        { id: 2, error: joinToLobbyState.error },
      ]}
    >
      {lobbyDetailState.isLoading && <LoadingSpinner />}

      {lobbyDetailState.data && (
        <>
          <Heading className="flex justify-center pb2">
            {t('Page.JoinToLobby.Heading')}
          </Heading>

          {!lobbyDetailState.data.userIsRegistered && (
            <InfoBox
              className="mt3"
              infoList={[
                { id: 1, info: t('Page.JoinToLobby.UserNotRegistered') },
              ]}
            />
          )}

          <Layout pt3>
            <LayoutedLobby {...lobbyDetailState.data} />
          </Layout>

          <Layout flex justify-center pt3>
            <Button
              primary
              disabled={joinToLobbyState.isLoading}
              onClick={onJoinToLobbyMemoized}
            >
              {t('Page.JoinToLobby.JoinButton')}
            </Button>
          </Layout>
        </>
      )}
    </NotLoggedInPageLayout>
  );
};
