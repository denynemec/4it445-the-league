import React from 'react';

import { Layout } from '../atoms';
import { MainSectionWithErrorBox } from '../molecules';
import { NotLoggedInHeader } from '../organisms';

export const NotLoggedInPageLayout = ({ children, errorList }) => (
  <>
    <NotLoggedInHeader />

    <MainSectionWithErrorBox errorList={errorList || []}>
      <Layout flex self-center flex-column w-75>
        {children}
      </Layout>
    </MainSectionWithErrorBox>
  </>
);
