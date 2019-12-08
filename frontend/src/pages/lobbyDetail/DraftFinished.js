import React from 'react';

import { PlayersTable } from './PlayersTable';
import { UsersMenu } from './UsersMenu';
import { AfterDraftLobbyDetail } from './AfterDraftLobbyDetail';

export const DraftFinished = ({
  usersInLobby,
  playersInLobby,
  usersInNomination,
  profitsPerRound,
}) => (
  <>
    <UsersMenu usersInLobby={usersInLobby} />

    <AfterDraftLobbyDetail
      profitsPerRound={profitsPerRound}
      usersInNomination={usersInNomination}
    />

    <PlayersTable players={playersInLobby} />
  </>
);
