import React from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

export const Table = ({ legendData, data }) => (
  <div className={'pa4'}>
    <div className={'overflow-x-auto br2 b--solid ba b--black-90 shadow-1'}>
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
    </div>
  </div>
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
    <tr className={'hover-bg-gray:hover hover-bg-gray:focus'}>
      {columns.map(column => (
        <td className={classNames('pv3 pr3 pl3 bb b--black-20 tc')}>
          {column}
        </td>
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
        <th
          className={classNames(
            'fw6 bb b--black-20 tl pb3 pr3 pl3 pv3 bg-white tc bg-lightest-blue',
          )}
        >
          {t(column)}
        </th>
      ))}
    </tr>
  );
};
