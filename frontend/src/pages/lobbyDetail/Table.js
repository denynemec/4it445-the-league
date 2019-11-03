import React from 'react';
import classNames from 'classnames';

export const Table = ({ legendData, data }) => (
  <table className={classNames('f6 w-100 mw8 center')}>
    <thead>
      {legendData.map(row => (
        <TableLegend key={row.id} {...row} />
      ))}
    </thead>
    <tbody>
      {data.map(row => (
        <TableRow key={row.id} {...row} />
      ))}
    </tbody>
  </table>
);

const TableRow = ({
  name,
  position,
  team,
  earnings,
  earningsPercentage,
  profitLoss,
}) => {
  const columns = [
    name,
    position,
    team,
    earnings,
    earningsPercentage,
    profitLoss,
  ];

  return (
    <tr>
      {columns.map(column => (
        <td>{column}</td>
      ))}
    </tr>
  );
};

const TableLegend = ({
  name,
  position,
  team,
  earnings,
  earningsPercentage,
  profitLoss,
}) => {
  const columns = [
    name,
    position,
    team,
    earnings,
    earningsPercentage,
    profitLoss,
  ];

  return (
    <tr>
      {columns.map(column => (
        <th>{column}</th>
      ))}
    </tr>
  );
};

// {
//   id: 348,
//   name: 'PAVEL VYHNAL',
//   position: 'U',
//   team: 'FASTAV ZLÍN',
//   earnings: 0,
//   earningsPercentage: '0%',
//   profitLoss: 0,
// }
