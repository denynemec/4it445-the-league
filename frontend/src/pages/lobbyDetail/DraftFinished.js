import React from 'react';

import { PlayersTable } from './PlayersTable';
import { UsersMenu } from './UsersMenu';
import { AfterDraftLobbyDetail } from './AfterDraftLobbyDetail';

export const DraftFinished = ({
  usersInLobby,
  playersInLobby,
  usersInNomination,
  profitsPerRound,
  lobbyPlayersList,
  draftState,
  userIsGroupOwner,
  positions,
  lobbyDetailInfo,
  userCount,
  notAcceptedInvitation,
}) => (
  <>
    <UsersMenu usersInLobby={usersInLobby} />

    <AfterDraftLobbyDetail
      lobbyDetailInfo={lobbyDetailInfo}
      userCount={userCount}
      notAcceptedInvitation={notAcceptedInvitation}
      userIsGroupOwner={userIsGroupOwner}
      profitsPerRound={profitsPerRound}
      usersInNomination={usersInNomination}
    />

    <PlayersTable players={playersInLobby} />
  </>
);
