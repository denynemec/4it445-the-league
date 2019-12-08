import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Button } from 'reactstrap';

export const DraftPlayersTable = ({
  draftPlayersList,
  positions,
  isDisabled,
}) => {
  const { t } = useTranslation();

  const [filterDraftPlayers, setFilterDraftPlayers] = useState('');
  const [filterPositions, setFilterPositions] = useState(null);
  const [selectedRow, setSelectedRow] = useState('');

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

  const footer = (
    <Button
      color="primary"
      disabled={!selectedRow || selectedRow.selected || isDisabled}
    >
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
      paginator
      rows={10}
      rowsPerPageOptions={[10, 20, 50, 100]}
      currentPageReportTemplate={t('Page.Draft.DraftPlayersTable.PageReport')}
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      selectionMode="single"
      onSelectionChange={event => !isDisabled && setSelectedRow(event.value)}
      selection={selectedRow}
      globalFilter={filterDraftPlayers}
      ref={dataTableRef}
      rowClassName={disabledRowsClass}
      responsive
    >
      <Column
        field="firstName"
        header={t('Page.Draft.DraftPlayersTable.FirstName')}
        sortable
        filter
      />
      <Column
        field="lastName"
        header={t('Page.Draft.DraftPlayersTable.LastName')}
        sortable
        filter
      />
      <Column
        field="position"
        header={t('Page.Draft.DraftPlayersTable.Position')}
        sortable
        filter
        filterElement={positionFilter}
      />
      <Column
        field="team"
        header={t('Page.Draft.DraftPlayersTable.Team')}
        sortable
        filter
      />
    </DataTable>
  );
};
