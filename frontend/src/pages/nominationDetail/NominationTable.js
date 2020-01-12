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
  action,
  onChange,
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

  const updateNominationState = () => {
    onChange();
  };

  const onClick = () => {
    if (action === 'nominate') nominatePlayer();
    else if (action === 'unnominate') removePlayerNomination();
    updateNominationState();
  };

  const footer = (
    <Button
      color="primary"
      disabled={
        !selectedRows ||
        !selectedRows.length ||
        selectedRows.selected ||
        isDisabled ||
        nominationRequest.isLoading
      }
      onClick={onClick}
    >
      {t('Page.Draft.DraftPlayersTable.PickDraftPlayer')}
    </Button>
  );

  return (
    <DataTable
      value={playersList}
      header={header}
      footer={footer}
      paginator
      rows={10}
      rowsPerPageOptions={[10, 20, 50, 100]}
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
