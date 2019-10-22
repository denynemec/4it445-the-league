import React from 'react';

import { MainSectionWithErrorBox } from '../molecules';
import { NotLoggedInHeader } from '../organisms';

export const NotLoggedInPageLayout = ({ children, errorList }) => (
  <>
    <NotLoggedInHeader />

    <MainSectionWithErrorBox errorList={errorList || []}>
      {children}
    </MainSectionWithErrorBox>
  </>
);
