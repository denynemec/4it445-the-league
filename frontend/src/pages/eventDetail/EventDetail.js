import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import ENDPOINTS from '../../endpoints';
import { Button, Heading, Layout, LoadingSpinner, Label } from '../../atoms';
import { LobbyList, NewLobbyForm } from '../../organisms';
import { LoggedInPageLayout } from '../../templates';
import { useFetchRequest, formatDate } from '../../utils';

export const EventDetail = () => {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [addNewLobbyModalIsOpen, setAddNewLobbyModalIsOpen] = useState(false);
  const eventState = useFetchRequest(ENDPOINTS.getEventDetail(eventId));

  const onOpenModalClick = useCallback(() => setAddNewLobbyModalIsOpen(true), [
    setAddNewLobbyModalIsOpen,
  ]);

  const onCloseModalClick = useCallback(
    () => setAddNewLobbyModalIsOpen(false),
    [setAddNewLobbyModalIsOpen],
  );

  return (
    <LoggedInPageLayout errorList={[{ id: 1, error: eventState.error }]}>
      {eventState.isLoading && <LoadingSpinner />}

      {eventState.data && (
        <>
          <Heading size="xl" className="self-center pb3">
            {t('Page.EventDetail.Heading', { name: eventState.data.name })}
          </Heading>

          <Layout flex flex-row>
            <Layout pt3 pr3 flex flex-row justify-between w-50>
              <Label>{t('Page.EventDetail.EventStartDateLabel')}</Label>

              <span className={classNames('b')}>
                {formatDate(eventState.data.startDate)}
              </span>
            </Layout>

            <Layout pt3 pl3 flex flex-row justify-between w-50>
              <Label>{t('Page.EventDetail.EventEndDateLabel')}</Label>

              <span className={classNames('b')}>
                {formatDate(eventState.data.endDate)}
              </span>
            </Layout>
          </Layout>

          <Layout pt3>
            <span>{eventState.data.description}</span>
          </Layout>

          <Button
            className="w-50 mv3 self-center"
            primary
            onClick={onOpenModalClick}
          >
            {t('Page.EventDetail.AddNewLobbyButton')}
          </Button>

          <NewLobbyForm
            isOpen={addNewLobbyModalIsOpen}
            onCloseClick={onCloseModalClick}
            eventName={eventState.data.name}
            minUsers={eventState.data.minUsers}
            maxUsers={eventState.data.maxUsers}
            eventId={eventId}
          />

          <Layout bb mv2 />

          <LobbyList
            lobbyList={eventState.data.lobbyList || []}
            header={t('Page.EventDetail.LobbyHeader')}
          />
        </>
      )}
    </LoggedInPageLayout>
  );
};
