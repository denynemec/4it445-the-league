import React from 'react';
// import { MultiSelect } from 'primereact/multiselect';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useTranslation } from 'react-i18next';
import { ColumnGroup } from 'primereact/columngroup';
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

  const resultsHeader = [];
  const names = [];

  // filter and select all rounds
  const countRounds = players
    .map(rnd => rnd.note)
    .filter((value, index, self) => self.indexOf(value) === index);

  const rounds = Object.keys(countRounds).length;

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

  // function to make an array of players from raw data from database

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

  const gggg = [];
  // for (let i = 1; i <= rounds; i++) {
  //   players.map(plr => {
  //     if (i === parseInt(plr.note)) {
  //       let playerStats = {};
  //       let goals = 'G' + i;
  //       let assists = 'A' + i;
  //       let win = 'V' + i;
  //       let clean_sheet = 'K' + i;
  //
  //       playerStats[goals] = plr.goal;
  //       playerStats[assists] = plr.assist;
  //       playerStats[win] = plr.win;
  //       playerStats[clean_sheet] = plr.clean_sheet;
  //       gggg.push(playerStats);
  //     }
  //   });
  // }

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
        gggg.push(playerStats);
      }
      return gggg;
    });
  }

  console.log('gggg', gggg);

  // const map = new Map();
  // for (const plr of players) {
  //   if (!map.has(plr.player_id)) {
  //     map.set(plr.player_id, true); // set any value to Map
  //     names.push({
  //       playerName: plr.firstname + ' ' + plr.lastname,
  //       team: plr.team,
  //       position: plr.post,
  //     });
  //   }
  // }

  console.log('names: ', names);
  console.log('players: ', players);
  // players.map(plr => {
  //   gg.map(rd => {});
  // });

  // players.map(plr => {
  //   for (let i = 1; i <= rounds; i++) {
  //     gg.push({
  //       G: plr.H,
  //     });
  //   }
  // });

  // console.log('gg:', gg);

  // players.map(plr => {
  //   names.push({
  //     playerName: plr.firstname + ' ' + plr.lastname,
  //     team: plr.team,
  //     position: plr.post,
  //     // earnings: null,
  //     // earningsPercent: null,
  //     // profitLoss: null,
  //   });
  //   return names;
  // });

  let iteratorDynamicCols = 1;
  // let iteratorResults = 0;
  // let iteratorArr = [1, 1, 1, 1, 1];
  const dynamicColumns = cols.map(col => {
    if (col.field === 'Kolo' + iteratorDynamicCols) {
      iteratorDynamicCols++;
      return null;
    }
    // if (
    //   col.field === 'H' + iteratorArr[iteratorResults] ||
    //   col.field === 'G' + iteratorArr[iteratorResults] ||
    //   col.field === 'A' + iteratorArr[iteratorResults] ||
    //   col.field === 'V' + iteratorArr[iteratorResults] ||
    //   col.field === 'K' + iteratorArr[iteratorResults]
    // ) {
    //   iteratorArr[iteratorResults] = iteratorResults++;
    // }
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

  // console.log('cols', cols);

  // const bla = names.concat(gggg);

  // const output = [...names, ...gggg];
  const output = [];

  names.map(plr => {
    gggg.map(res => {
      if (plr.playerId === res.playerId) {
        let temp = { ...res, ...plr };
        output.push(temp);
      }
    });
  });

  console.log('names', names);
  console.log('output', output);

  // const output = [];
  // bla.forEach(function(item) {
  //   let existing = output.filter(function(v, i) {
  //     return v.name == item.name;
  //   });
  //   if (existing.length) {
  //     var existingIndex = output.indexOf(existing[0]);
  //     output[existingIndex].value = output[existingIndex].playerId.concat(
  //       item.playerId,
  //     );
  //   } else {
  //     if (typeof item.playerId == 'string') item.playerId = [item.playerId];
  //     output.push(item);
  //   }
  // });

  // console.log('output:', output);
  return (
    <DataTable
      value={output}
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
