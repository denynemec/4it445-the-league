import { Label } from '../../atoms';
import React from 'react';

export const CountProfitLoss = ({ playersData }) => {
  let countProfitLoss = 0;
  playersData.map(loss => (countProfitLoss += parseInt(loss.profitLoss)));
  return <Label>Celkový ušlý zisk: {countProfitLoss} CZK</Label>;
};
