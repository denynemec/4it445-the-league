import React from 'react';
import { useTranslation } from 'react-i18next';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export const MyTeam = ({ data }) => {
  const { t } = useTranslation();

  return (
    <DataTable value={data}>
      <Column
        field="firstName"
        header={t('Page.Draft.MyTeam.FirstName')}
        sortable
      />
      <Column
        field="lastName"
        header={t('Page.Draft.MyTeam.LastName')}
        sortable
      />
      <Column
        field="position"
        header={t('Page.Draft.MyTeam.Position')}
        sortable
      />
      <Column field="team" header={t('Page.Draft.MyTeam.Team')} sortable />
    </DataTable>
  );
};
