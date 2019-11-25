import React from 'react';

import { PlayersTable } from './PlayersTable';
import { UsersMenu } from './UsersMenu';

export const DraftFinished = ({ usersInLobby, playersInLobby }) => (
  <>
    <UsersMenu usersInLobby={usersInLobby} />

    <PlayersTable players={playersInLobby} />
  </>
);
