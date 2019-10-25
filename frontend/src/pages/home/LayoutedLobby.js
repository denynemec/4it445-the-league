import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Heading, Layout, Button } from '../../atoms';
import PATHNAMES from '../../pathnames';

export const LayoutedLobby = ({
  eventName,
  id,
  joinedUsers,
  maxUsers,
  minimumUsers,
  name,
  history,
}) => {
  const { t } = useTranslation();

  const onGoToDetailClick = useCallback(
    () => history.push(PATHNAMES.LOBBY_DETAIL(id)),
    [history, id],
  );

  let groupUserIndicatorColorClass = 'bg-spring-green';

  if (joinedUsers < minimumUsers) {
    groupUserIndicatorColorClass = 'bg-yellow';
  } else if (joinedUsers === maxUsers) {
    groupUserIndicatorColorClass = 'bg-red';
  }

  return (
    <Layout ba b--black-100 w-30 pa3 ma2 br2 flex flex-column shadow-1>
      <Layout flex justify-between items-center>
        <Heading size="sm">{name}</Heading>

        <Heading
          className={`ba br-pill pa2 ml2 ${groupUserIndicatorColorClass}`}
          size="sm"
        >{`${joinedUsers}/${maxUsers}`}</Heading>
      </Layout>

      <Layout pt2>{t('Page.Home.EventName', { eventName })}</Layout>

      <Layout pt3>
        <Button className="w-100" primary onClick={onGoToDetailClick}>
          {t('Page.Home.GoToGroupDetailButton')}
        </Button>
      </Layout>
    </Layout>
  );
};
