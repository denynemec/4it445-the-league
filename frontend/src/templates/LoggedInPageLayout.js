import React from 'react';

import { MainSection } from '../atoms';
import { LoggedInHeader } from '../organisms';

export const LoggedInPageLayout = ({ children }) => (
  <>
    <LoggedInHeader />
    <MainSection>{children}</MainSection>
  </>
);
