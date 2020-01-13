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

export const NominationTable = ({
  playersList,
  positions,
  isDisabled,
  matchId,
  currentTab,
  onChangeUpdateState,
  switchTo,
}) => {
  const { t } = useTranslation();
  const { lobbyId } = useParams();

  const [filterDraftPlayers, setFilterDraftPlayers] = useState('');
  const [filterPositions, setFilterPositions] = useState(null);
  const [selectedRows, setSelectedRows] = useState('');

  const dataTableRef = useRef('');

  const nominationRequest = useRequest();

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
          'Page.Draft.DraftPlayersTable.DraftPlayersFilterPlaceholder',
        )}
        size="50"
      />
    </div>
  );

  const disabledRowsClass = rowData => {
    return { 'p-disabled': rowData.selected };
  };

  const nominatePlayer = () => {
    selectedRows.forEach(row => {
      nominationRequest.request(ENDPOINTS.nominatePlayer(lobbyId), {
        method: 'POST',
        data: { playerId: row.playerId, matchId: matchId },
      });
    });
  };

  const removePlayerNomination = () => {
    selectedRows.forEach(row => {
      nominationRequest.request(ENDPOINTS.removePlayerNomination(lobbyId), {
        method: 'DELETE',
        data: { playerId: row.playerId, matchId: matchId },
      });
    });
  };

  const updateTable = (oldTab, newTab) => {
    if (oldTab.value === 'Drafted') nominatePlayer();
    else if (oldTab.value === 'Nominated') removePlayerNomination();
    onChangeUpdateState(newTab);
  };

  const footer = (
    <>
      <Button
        color="primary"
        disabled={
          !selectedRows ||
          !selectedRows.length ||
          selectedRows.selected ||
          isDisabled ||
          nominationRequest.isLoading
        }
        onClick={() => updateTable(currentTab, switchTo)}
      >
        {currentTab.value === 'Drafted'
          ? t('Page.Nomination.NominatePlayer')
          : currentTab.value === 'Nominated'
          ? t('Page.Nomination.RemovePlayerNomination')
          : t('Page.Nomination.Other')}
      </Button>
      <div style={{ textAlign: 'left' }}>{selectedRows.length}</div>
    </>
  );

  return (
    <DataTable
      value={playersList}
      header={header}
      footer={currentTab.value === 'ConfirmedNomination' ? null : footer}
      rows={18}
      currentPageReportTemplate={t('Page.Draft.DraftPlayersTable.PageReport')}
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      selectionMode="multiple"
      metaKeySelection={false}
      onSelectionChange={event => !isDisabled && setSelectedRows(event.value)}
      selection={selectedRows}
      globalFilter={filterDraftPlayers}
      ref={dataTableRef}
      rowClassName={disabledRowsClass}
      responsive
    >
      <Column selectionMode="multiple" style={{ width: '44px' }} />
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
