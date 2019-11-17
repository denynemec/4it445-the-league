import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Button } from '../atoms';

export const DraftPlayersTable = ({ draftPlayersList, selection }) => {
  const { t } = useTranslation();

  const [filterDraftPlayers, setFilterDraftPlayers] = useState('');
  const [filterPositions, setFilterPositions] = useState('');
  const [selectedRow, setSelectedRow] = useState('');

  const dataTableRef = useRef('');

  const mockDraftPlayersList = [
    {
      id: '3f6e8ca7-a109-4340-b9fd-fc2426f98fdb',
      firstName: 'Mohandas',
      lastName: 'McIntee',
      position: 'attack',
      team: 'China',
    },
    {
      id: 'f86afe0d-0338-4553-ba35-8ab7a64dbceb',
      firstName: 'Mohandas',
      lastName: 'McIntee',
      position: 'attack',
      team: 'China',
    },
    {
      id: '6d623009-ebd9-4a84-84b6-3284fcf80d2f',
      firstName: 'Sherri',
      lastName: 'Cicchelli',
      position: 'defense',
      team: 'Iran',
    },
    {
      id: 'f4da4366-27a3-40c1-af00-9e90a7e6ee84',
      firstName: 'Kippy',
      lastName: 'Ferrillio',
      position: 'attack',
      team: 'Germany',
    },
    {
      id: 'c07d19cb-ac85-4733-b495-dadfc88d52fe',
      firstName: 'Fulvia',
      lastName: 'Kindley',
      position: 'attack',
      team: 'Poland',
    },
    {
      id: 'e6d80ed5-ebd4-4824-931d-9a5ff0625d41',
      firstName: 'Laurena',
      lastName: 'Rabidge',
      position: 'goalkeeper',
      team: 'China',
    },
    {
      id: '7cbe84fd-2f0b-4bb6-8c11-cdbd81eee85e',
      firstName: 'Trudie',
      lastName: 'Kesteven',
      position: 'defense',
      team: 'China',
    },
    {
      id: 'd955c3c4-d42b-4bbf-93b3-085073e94c0d',
      firstName: 'Iago',
      lastName: 'Allcott',
      position: 'attack',
      team: 'China',
    },
    {
      id: '3822a662-8da5-4794-9eae-3c0de5538116',
      firstName: 'Rebe',
      lastName: 'Realph',
      position: 'defense',
      team: 'Cameroon',
    },
    {
      id: '4c339999-58e4-439c-887d-ba3d07348a7a',
      firstName: 'Casar',
      lastName: 'Strathdee',
      position: 'attack',
      team: 'Portugal',
    },
    {
      id: '34c50a31-97c6-4ccd-ae2d-87580223ba52',
      firstName: 'Dani',
      lastName: 'Gostyke',
      position: 'goalkeeper',
      team: 'Indonesia',
    },
    {
      id: '1d9b4d41-c019-41f6-a723-5a0322d59069',
      firstName: 'Loralee',
      lastName: 'Kingsly',
      position: 'attack',
      team: 'China',
    },
    {
      id: 'b9fe846f-2b47-4915-90ca-7a8c12ee954b',
      firstName: 'Helen',
      lastName: 'Thomann',
      position: 'goalkeeper',
      team: 'Switzerland',
    },
    {
      id: '1535570b-c72e-4611-9c9d-06ce25bbe8bd',
      firstName: 'Rorie',
      lastName: 'Triggle',
      position: 'attack',
      team: 'Morocco',
    },
    {
      id: '7023f125-603b-41f5-bff3-a939fc008caf',
      firstName: 'Vincents',
      lastName: 'Gilbard',
      position: 'attack',
      team: 'Ukraine',
    },
    {
      id: '044abe7d-fe48-42d1-a1bc-40b37a095c1b',
      firstName: 'Korey',
      lastName: 'Bourtoumieux',
      position: 'defense',
      team: 'Czech Republic',
    },
    {
      id: '67a153b7-9345-48fa-8ebb-35bfe9ba8189',
      firstName: 'Devonne',
      lastName: 'Lyngsted',
      position: 'defense',
      team: 'Malta',
    },
    {
      id: '5e0d40d8-51cf-4717-8ecd-a967c8df83fc',
      firstName: 'Hartley',
      lastName: "O' Culligan",
      position: 'defense',
      team: 'China',
    },
    {
      id: 'd70e2f5b-141b-4451-9d58-2ce685ac8cce',
      firstName: 'Ellie',
      lastName: 'Wesson',
      position: 'defense',
      team: 'Guatemala',
    },
    {
      id: '4dfc67b4-4c10-4ac7-9573-54ee31b7f174',
      firstName: 'Xenos',
      lastName: 'Shackel',
      position: 'defense',
      team: 'Cuba',
    },
    {
      id: '1e90d389-dea7-4879-840b-e275b28b8385',
      firstName: 'Madonna',
      lastName: 'Enoch',
      position: 'attack',
      team: 'Portugal',
    },
    {
      id: 'dd8dbe89-7f05-4231-b216-44cf5a743932',
      firstName: 'Malva',
      lastName: 'Lorenc',
      position: 'goalkeeper',
      team: 'Kazakhstan',
    },
    {
      id: 'a3f3519e-0a72-46ce-8187-69e3be63d13a',
      firstName: 'Patsy',
      lastName: 'Torrese',
      position: 'defense',
      team: 'China',
    },
    {
      id: '2682ca3d-1e5e-4c9a-a4fa-11c783310b16',
      firstName: 'Gloriane',
      lastName: 'Gammett',
      position: 'attack',
      team: 'Bulgaria',
    },
    {
      id: '1d07c6d2-d4bc-4650-81ba-fde9d8530f0d',
      firstName: 'Riley',
      lastName: 'Demschke',
      position: 'attack',
      team: 'United States',
    },
  ];

  const positionLov = [
    { label: 'attack', value: 'attack' },
    { label: 'defense', value: 'defense' },
    { label: 'goalkeeper', value: 'goalkeeper' },
  ];

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

  const footer = (
    <Button primary disabled={!selectedRow}>
      {t('Organisms.DraftPlayersTable.PickDraftPlayer')}
    </Button>
  );

  const header = (
    <div style={{ textAlign: 'left' }}>
      <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
      <InputText
        type="search"
        onInput={event => setFilterDraftPlayers(event.target.value)}
        placeholder={t(
          'Organisms.DraftPlayersTable.DraftPlayersFilterPlaceholder',
        )}
        size="50"
      />
    </div>
  );

  return (
    <DataTable
      value={mockDraftPlayersList}
      header={header}
      footer={footer}
      paginator={true}
      rows={10}
      rowsPerPageOptions={[10, 20, 50, 100]}
      currentPageReportTemplate="({currentPage}/{totalPages})"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      selectionMode="single"
      onSelectionChange={event => setSelectedRow(event.value)}
      selection={selectedRow}
      globalFilter={filterDraftPlayers}
      ref={dataTableRef}
    >
      <Column
        field="firstName"
        header={t('Organisms.DraftPlayersTable.FirstName')}
        sortable={true}
        filter={true}
      />
      <Column
        field="lastName"
        header={t('Organisms.DraftPlayersTable.LastName')}
        sortable={true}
        filter={true}
      />
      <Column
        field="position"
        header={t('Organisms.DraftPlayersTable.Position')}
        sortable={true}
        filter={true}
        filterElement={positionFilter}
      />
      <Column
        field="team"
        header={t('Organisms.DraftPlayersTable.Team')}
        sortable={true}
        filter={true}
      />
    </DataTable>
  );
};
