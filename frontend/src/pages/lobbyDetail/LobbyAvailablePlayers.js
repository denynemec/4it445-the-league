import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';

export const LobbyAvailablePlayers = ({
  draftPlayersList,
  positionLov,
  loading,
}) => {
  const { t } = useTranslation();

  const [filterDraftPlayers, setFilterDraftPlayers] = useState('');
  const [filterPositions, setFilterPositions] = useState(null);

  const dataTableRef = useRef('');

  // Data template
  // const mockDraftPlayersList = [
  //   {
  //     id: '51cb9d0c-f172-48de-ab72-6fe8871c87ad',
  //     firstName: 'Raffarty',
  //     lastName: 'McGlue',
  //     position: 'defense',
  //     team: 'KE',
  //     selected: false,
  //   },
  // ];
  //
  // const mockPositionLov = [
  //   { label: 'attack', value: 'attack' },
  //   { label: 'defense', value: 'defense' },
  //   { label: 'goalkeeper', value: 'goalkeeper' },
  // ];

  const positionFilter = (
    <MultiSelect
      style={{ width: '100%' }}
      className="ui-column-filter"
      value={filterPositions}
      options={positionLov}
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
          'Page.LobbyDetail.LobbyAvailablePlayers.PlayersFilterPlaceholder',
        )}
        size="50"
      />
    </div>
  );

  return (
    <DataTable
      value={draftPlayersList}
      header={header}
      paginator={true}
      rows={10}
      rowsPerPageOptions={[10, 20, 50, 100]}
      currentPageReportTemplate={t(
        'Page.LobbyDetail.LobbyAvailablePlayers.PageReport',
      )}
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      globalFilter={filterDraftPlayers}
      ref={dataTableRef}
      loading={loading}
    >
      <Column
        field="firstName"
        header={t('Page.LobbyDetail.LobbyAvailablePlayers.FirstName')}
        sortable={true}
        filter={true}
      />
      <Column
        field="lastName"
        header={t('Page.LobbyDetail.LobbyAvailablePlayers.LastName')}
        sortable={true}
        filter={true}
      />
      <Column
        field="position"
        header={t('Page.LobbyDetail.LobbyAvailablePlayers.Position')}
        sortable={true}
        filter={true}
        filterElement={positionFilter}
      />
      <Column
        field="team"
        header={t('Page.LobbyDetail.LobbyAvailablePlayers.Team')}
        sortable={true}
        filter={true}
      />
    </DataTable>
  );
};
