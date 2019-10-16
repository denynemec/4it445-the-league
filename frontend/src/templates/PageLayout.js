import React from 'react';

import { MainSection } from '../atoms/';
import { TopNavigation } from '../molecules/TopNavigation';

export const PageLayout = ({ children }) => (
  <>
    <TopNavigation />
    <MainSection>{children}</MainSection>
  </>
);
