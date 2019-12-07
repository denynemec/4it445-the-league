import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Heading, Layout, LoadingSpinner } from '../../atoms';
import { TextInputWithLabel } from '../../molecules';
import { LobbyList } from '../../organisms';
import { LoggedInPageLayout } from '../../templates';
import { useFetchData } from './hooks';
import { LayoutedEvent } from './LayoutedEvent';
import { valueContains } from '../../utils';

export const HomePage = () => {
  const { t } = useTranslation();

  const { eventListState, lobbyListState } = useFetchData();

  return (
    <LoggedInPageLayout>
      {(eventListState.isLoading || lobbyListState.isLoading) && (
        <LoadingSpinner />
      )}

      <Layout flex flex-column>
        {lobbyListState.data && lobbyListState.data.length > 0 && (
          <>
            <LobbyList
              lobbyList={lobbyListState.data}
              header={t('Page.Home.LobbyHeader')}
            />

            <Layout bb pb4 mb3 />
          </>
        )}

        {eventListState.data && (
          <LayoutedEvents eventList={eventListState.data} />
        )}
      </Layout>
    </LoggedInPageLayout>
  );
};

const LayoutedEvents = ({ eventList }) => {
  const { t } = useTranslation();

  const [filterEvent, setFilterEvent] = useState('');

  return (
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

      <Layout flex flex-wrap>
        {eventList
          .filter(({ name }) => valueContains(name, filterEvent))
          .map(event => (
            <LayoutedEvent key={event.id} {...event} />
          ))}
      </Layout>
    </>
  );
};
