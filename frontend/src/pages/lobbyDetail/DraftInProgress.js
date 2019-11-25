import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import PATHNAMES from '../../pathnames';
import { Button, Layout } from '../../atoms';

export const DraftInProgress = ({ draftState }) => {
  const { t } = useTranslation();
  const { lobbyId } = useParams();
  const history = useHistory();

  return (
    <Layout pt3 flex justify-center>
      <Button
        primary
        onClick={() => history.push(PATHNAMES.getDraftDetail(lobbyId))}
        disabled={draftState.loading}
      >
        {t('Page.LobbyDetail.DraftInProgress.ToDraft')}
      </Button>
    </Layout>
  );
};
