import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ENDPOINTS from '../../endpoints';
import { LoadingSpinner, Heading } from '../../atoms';
import { LoggedInPageLayout } from '../../templates';
import { DraftPlayersTable } from './DraftPlayersTable';
import { useFetchRequest } from '../../utils';
import { DraftOrder } from './DraftOrder';

export const DraftDetail = () => {
  const { t } = useTranslation();
  const { lobbyId } = useParams();

  const fetchDraftState = useFetchRequest(ENDPOINTS.fetchDraft(lobbyId));

  return (
    <LoggedInPageLayout errorList={[{ id: 1, error: fetchDraftState.error }]}>
      {fetchDraftState.isLoading && <LoadingSpinner />}

      {fetchDraftState.data && (
        <>
          <Heading className="flex justify-center pb2">
            {t('Page.Draft.Heading')}
          </Heading>

          <DraftOrder
            data={fetchDraftState.data.draftOrder}
            activeDraftOrder={fetchDraftState.data.activeDraftOrder}
          />
        </>
      )}
      <DraftPlayersTable />
    </LoggedInPageLayout>
  );
};
