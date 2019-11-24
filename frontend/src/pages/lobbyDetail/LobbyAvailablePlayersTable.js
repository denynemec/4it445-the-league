import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';

export const LobbyAvailablePlayersTable = ({
  lobbyPlayersList,
  positions,
  loading,
}) => {
  const { t } = useTranslation();

  const [filterDraftPlayers, setFilterDraftPlayers] = useState('');
  const [filterPositions, setFilterPositions] = useState(null);

  const dataTableRef = useRef('');

  const positionFilter = (
    <MultiSelect
      style={{ width: '100%' }}
      className="ui-column-filter"
      value={filterPositions}
      options={positions}
      onChange={event => {
        setFilterPositions(event.target.value);

        dataTableRef.current.filter(event.target.value, 'position', 'in');
      }}
    />
  );

  const header = (
    <div style={{ textAlign: 'left' }}>
      <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
      <InputText
        type="search"
        onInput={event => setFilterDraftPlayers(event.target.value)}
        placeholder={t(
          'Page.LobbyDetail.LobbyAvailablePlayersTable.PlayersFilterPlaceholder',
        )}
        size="50"
      />
    </div>
  );

  return (
    <DataTable
      value={lobbyPlayersList}
      header={header}
      paginator
      rows={10}
      rowsPerPageOptions={[10, 20, 50, 100]}
      currentPageReportTemplate={t(
        'Page.LobbyDetail.LobbyAvailablePlayersTable.PageReport',
      )}
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      globalFilter={filterDraftPlayers}
      ref={dataTableRef}
      loading={loading}
    >
      <Column
        field="firstName"
        header={t('Page.LobbyDetail.LobbyAvailablePlayersTable.FirstName')}
        sortable
        filter
      />
      <Column
        field="lastName"
        header={t('Page.LobbyDetail.LobbyAvailablePlayersTable.LastName')}
        sortable
        filter
      />
      <Column
        field="position"
        header={t('Page.LobbyDetail.LobbyAvailablePlayersTable.Position')}
        sortable
        filter
        filterElement={positionFilter}
      />
      <Column
        field="team"
        header={t('Page.LobbyDetail.LobbyAvailablePlayersTable.Team')}
        sortable
        filter
      />
    </DataTable>
  );
};
