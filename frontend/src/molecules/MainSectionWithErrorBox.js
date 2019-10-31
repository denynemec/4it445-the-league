import React from 'react';

import { ErrorBox, MainSection } from '../atoms';

export const MainSectionWithErrorBox = ({ children, errorList }) => (
  <MainSection>
    <ErrorBox className="pb3" errorList={errorList} />

    {children}
  </MainSection>
);
