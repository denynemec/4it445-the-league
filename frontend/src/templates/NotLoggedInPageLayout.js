import React from 'react';

import { MainSectionWithErrorBox } from '../molecules';
import { NotLoggedInHeader } from '../organisms';
import { Container } from 'reactstrap';

export const NotLoggedInPageLayout = ({ children, errorList }) => (
  <>
    <NotLoggedInHeader />

    <MainSectionWithErrorBox errorList={errorList || []}>
      <Container>{children}</Container>
    </MainSectionWithErrorBox>
  </>
);
