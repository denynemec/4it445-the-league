import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

import { Heading, Layout, Button } from '../../atoms';
import { NewLobbyForm } from '../../organisms';
import PATHNAMES from '../../pathnames';
import { formatDate } from '../../utils';

export const LayoutedEvent = ({
  description,
  startDate,
  endDate,
  name,
  id,
  history,
}) => {
  const { t } = useTranslation();
  const [addNewLobbyModalIsOpen, setAddNewLobbyModalIsOpen] = useState(false);

  const onGoToDetailClick = useCallback(
    () => history.push(PATHNAMES.EVENT_DETAIL(id)),
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
      <Layout flex>
        <Heading size="sm">{name}</Heading>
      </Layout>

      <Layout pt3 flex flex-row justify-between>
        {t('Page.Home.EventStartDateLabel')}
        <span className={classnames('b')}>{formatDate(startDate)}</span>
      </Layout>

      <Layout pt2 flex flex-row justify-between>
        {t('Page.Home.EventEndDateLabel')}
        <span className={classnames('b')}>{formatDate(endDate)}</span>
      </Layout>

      <Layout pt2>{description}</Layout>

      <Layout pt3>
        <Button className="w-100" primary onClick={onOpenModalClick}>
          {t('Page.Home.AddNewLobbyButton')}
        </Button>

        <NewLobbyForm
          isOpen={addNewLobbyModalIsOpen}
          onCloseClick={onCloseModalClick}
          eventName={name}
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
