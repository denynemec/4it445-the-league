import React from 'react';
import { useTranslation } from 'react-i18next';
import { Jumbo } from '../../molecules';
import { Paragraph } from '../../atoms';
import { formatDateTime } from '../../utils';
import { Button } from 'reactstrap';

export const BeforeDraftLobbyDetail = ({
  lobbyDetailInfo,
  userCount,
  notAcceptedInvitation,
  userIsGroupOwner,
}) => {
  const { t } = useTranslation();
  return (
    <Jumbo
      header={t('Page.BeforeDraftLobbyDetail.Heading', {
        name: lobbyDetailInfo[0].lobbyName,
      })}
      mainBody={lobbyDetailInfo[0].event}
    >
      <Paragraph>
        {t('Page.BeforeDraftLobbyDetail.Sport', {
          name: lobbyDetailInfo[0].sport,
        })}
      </Paragraph>
      <Paragraph>
        {t('Page.BeforeDraftLobbyDetail.DraftStartTime', {
          date: formatDateTime(lobbyDetailInfo[0].draftStartAt),
        })}
      </Paragraph>
      <Paragraph>
        {t('Page.BeforeDraftLobbyDetail.MinUsers', {
          minUsers: lobbyDetailInfo[0].minUsers,
        })}
      </Paragraph>
      <Paragraph>
        {t('Page.BeforeDraftLobbyDetail.MaxUsers', {
          maxUsers: lobbyDetailInfo[0].maxUsers,
        })}
      </Paragraph>
      <Paragraph>
        {t('Page.BeforeDraftLobbyDetail.UserCount', {
          userCount: userCount,
        })}
      </Paragraph>
      <Paragraph>
        {t('Page.BeforeDraftLobbyDetail.NotAcceptedInvitation', {
          email: notAcceptedInvitation,
        })}
      </Paragraph>
      {userIsGroupOwner && (
        <Button color="primary">
          {t('Page.BeforeDraftLobbyDetail.SendReminder')}
        </Button>
      )}
    </Jumbo>
  );
};
