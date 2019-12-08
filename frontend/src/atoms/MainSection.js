import React from 'react';
import { Container } from 'reactstrap';

export const MainSection = ({ children }) => (
  <Container className="p-5 backgroundLight">{children}</Container>
);
