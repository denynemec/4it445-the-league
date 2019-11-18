import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Button } from '../../atoms';

export const DraftPlayersTable = ({
  draftPlayersList,
  positionLov,
  selection,
  loading,
}) => {
  const { t } = useTranslation();

  const [filterDraftPlayers, setFilterDraftPlayers] = useState('');
  const [filterPositions, setFilterPositions] = useState(null);
  const [selectedRow, setSelectedRow] = useState('');

  const dataTableRef = useRef('');

  //Data template
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

  const footer = (
    <Button primary disabled={!selectedRow || selectedRow.selected}>
      {t('Page.Draft.DraftPlayersTable.PickDraftPlayer')}
    </Button>
  );

  const header = (
    <div style={{ textAlign: 'left' }}>
      <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
      <InputText
        type="search"
        onInput={event => setFilterDraftPlayers(event.target.value)}
        placeholder={t(
          'Page.Draft.DraftPlayersTable.DraftPlayersFilterPlaceholder',
        )}
        size="50"
      />
    </div>
  );

  const disabledRowsClass = rowData => {
    return { 'p-disabled': rowData.selected };
  };

  return (
    <DataTable
      value={draftPlayersList}
      header={header}
      footer={footer}
      paginator={true}
      rows={10}
      rowsPerPageOptions={[10, 20, 50, 100]}
      currentPageReportTemplate={t('Page.Draft.DraftPlayersTable.PageReport')}
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      selectionMode="single"
      onSelectionChange={event => setSelectedRow(event.value)}
      selection={selectedRow}
      globalFilter={filterDraftPlayers}
      ref={dataTableRef}
      loading={loading}
      rowClassName={disabledRowsClass}
    >
      <Column
        field="firstName"
        header={t('Page.Draft.DraftPlayersTable.FirstName')}
        sortable={true}
        filter={true}
      />
      <Column
        field="lastName"
        header={t('Page.Draft.DraftPlayersTable.LastName')}
        sortable={true}
        filter={true}
      />
      <Column
        field="position"
        header={t('Page.Draft.DraftPlayersTable.Position')}
        sortable={true}
        filter={true}
        filterElement={positionFilter}
      />
      <Column
        field="team"
        header={t('Page.Draft.DraftPlayersTable.Team')}
        sortable={true}
        filter={true}
      />
    </DataTable>
  );
};
