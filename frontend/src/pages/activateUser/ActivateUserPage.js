import React from 'react';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Heading, Button, Form, Layout } from '../../atoms';
import { NotLoggedInPageLayout } from '../../templates';
import { TextInputWithLabel } from '../../molecules';
import { useGetQueryParam } from '../../utils';
import { useActivateUserState } from './hooks';

const ActivateUserPageBase = ({ history }) => {
  const { t } = useTranslation();

  const userId = useGetQueryParam('userId');

  const {
    nickname,
    setNickname,
    activateUserState,
    submitActivateUserForm,
  } = useActivateUserState({ history, userId });

  return (
    <NotLoggedInPageLayout
      errorList={[{ id: 1, error: activateUserState.error }]}
    >
      {userId ? (
        <Layout flex self-center flex-column w-75>
          <Layout flex justify-center pb2>
            <Heading>{t('Page.ActivateUser.FormHeading')}</Heading>
          </Layout>

          <Form onSubmit={submitActivateUserForm}>
            <TextInputWithLabel
              name="nickname"
              label={t('Page.ActivateUser.NicknameLabel')}
              placeholder={t('Page.ActivateUser.NicknamePlaceholder')}
              value={nickname.value}
              error={nickname.error}
              onChange={setNickname}
            />

            <Layout flex justify-center>
              <Button submit primary disabled={activateUserState.isLoading}>
                {t('Page.ActivateUser.SubmitActivateUserButton')}
              </Button>
            </Layout>
          </Form>
        </Layout>
      ) : (
        <Layout flex justify-center pb2>
          <Heading>{t('Page.ActivateUser.MissingUserIdInQuery')}</Heading>
        </Layout>
      )}
    </NotLoggedInPageLayout>
  );
};

export const ActivateUserPage = withRouter(ActivateUserPageBase);
