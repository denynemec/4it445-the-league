import React from 'react';
import { useTranslation } from 'react-i18next';

import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Heading, Layout } from '../../atoms';

export const AfterDraftLobbyDetail = ({
  profitsPerRound,
  usersInNomination,
}) => {
  const { t } = useTranslation();

  const roundColumn = {
    key: 'note',
    field: 'note',
    style: 'p-datatable-header',
  };
  const cols = usersInNomination.map((lobbyUser, i) => {
    const column = {
      key: lobbyUser.user_id,
      field: lobbyUser.user_id.toString(),
      header: lobbyUser.nickname,
    };
    return column;
  });

  const dynamicColumnsHeaders = cols.map((col, i) => {
    return <Column key={col.field} header={t(col.header)} />;
  });

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header={t('Page.AfterDraftLobbyDetail.Note')} rowSpan={2} />
        <Column
          header={t('Page.AfterDraftLobbyDetail.Users')}
          colSpan={usersInNomination.length}
        />
      </Row>
      <Row>{dynamicColumnsHeaders}</Row>
    </ColumnGroup>
  );

  const lastRowFooter = rowData => {
    return {
      'p-datatable-footer':
        rowData.note === 'Page.AfterDraftLobbyDetail.Notes.total',
    };
  };

  const translatedRound = rowData => {
    return <span>{t(rowData.note)}</span>;
  };
  cols.unshift(roundColumn);

  const dynamicColumns = cols.map((col, i) => {
    if (col.field === 'note') {
      return (
        <Column
          key={col.field}
          field={col.field}
          style={{ fontWeight: 'bold', textAlign: 'center' }}
          body={translatedRound}
        />
      );
    } else {
      return <Column key={col.field} field={col.field} />;
    }
  });

  return (
    <>
      <Layout pt3>
        <Heading className="flex justify-center pb2" size="md">
          {t('Page.AfterDraftLobbyDetail.Header')}
        </Heading>
        <DataTable
          value={profitsPerRound}
          headerColumnGroup={headerGroup}
          rowClassName={lastRowFooter}
          responsive
        >
          {dynamicColumns}
        </DataTable>
      </Layout>
    </>
  );
};
