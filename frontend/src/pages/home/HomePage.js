import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';

import { Heading, Layout, LoadingSpinner } from '../../atoms';
import { TextInputWithLabel } from '../../molecules';
import { LoggedInPageLayout } from '../../templates';
import { useFetchData } from './hooks';
import { LayoutedLobby } from './LayoutedLobby';
import { LayoutedEvent } from './LayoutedEvent';

const HomePageBase = ({ history }) => {
  const { t } = useTranslation();

  const { eventListState, lobbyListState } = useFetchData();

  const [filterLobby, setFilterLobby] = useState('');
  const [filterEvent, setFilterEvent] = useState('');

  const errorList = [
    { id: 1, error: eventListState.error },
    { id: 2, error: lobbyListState.error },
  ];

  return (
    <LoggedInPageLayout errorList={errorList}>
      {(eventListState.isLoading || lobbyListState.isLoading) && (
        <LoadingSpinner />
      )}
      <Layout flex flex-column>
        {!lobbyListState.error && !lobbyListState.isLoading && (
          <>
            <Layout flex justify-between items-center>
              <Heading size="md" className="flex self-bottom">
                {t('Page.Home.GameGroupHeader')}
              </Heading>

              <Layout w-40>
                <TextInputWithLabel
                  name="lobbyFilter"
                  label={t('Page.Home.LobbyFilter')}
                  placeholder={t('Page.Home.LobbyFilterPlaceholder')}
                  value={filterLobby}
                  onChange={setFilterLobby}
                />
              </Layout>
            </Layout>

            <Layout flex flex-wrap pt3 bb pb4 mb3>
              {lobbyListState.data
                .filter(({ name }) =>
                  name.toLowerCase().includes(filterLobby.toLowerCase()),
                )
                .map(lobby => (
                  <LayoutedLobby key={lobby.id} history={history} {...lobby} />
                ))}
            </Layout>
          </>
        )}

        {/* Event list */}

        {!eventListState.error && !eventListState.isLoading && (
          <>
            <Layout flex justify-between items-center>
              <Heading size="md" className="flex self-bottom">
                {t('Page.Home.EventHeader')}
              </Heading>

              <Layout w-40>
                <TextInputWithLabel
                  name="event"
                  label={t('Page.Home.EventFilter')}
                  placeholder={t('Page.Home.EventFilterPlaceholder')}
                  value={filterEvent}
                  onChange={setFilterEvent}
                />{' '}
              </Layout>
            </Layout>

            <Layout flex flex-wrap pt3>
              {eventListState.data
                .filter(({ name }) =>
                  name.toLowerCase().includes(filterEvent.toLowerCase()),
                )
                .map(event => (
                  <LayoutedEvent key={event.id} history={history} {...event} />
                ))}
            </Layout>
          </>
        )}
      </Layout>
    </LoggedInPageLayout>
  );
};

export const HomePage = withRouter(HomePageBase);
