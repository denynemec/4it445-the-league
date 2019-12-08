import React from 'react';

import { MainSectionWithErrorBox } from '../molecules';
import { LoggedInHeader } from '../organisms';
import './customStyles.css';

export const LoggedInPageLayout = ({ children, errorList }) => (
  <>
    <LoggedInHeader />

    <MainSectionWithErrorBox
      errorList={errorList || []}
      className="backgroundLight"
    >
      {children}
    </MainSectionWithErrorBox>
  </>
);
