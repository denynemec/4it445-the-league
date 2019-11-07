import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

import { Heading, Layout, Button, Label } from '../../atoms';
import { NewLobbyForm } from '../../organisms';
import PATHNAMES from '../../pathnames';
import { formatDate } from '../../utils';

export const LayoutedEvent = ({
  description,
  startDate,
  endDate,
  name,
  id,
  minUsers,
  maxUsers,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [addNewLobbyModalIsOpen, setAddNewLobbyModalIsOpen] = useState(false);

  const onGoToDetailClick = useCallback(
    () => history.push(PATHNAMES.getEventDetail(id)),
    [history, id],
  );

  const onOpenModalClick = useCallback(() => setAddNewLobbyModalIsOpen(true), [
    setAddNewLobbyModalIsOpen,
  ]);

  const onCloseModalClick = useCallback(
    () => setAddNewLobbyModalIsOpen(false),
    [setAddNewLobbyModalIsOpen],
  );

  return (
    <Layout ba b--black-100 w-30 pa3 ma2 br2 flex flex-column shadow-1>
      <Heading className="self-center" size="sm">
        {name}
      </Heading>

      <Layout pt3 flex flex-row justify-between>
        <Label>{t('Page.Home.EventStartDateLabel')}</Label>

        <span className={classNames('b')}>{formatDate(startDate)}</span>
      </Layout>

      <Layout pt2 flex flex-row justify-between>
        <Label>{t('Page.Home.EventEndDateLabel')}</Label>

        <span className={classNames('b')}>{formatDate(endDate)}</span>
      </Layout>

      <Layout pt2>
        <span>{description}</span>
      </Layout>

      <Layout pt3>
        <Button className="w-100" primary onClick={onOpenModalClick}>
          {t('Page.Home.AddNewLobbyButton')}
        </Button>

        <NewLobbyForm
          isOpen={addNewLobbyModalIsOpen}
          onCloseClick={onCloseModalClick}
          minUsers={minUsers}
          maxUsers={maxUsers}
          eventName={name}
          eventId={id}
        />
      </Layout>

      <Layout pt3>
        <Button className="w-100" primary onClick={onGoToDetailClick}>
          {t('Page.Home.GoToEventDetailButton')}
        </Button>
      </Layout>
    </Layout>
  );
};
