import React from 'react';

import { MainSectionWithErrorBox } from '../molecules';
import { LoggedInHeader } from '../organisms';

export const LoggedInPageLayout = ({ children, errorList }) => (
  <>
    <LoggedInHeader />

    <MainSectionWithErrorBox errorList={errorList || []}>
      {children}
    </MainSectionWithErrorBox>
  </>
);
