import React from 'react';
import { InDraftLobbyDetail } from './InDraftLobbyDetail';
import { Layout } from '../../atoms';

export const DraftInProgress = ({
  draftState,
  lobbyDetailInfo,
  userCount,
  notAcceptedInvitation,
  userIsGroupOwner,
}) => {
  return (
    <Layout pt3>
      <InDraftLobbyDetail
        lobbyDetailInfo={lobbyDetailInfo}
        userCount={userCount}
        notAcceptedInvitation={notAcceptedInvitation}
        draftState={draftState}
      />
    </Layout>
  );
};
