import React from 'react';
import { useTranslation } from 'react-i18next';

import { Heading, Layout } from '../atoms';

export const LayoutedLobby = ({
  eventName,
  joinedUsers,
  maxUsers,
  minUsers,
  name,
}) => {
  const { t } = useTranslation();

  let groupUserIndicatorColorClass = 'bg-red';

  if (joinedUsers >= minUsers) {
    groupUserIndicatorColorClass = 'bg-yellow';
  } else if (joinedUsers === maxUsers) {
    groupUserIndicatorColorClass = 'bg-spring-green';
  }

  return (
    <Layout ba b--black-100 pa3 br2 flex flex-column shadow-1>
      <Layout flex justify-between items-center>
        <Heading size="sm">{name}</Heading>

        <Heading
          className={`ba br-pill pa2 ml2 ${groupUserIndicatorColorClass}`}
          size="sm"
        >{`${joinedUsers}/${maxUsers}`}</Heading>
      </Layout>

      <Layout pt2>
        {t('Molecules.LayoutedLobby.EventName', { eventName })}
      </Layout>
    </Layout>
  );
};
