import React from 'react';
import { useTranslation } from 'react-i18next';

import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Heading, Layout } from '../../atoms';

export const AfterDraftLobbyDetail = ({
  realProfitsPerRound,
  usersInLobby,
}) => {
  const mockData = [
    {
      user_id: 1,
      note: 1,
      result: 210,
    },
    {
      user_id: 2,
      note: 1,
      result: 450,
    },
    {
      user_id: 3,
      note: 1,
      result: 540,
    },
    {
      user_id: 4,
      note: 1,
      result: 300,
    },
    {
      user_id: 5,
      note: 1,
      result: 750,
    },
    {
      user_id: 6,
      note: 1,
      result: 510,
    },
    {
      user_id: 7,
      note: 1,
      result: 690,
    },
    {
      user_id: 1,
      note: 2,
      result: 510,
    },
    {
      user_id: 2,
      note: 2,
      result: 510,
    },
    {
      user_id: 3,
      note: 2,
      result: 510,
    },
    {
      user_id: 4,
      note: 2,
      result: 540,
    },
    {
      user_id: 5,
      note: 2,
      result: 150,
    },
    {
      user_id: 6,
      note: 2,
      result: 270,
    },
    {
      user_id: 7,
      note: 2,
      result: 360,
    },
    {
      user_id: 1,
      note: 3,
      result: 750,
    },
    {
      user_id: 2,
      note: 3,
      result: 300,
    },
    {
      user_id: 3,
      note: 3,
      result: 720,
    },
    {
      user_id: 4,
      note: 3,
      result: 420,
    },
    {
      user_id: 5,
      note: 3,
      result: 720,
    },
    {
      user_id: 6,
      note: 3,
      result: 570,
    },
    {
      user_id: 7,
      note: 3,
      result: 540,
    },
    {
      user_id: 1,
      note: 4,
      result: 180,
    },
    {
      user_id: 2,
      note: 4,
      result: 570,
    },
    {
      user_id: 3,
      note: 4,
      result: 300,
    },
    {
      user_id: 4,
      note: 4,
      result: 150,
    },
    {
      user_id: 5,
      note: 4,
      result: 60,
    },
    {
      user_id: 6,
      note: 4,
      result: 150,
    },
    {
      user_id: 7,
      note: 4,
      result: 900,
    },
    {
      user_id: 1,
      note: 5,
      result: 330,
    },
    {
      user_id: 2,
      note: 5,
      result: 420,
    },
    {
      user_id: 3,
      note: 5,
      result: 600,
    },
    {
      user_id: 4,
      note: 5,
      result: 510,
    },
    {
      user_id: 5,
      note: 5,
      result: 600,
    },
    {
      user_id: 6,
      note: 5,
      result: 450,
    },
    {
      user_id: 7,
      note: 5,
      result: 540,
    },
    {
      user_id: 1,
      note: 6,
      result: 690,
    },
    {
      user_id: 2,
      note: 6,
      result: 660,
    },
    {
      user_id: 3,
      note: 6,
      result: 600,
    },
    {
      user_id: 4,
      note: 6,
      result: 480,
    },
    {
      user_id: 5,
      note: 6,
      result: 450,
    },
    {
      user_id: 6,
      note: 6,
      result: 330,
    },
    {
      user_id: 7,
      note: 6,
      result: 660,
    },
    {
      user_id: 1,
      note: 7,
      result: 390,
    },
    {
      user_id: 2,
      note: 7,
      result: 300,
    },
    {
      user_id: 3,
      note: 7,
      result: 600,
    },
    {
      user_id: 4,
      note: 7,
      result: 270,
    },
    {
      user_id: 5,
      note: 7,
      result: 900,
    },
    {
      user_id: 6,
      note: 7,
      result: 360,
    },
    {
      user_id: 7,
      note: 7,
      result: 210,
    },
    {
      user_id: 1,
      note: 8,
      result: 420,
    },
    {
      user_id: 2,
      note: 8,
      result: 270,
    },
    {
      user_id: 3,
      note: 8,
      result: 330,
    },
    {
      user_id: 4,
      note: 8,
      result: 510,
    },
    {
      user_id: 5,
      note: 8,
      result: 240,
    },
    {
      user_id: 6,
      note: 8,
      result: 60,
    },
    {
      user_id: 7,
      note: 8,
      result: 450,
    },
  ];

  const mockUsersInLobby = [
    {
      user_id: 1,
      nickname: 'Adam',
    },
    {
      user_id: 2,
      nickname: 'Kotlík',
    },
    {
      user_id: 3,
      nickname: 'Morava',
    },
    {
      user_id: 4,
      nickname: 'ROPI',
    },
    {
      user_id: 5,
      nickname: 'Vánič',
    },
    {
      user_id: 6,
      nickname: 'Kalič',
    },
    {
      user_id: 7,
      nickname: 'Petr',
    },
  ];

  const { t } = useTranslation();

  //TODO - Calculations - MOVE to BACKEND
  const revenuesPerRound = mockData.reduce(
    (noteMap, { result, note, user_id }) => {
      note = 'Page.AfterDraftLobbyDetail.Notes.' + note;

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
        return noteMap.set(note, {
          ...currentPlayerResult,
          note,
        });
      }
    },
    new Map(),
  );

  const sortedRevenues = Array.from(revenuesPerRound.values()).sort(
    (a, b) => a.note - b.note,
  );

  const profitsPerRound = sortedRevenues.map(({ note, ...results }) => {
    const newResult = { note };

    const otherPlayersCount = Object.keys(results).length;

    for (let key in results) {
      if (results.hasOwnProperty(key)) {
        const resultWithoutCurrentUserValue = { ...results, [key]: 0 };

        const otherUsersSum = Object.values(
          resultWithoutCurrentUserValue,
        ).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        const newResultValue =
          results[key] - otherUsersSum / (otherPlayersCount - 1);

        newResult[key] = newResultValue;
      }
    }

    return newResult;
  });

  const cumulatedProfitsArr = profitsPerRound.reduce((accumulatorArr, data) => {
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'note') {
        if (typeof accumulatorArr[key] !== 'undefined') {
          accumulatorArr[key] += value;
        } else {
          accumulatorArr[key] = value;
        }
      } else {
        accumulatorArr[key] = 'Page.AfterDraftLobbyDetail.Notes.total';
      }
    });
    return accumulatorArr;
  }, {});

  profitsPerRound.push(cumulatedProfitsArr);

  //Konec kalkulace

  const roundColumn = {
    key: 'note',
    field: 'note',
    style: 'p-datatable-header',
  };
  const cols = mockUsersInLobby.map((lobbyUser, i) => {
    const column = {
      key: lobbyUser.user_id,
      field: lobbyUser.user_id.toString(),
      header: lobbyUser.nickname,
    };
    return column;
  });

  const dynamicColumnsHeaders = cols.map((col, i) => {
    return <Column key={col.field} header={t(col.header)} />;
  });

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header={t('Page.AfterDraftLobbyDetail.Note')} rowSpan={2} />
        <Column
          header={t('Page.AfterDraftLobbyDetail.Users')}
          colSpan={mockUsersInLobby.length}
        />
      </Row>
      <Row>{dynamicColumnsHeaders}</Row>
    </ColumnGroup>
  );

  const lastRowFooter = rowData => {
    return {
      'p-datatable-footer':
        rowData.note === 'Page.AfterDraftLobbyDetail.Notes.total',
    };
  };

  const translatedRound = rowData => {
    return <span>{t(rowData.note)}</span>;
  };
  cols.unshift(roundColumn);

  const dynamicColumns = cols.map((col, i) => {
    if (col.field === 'note') {
      return (
        <Column
          key={col.field}
          field={col.field}
          style={{ fontWeight: 'bold', textAlign: 'center' }}
          body={translatedRound}
        />
      );
    } else {
      return <Column key={col.field} field={col.field} />;
    }
  });

  return (
    <>
      <Layout pt3>
        <Heading className="flex justify-center pb2" size="md">
          {t('Page.AfterDraftLobbyDetail.Header')}
        </Heading>
        <DataTable
          value={profitsPerRound}
          headerColumnGroup={headerGroup}
          rowClassName={lastRowFooter}
          responsive
        >
          {dynamicColumns}
        </DataTable>
      </Layout>
    </>
  );
};
