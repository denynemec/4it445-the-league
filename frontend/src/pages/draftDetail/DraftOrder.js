import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import classNames from 'classnames';

import './styles.css';

export const DraftOrder = ({ data, activeDraftOrder }) => {
  const sortedData = data.sort((a, b) => a.draftOrder - b.draftOrder);

  const nicknameTemplate = (rowData, { field }) => (
    <span className={classNames('flex justify-center')}>{rowData[field]}</span>
  );

  const columns = sortedData.map(({ draftOrder }) => (
    <Column
      key={draftOrder}
      field={`${draftOrder}`}
      header={draftOrder}
      body={nicknameTemplate}
      bodyClassName={classNames({
        activeDraftOrder: draftOrder === activeDraftOrder,
      })}
    />
  ));

  const reduredData = sortedData.reduce(
    (accumulator, { draftOrder, nickname }) => ({
      [draftOrder]: nickname,
      ...accumulator,
    }),
    {},
  );

  return (
    <DataTable value={[reduredData]} responsive>
      {columns}
    </DataTable>
  );
};
