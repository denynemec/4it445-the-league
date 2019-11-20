import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import PATHNAMES from '../pathnames';

import { Heading, Layout } from '../atoms';
import { LayoutedLobby, TextInputWithLabel } from '../molecules';
import { valueContains } from '../utils';

import { CardDeck, Button } from 'reactstrap';

export const LobbyList = ({ lobbyList, header }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [filterLobby, setFilterLobby] = useState('');

  return (
    lobbyList.length !== 0 && (
      <>
        <Layout flex justify-between items-center>
          <Heading size="md" className="flex self-bottom">
            {header}
          </Heading>

          <Layout w-40>
            <TextInputWithLabel
              name="lobbyFilter"
              label={t('Organisms.LobbyList.LobbyFilter')}
              placeholder={t('Organisms.LobbyList.LobbyFilterPlaceholder')}
              value={filterLobby}
              onChange={event => setFilterLobby(event.target.value)}
            />
          </Layout>
        </Layout>
        <CardDeck>
          {lobbyList
            .filter(({ name }) => valueContains(name, filterLobby))
            .map(lobby => (
              <LayoutedLobby
                {...lobby}
                footer={
                  <Button
                    block
                    color="primary"
                    onClick={() =>
                      history.push(PATHNAMES.getLobbyDetail(lobby.id))
                    }
                  >
                    {t('Organisms.LobbyList.GoToGroupDetailButton')}
                  </Button>
                }
              />
            ))}
        </CardDeck>
      </>
    )
  );
};
