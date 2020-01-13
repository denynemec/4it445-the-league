import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Button } from 'reactstrap';

import { useRequest } from '../../utils/request';
import ENDPOINTS from '../../endpoints';

export const DraftPlayersTable = ({
  draftPlayersList,
  positions,
  teams,
  isDisabled,
  userOnTurn,
}) => {
  const { t } = useTranslation();
  const { lobbyId } = useParams();

  const [filterDraftPlayers, setFilterDraftPlayers] = useState('');
  const [filterPositions, setFilterPositions] = useState(null);
  const [filterTeams, setFilterTeams] = useState(null);
  const [selectedRow, setSelectedRow] = useState('');

  const dataTableRef = useRef('');

  const pickPlayerState = useRequest();

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

  const teamFilter = (
    <MultiSelect
      style={{ width: '100%' }}
      className="ui-column-filter"
      value={filterTeams}
      options={teams}
      onChange={event => {
        setFilterTeams(event.target.value);

        dataTableRef.current.filter(event.target.value, 'team', 'in');
      }}
    />
  );

  const footer = userOnTurn && (
    <Button
      color="primary"
      disabled={
        !selectedRow ||
        selectedRow.selected ||
        isDisabled ||
        pickPlayerState.isLoading
      }
      onClick={() =>
        pickPlayerState.request(ENDPOINTS.pickPlayer(lobbyId), {
          method: 'POST',
          data: { playerId: selectedRow.playerId },
        })
      }
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
        filterElement={teamFilter}
      />
    </DataTable>
  );
};
