import React from 'react';
import { Label } from '../../atoms';

export const TotalPercentageForSeason = ({ playersData }) => {
  let countEarnings = 0;
  playersData.map(earnings => (countEarnings += parseInt(earnings.earnings)));
  let countProfitLoss = 0;
  playersData.map(loss => (countProfitLoss += parseInt(loss.profitLoss)));

  let totalPercentage = Math.round(
    (countEarnings / (countEarnings + countProfitLoss)) * 100,
  );

  return <Label>Celkem za všechna kola: {totalPercentage}%</Label>;
};
