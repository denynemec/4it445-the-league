import React, { useState, useRef } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useTranslation } from 'react-i18next';
import { ColumnGroup } from 'primereact/columngroup';
import { MultiSelect } from 'primereact/multiselect';
import { Row } from 'primereact/row';

export const PlayersTable = ({ players }) => {
  const { t } = useTranslation();
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

  const [posValue, setPosValue] = useState(null);
  const [teamValue, setTeamValue] = useState(null);
  const dt = useRef('');

  const resultsHeader = [];
  const names = [];
  const roundTranslated = t('Page.PlayersTableHeader.Round');

  // filter and select all unique rounds
  const countRounds = players
    .map(rnd => rnd.note)
    .filter((value, index, self) => self.indexOf(value) === index);

  // get the number of rounds
  const rounds = Object.keys(countRounds).length;

  // push columns for goals, assists, wins and clean sheets to header and to columns
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

  // push number of rounds to columns

  for (let i = 1; i <= rounds; i++) {
    cols.push({
      field: roundTranslated + i,
      header: roundTranslated + ' ' + i,
    });
  }

  // function to make an array of unique players from raw data from database

  const map = new Map();
  for (const plr of players) {
    if (!map.has(plr.player_id)) {
      map.set(plr.player_id, true); // set any value to Map
      names.push({
        playerId: plr.player_id,
        playerName: plr.firstname + ' ' + plr.lastname,
        team: plr.team,
        position: plr.post,
      });
    }
  }

  // function to push stats of players to an array
  const playersStats = [];
  for (let i = 1; i <= rounds; i++) {
    players.map(plr => {
      if (i === parseInt(plr.note)) {
        let playerStats = {};
        let playerId = 'playerId';
        let goals = 'G' + i;
        let assists = 'A' + i;
        let win = 'V' + i;
        let clean_sheet = 'K' + i;

        playerStats[playerId] = plr.player_id;
        playerStats[goals] = plr.goal;
        playerStats[assists] = plr.assist;
        playerStats[win] = plr.win;
        playerStats[clean_sheet] = plr.clean_sheet;
        playersStats.push(playerStats);
      }
      return playersStats;
    });
  }

  let iteratorDynamicCols = 1;
  const dynamicColumns = cols.map(col => {
    if (col.field === roundTranslated + iteratorDynamicCols) {
      iteratorDynamicCols++;
      return null;
    }
    return (
      <Column key={col.field} field={col.field} style={{ width: '120px' }} />
    );
  });

  // custom filters for columns
  const positions = [];
  const teams = [];

  const uniquePositions = players
    .map(plrPost => plrPost.post)
    .filter((value, index, self) => self.indexOf(value) === index);
  // filter and select all unique teams
  const uniqueTeams = players
    .map(unTeam => unTeam.team)
    .filter((value, index, self) => self.indexOf(value) === index);

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

  const onPosChange = event => {
    setPosValue(event.target.value);
    dt.current.filter(event.target.value, 'position', 'in');
  };
  const onTeamChange = event => {
    setTeamValue(event.target.value);
    dt.current.filter(event.target.value, 'team', 'in');
  };

  const positionFilter = (
    <MultiSelect
      style={{ width: '100%' }}
      value={posValue}
      options={positions}
      onChange={onPosChange}
    />
  );
  const teamFilter = (
    <MultiSelect
      style={{ width: '100%' }}
      value={teamValue}
      options={teams}
      onChange={onTeamChange}
    />
  );

  // creates the first row of header of the table
  let iteratorHeaderRound = 1;
  const rowHeaderGroup = cols.map(col => {
    if (
      col.field === 'playerName' ||
      col.field === 'earnings' ||
      col.field === 'earningsPercent' ||
      col.field === 'profitLoss'
    ) {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={t(col.header)}
          rowSpan={2}
          sortable
          filter
        />
      );
    } else if (col.field === 'position') {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={t(col.header)}
          rowSpan={2}
          sortable
          filter
          filterElement={positionFilter}
          style={{ width: '150px' }}
        />
      );
    } else if (col.field === 'team') {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={t(col.header)}
          rowSpan={2}
          sortable
          filter
          filterElement={teamFilter}
          style={{ width: '150px' }}
        />
      );
    } else if (col.field === roundTranslated + iteratorHeaderRound) {
      iteratorHeaderRound++;
      return (
        <Column
          key={col.field}
          field={col.field}
          header={t(col.header)}
          colSpan={5}
        />
      );
    } else {
      return null;
    }
  });

  // creates the second row of header of the table

  const hgavkHeaderGroup = resultsHeader.map(col => {
    return <Column key={col.field} header={col.header} />;
  });

  // assembled header
  const headerGroup = (
    <ColumnGroup>
      <Row>{rowHeaderGroup}</Row>
      <Row>{hgavkHeaderGroup}</Row>
    </ColumnGroup>
  );

  // merge arrays ? questionable functionality
  const output = [];

  // merge arrays of players and their stats by using their id
  names.forEach(plr => {
    playersStats.forEach(res => {
      if (plr.playerId === res.playerId) {
        let temp = { ...res, ...plr };
        output.push(temp);
      }
    });
  });

  // merge players and their stats for all rounds
  const mergedPlayersAndStats = [];
  let maxLength = 0;
  for (let i = 0; i < output.length; i++) {
    for (let j = 1; j < output.length; j++) {
      if (output[i].playerId === output[j].playerId) {
        let temp = { ...output[i], ...output[j] };
        let lengthOfObject = Object.keys(temp).length;
        if (maxLength < lengthOfObject) {
          maxLength = lengthOfObject;
        }
        mergedPlayersAndStats.push(temp);
      }
    }
  }

  const rightLength = [];

  // select only players that have complete stats
  mergedPlayersAndStats.forEach(plr => {
    if (Object.keys(plr).length === maxLength) {
      rightLength.push(plr);
    }
  });

  // delete all duplicates
  const finalOutput = [];
  const map1 = new Map();
  for (const plr of rightLength) {
    if (!map1.has(plr.playerId)) {
      map1.set(plr.playerId, true); // set any value to Map
      finalOutput.push(plr);
    }
  }

  return (
    <DataTable
      ref={dt}
      value={finalOutput}
      responsive={true}
      scrollable={true}
      headerColumnGroup={headerGroup}
    >
      {dynamicColumns}
    </DataTable>
  );
};
