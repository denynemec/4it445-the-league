import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

export const Table = ({ legendData, data }) => (
  <table className={classNames('f6 w-100 mw8 center')} cellSpacing={'0'}>
    <thead>
      {legendData.map(row => (
        <TableLegend key={row.id} {...row} />
      ))}
    </thead>
    <tbody className={classNames('lh-copy')}>
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
    <tr className={classNames('stripe-dark')}>
      {columns.map(column => (
        <td className={classNames('pa2')}>{column}</td>
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
  const { t } = useTranslation();
  return (
    <tr>
      {columns.map(column => (
        <th className={classNames('fw6 tl pa3 bg-white')}>{t(column)}</th>
      ))}
    </tr>
  );
};
