import React from 'react';

import { MainSection } from '../atoms';
import { NotLoggedInHeader } from '../organisms';

export const NotLoggedInPageLayout = ({ children }) => (
  <>
    <NotLoggedInHeader />
    <MainSection>{children}</MainSection>
  </>
);
