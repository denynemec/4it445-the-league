import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ENDPOINTS from '../../endpoints';
import { LoadingSpinner, Heading } from '../../atoms';
import { LoggedInPageLayout } from '../../templates';
import { useFetchRequest } from '../../utils';

export const DraftDetail = () => {
  const { t } = useTranslation();
  const { lobbyId } = useParams();

  const fetchDraftState = useFetchRequest(ENDPOINTS.fetchDraft(lobbyId));

  // tmp
  fetchDraftState.data && console.log(fetchDraftState.data);

  return (
    <LoggedInPageLayout errorList={[{ id: 1, error: fetchDraftState.error }]}>
      {fetchDraftState.isLoading && <LoadingSpinner />}

      <Heading className="flex justify-center pb2">
        {t('Page.Draft.Heading')}
      </Heading>
    </LoggedInPageLayout>
  );
};
