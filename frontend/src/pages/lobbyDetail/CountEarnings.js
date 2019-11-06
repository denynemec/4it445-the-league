import React from 'react';
import { Label } from '../../atoms';

export const CountEarnings = ({ playersData }) => {
  let countEarnings = 0;
  playersData.map(earnings => (countEarnings += parseInt(earnings.earnings)));
  return <Label>Celkový výdělek: {countEarnings} CZK</Label>;
};
