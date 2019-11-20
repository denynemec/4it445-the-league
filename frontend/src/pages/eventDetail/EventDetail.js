import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ENDPOINTS from '../../endpoints';
import { Layout, LoadingSpinner, Paragraph } from '../../atoms';
import { Jumbo } from '../../molecules';
import { LobbyList, NewLobbyForm } from '../../organisms';
import { LoggedInPageLayout } from '../../templates';
import { useFetchRequest, formatDate } from '../../utils';
import { Button } from 'reactstrap';

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
          <Jumbo
            header={t('Page.EventDetail.Heading', {
              name: eventState.data.name,
            })}
            mainBody={eventState.data.description}
            footer={
              <Button color="primary" onClick={onOpenModalClick}>
                {t('Page.EventDetail.AddNewLobbyButton')}
              </Button>
            }
          >
            <Paragraph>
              {t('Page.EventDetail.EventStartDateLabel', {
                date: formatDate(eventState.data.startDate),
              })}
            </Paragraph>
            <Paragraph>
              {t('Page.EventDetail.EventEndDateLabel', {
                date: formatDate(eventState.data.endDate),
              })}
            </Paragraph>
          </Jumbo>

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
