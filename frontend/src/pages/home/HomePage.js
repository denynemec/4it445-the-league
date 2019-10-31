import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { Heading, Layout, LoadingSpinner } from '../../atoms';
import { TextInputWithLabel } from '../../molecules';
import { LobbyList } from '../../organisms';
import { LoggedInPageLayout } from '../../templates';
import { useFetchData } from './hooks';
import { LayoutedEvent } from './LayoutedEvent';

export const HomePage = () => {
  const { t } = useTranslation();

  const history = useHistory();

  const { eventListState, lobbyListState } = useFetchData();

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
        <LobbyList
          lobbyList={lobbyListState.data || []}
          header={t('Page.Home.LobbyHeader')}
        />

        <Layout bb pb4 mb3 />

        {eventListState.data && (
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
                  onChange={event => setFilterEvent(event.target.value)}
                />
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
