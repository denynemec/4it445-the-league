import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Jumbo } from '../../molecules';
import { Paragraph } from '../../atoms';
import { Button, Badge } from 'reactstrap';

import PATHNAMES from '../../pathnames';

export const InDraftLobbyDetail = ({
  draftState,
  lobbyDetailInfo,
  userCount,
  notAcceptedInvitation,
  userIsGroupOwner,
}) => {
  const { t } = useTranslation();
  const { lobbyId } = useParams();
  const history = useHistory();
  return (
    <Jumbo
      header={t('Page.InDraftLobbyDetail.Heading', {
        name: lobbyDetailInfo[0].lobbyName,
      })}
      mainBody={lobbyDetailInfo[0].event}
    >
      <Paragraph>
        <h2>
          <Badge color="warning" pill>
            {t('Page.InDraftLobbyDetail.DraftStatus')}
          </Badge>
        </h2>
      </Paragraph>
      <Paragraph>
        {t('Page.InDraftLobbyDetail.Sport', {
          name: lobbyDetailInfo[0].sport,
        })}
      </Paragraph>

      <Paragraph>
        {t('Page.InDraftLobbyDetail.MinUsers', {
          minUsers: lobbyDetailInfo[0].minUsers,
        })}
      </Paragraph>
      <Paragraph>
        {t('Page.InDraftLobbyDetail.MaxUsers', {
          maxUsers: lobbyDetailInfo[0].maxUsers,
        })}
      </Paragraph>
      <Paragraph>
        {t('Page.InDraftLobbyDetail.UserCount', {
          userCount: userCount,
        })}
      </Paragraph>
      <Button
        color="primary"
        onClick={() => history.push(PATHNAMES.getDraftDetail(lobbyId))}
        disabled={draftState.loading}
      >
        {t('Page.LobbyDetail.DraftInProgress.ToDraft')}
      </Button>
    </Jumbo>
  );
};
