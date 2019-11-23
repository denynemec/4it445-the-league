import React, { useRef, useState } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useTranslation } from 'react-i18next';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';

export const PlayersTable = ({ players }) => {
  const { t } = useTranslation();
  const rounds = 5;
  const cols = [
    { field: 'playerName', header: 'Page.PlayersTableHeader.PlayerName' },
    { field: 'team', header: 'Page.PlayersTableHeader.Team' },
    { field: 'position', header: 'Page.PlayersTableHeader.Position' },
    { field: 'earnings', header: 'Page.PlayersTableHeader.Earnings' },
    {
      field: 'earningsPercent',
      header: 'Page.PlayersTableHeader.EarningsPercent',
    },
    { field: 'profitLoss', header: 'Page.PlayersTableHeader.ProfitLoss' },
  ];

  const resultsHeader = [];

  const names = [];
  const positions = [];
  const teams = [];

  for (let i = 1; i <= rounds; i++) {
    cols.push({ field: 'H' + i, header: 'H' });
    resultsHeader.push({ field: 'H' + i, header: 'H' });
    cols.push({ field: 'G' + i, header: 'G' });
    resultsHeader.push({ field: 'G' + i, header: 'G' });
    cols.push({ field: 'A' + i, header: 'A' });
    resultsHeader.push({ field: 'A' + i, header: 'A' });
    cols.push({ field: 'V' + i, header: 'V' });
    resultsHeader.push({ field: 'V' + i, header: 'V' });
    cols.push({ field: 'K' + i, header: 'K' });
    resultsHeader.push({ field: 'K' + i, header: 'K' });
  }

  for (let i = 1; i <= rounds; i++) {
    cols.push({ field: 'Kolo' + i, header: 'Kolo ' + i });
  }

  // filter and select all unique positions
  const uniquePositions = players
    .map(plrPost => plrPost.post)
    .filter((value, index, self) => self.indexOf(value) === index);

  // filter and select all unique teams
  const uniqueTeams = players
    .map(unTeam => unTeam.team)
    .filter((value, index, self) => self.indexOf(value) === index);

  // function to make an array of players from raw data from database

  players.map(plr => {
    names.push({
      playerName: plr.firstname + ' ' + plr.lastname,
      team: plr.team,
      position: plr.post,
      earnings: null,
      earningsPercent: null,
      profitLoss: null,
    });
    return names;
  });

  // put filtered values into positionFilter

  uniquePositions.map(pos => {
    positions.push({ label: pos, value: pos });
    return positions;
  });

  // put filtered values into teamFilter

  uniqueTeams.map(pos => {
    teams.push({ label: pos, value: pos });
    return teams;
  });

  let iteratorDynamicCols = 1;
  let iteratorResults = -1;
  let iteratorArr = [1, 1, 1, 1, 1];
  const dynamicColumns = cols.map(col => {
    if (col.field === 'Kolo' + iteratorDynamicCols) {
      iteratorDynamicCols++;
      return null;
    }
    if (
      col.field === 'H' + iteratorArr[iteratorResults] ||
      col.field === 'G' + iteratorArr[iteratorResults] ||
      col.field === 'A' + iteratorArr[iteratorResults] ||
      col.field === 'V' + iteratorArr[iteratorResults] ||
      col.field === 'K' + iteratorArr[iteratorResults]
    ) {
      iteratorArr[iteratorResults] = iteratorResults++;
    }
    return (
      <Column
        key={col.field}
        field={col.field}
        // header={t(col.header)}
        style={{ width: '150px' }}
      />
    );
  });

  let iteratorHeaderRound = 1;
  const rowHeaderGroup = cols.map(col => {
    if (
      col.field === 'playerName' ||
      col.field === 'team' ||
      col.field === 'position' ||
      col.field === 'earnings' ||
      col.field === 'earningsPercent' ||
      col.field === 'profitLoss'
    ) {
      return <Column key={col.field} header={t(col.header)} rowSpan={2} />;
    } else if (col.field === 'Kolo' + iteratorHeaderRound) {
      iteratorHeaderRound++;
      return <Column key={col.field} header={t(col.header)} colSpan={5} />;
    } else {
      return null;
    }
  });

  const hgavkHeaderGroup = resultsHeader.map(col => {
    return <Column key={col.field} header={col.header} />;
  });

  const headerGroup = (
    <ColumnGroup>
      <Row>{rowHeaderGroup}</Row>
      <Row>{hgavkHeaderGroup}</Row>
    </ColumnGroup>
  );

  return (
    <DataTable
      value={names}
      responsive={true}
      // ref={dt}
      scrollable={true}
      headerColumnGroup={headerGroup}
      // style={{ width: '800px' }}
      // frozenWidth="600px"
      // unfrozenWidth="100px"
    >
      {dynamicColumns}
    </DataTable>
  );
};

// const hgavkColumns = resultsHeader.map(col => {
//   return <Column key={col.field} field={col.field} />;
// });

//   'playerName', header: 'Page.PlayersTableHeader.PlayerName' },
// { field: 'team', header: 'Page.PlayersTableHeader.Team' },
// { field: 'position', header: 'Page.PlayersTableHeader.Position' },
// { field: 'earnings', header: 'Page.PlayersTableHeader.Earnings' },
// {
//   field: 'earningsPercent',
//   header: 'Page.PlayersTableHeader.EarningsPercent',
// },
// { field: 'profitLoss
