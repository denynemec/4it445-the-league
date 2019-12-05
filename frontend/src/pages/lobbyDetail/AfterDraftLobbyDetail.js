import React from 'react';
import { useTranslation } from 'react-i18next';

import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

export const AfterDraftLobbyDetail = ({ data }) => {
  const mockData = [
    {
      user_id: 1,
      note: 1,
      result: 1,
    },
    {
      user_id: 2,
      note: 1,
      result: 2,
    },
    {
      user_id: 3,
      note: 1,
      result: 4,
    },
    {
      user_id: 1,
      note: 2,
      result: 11,
    },
    {
      user_id: 2,
      note: 2,
      result: 22,
    },
    {
      user_id: 3,
      note: 2,
      result: 44,
    },
  ];

  // const { t } = useTranslation();

  const testData = mockData.reduce((noteMap, { result, note, user_id }) => {
    const currentPlayerResult = { [user_id]: result };

    const currentNoteValues = noteMap.get(note);

    if (typeof currentNoteValues !== 'undefined') {
      const updatedCurrentNote = {
        ...currentNoteValues,
        ...currentPlayerResult,
        note,
      };

      return noteMap.set(note, updatedCurrentNote);
    } else {
      return noteMap.set(note, { ...currentPlayerResult, note });
    }
  }, new Map());

  const reducedTestData = Array.from(testData.values()).sort(
    (a, b) => a.note - b.note,
  );

  // next ugly transform

  const uglyTransformedData = reducedTestData.map(({ note, ...results }) => {
    const newResult = { note };

    const otherPlayersCount = Object.keys(results).length - 1;

    for (let key in results) {
      if (results.hasOwnProperty(key)) {
        const resultWithoutCurrentUserValue = { ...results, [key]: 0 };

        const otherUsersSum = Object.values(
          resultWithoutCurrentUserValue,
        ).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        const newResultValue =
          (results[key] - otherUsersSum) / otherPlayersCount;

        newResult[key] = newResultValue;
      }
    }

    return newResult;
  });

  console.log(uglyTransformedData);

  let cols = [
    { field: 'username', header: 'Page.PlayersTableHeader.PlayerName' },
    { field: 'team', header: 'Page.PlayersTableHeader.Team' },
  ];

  let dynamicColumns = cols.map((col, i) => {
    return <Column key={col.field} field={col.field} header={col.header} />;
  });

  return <DataTable value={mockData}>{dynamicColumns}</DataTable>;
};
