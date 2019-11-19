import React from 'react';
import { Container } from 'reactstrap';

export const MainSection = ({ children }) => (
  <div className="pa3 bt b--black-10">
    <Container>{children}</Container>
  </div>
);
