import React from 'react';
import { useTranslation } from 'react-i18next';

import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

export const AfterDraftLobbyDetail = ({ data }) => {
  const mockData = [
    {
      user_id: 3,
      user_name: 'user3',
      note: 7,
      result: 41,
    },
    {
      user_id: 3,
      user_name: 'user3',
      note: 3,
      result: 66,
    },
    {
      user_id: 3,
      user_name: 'user3',
      note: 8,
      result: 97,
    },
    {
      user_id: 3,
      user_name: 'user3',
      note: 2,
      result: 25,
    },
    {
      user_id: 4,
      user_name: 'user4',
      note: 4,
      result: 32,
    },
    {
      user_id: 4,
      user_name: 'user4',
      note: 7,
      result: 55,
    },
    {
      user_id: 1,
      user_name: 'user1',
      note: 3,
      result: 72,
    },
    {
      user_id: 1,
      user_name: 'user1',
      note: 8,
      result: 73,
    },
    {
      user_id: 3,
      user_name: 'user3',
      note: 5,
      result: 2,
    },
    {
      user_id: 3,
      user_name: 'user3',
      note: 6,
      result: 14,
    },
  ];

  const { t } = useTranslation();

  console.log(mockData.map());

  let cols = [
    { field: 'username', header: 'Page.PlayersTableHeader.PlayerName' },
    { field: 'team', header: 'Page.PlayersTableHeader.Team' },
  ];

  let dynamicColumns = cols.map((col, i) => {
    return <Column key={col.field} field={col.field} header={col.header} />;
  });

  return <DataTable value={mockData}>{dynamicColumns}</DataTable>;
};
