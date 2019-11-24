import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';

import ENDPOINTS from '../../endpoints';
import PATHNAMES from '../../pathnames';
import { Heading, Layout } from '../../atoms';
import { NotLoggedInPageLayout } from '../../templates';
import { Field } from '../../organisms';
import { useAuth, useRequest, translatedValidations } from '../../utils';
import { Button } from 'reactstrap';

export const ActivateUserPage = () => {
  const { t } = useTranslation();
  const { userHash } = useParams();
  const { signin } = useAuth();
  const history = useHistory();

  const activateUserState = useRequest();

  const activateUserOnSuccess = useCallback(
    ({ data: { user, token, privileges } }) => {
      signin({ user, token, privileges });
      history.push(PATHNAMES.home());
    },
    [signin, history],
  );

  const onSubmitMemoized = useCallback(
    ({ nickname, firstName, lastName }) => {
      activateUserState.request(ENDPOINTS.activateUser(), {
        method: 'PUT',
        onSuccess: activateUserOnSuccess,
        data: { nickname, firstName, lastName, userHash },
      });
    },
    [activateUserState, activateUserOnSuccess, userHash],
  );

  const { object, requiredString } = translatedValidations(t);

  const schema = object({
    nickname: requiredString,
    firstName: requiredString,
    lastName: requiredString,
  });

  return (
    <NotLoggedInPageLayout
      errorList={[{ id: 1, error: activateUserState.error }]}
    >
      <Heading className="flex justify-center pb2">
        {t('Page.ActivateUser.FormHeading')}
      </Heading>

      <Formik
        initialValues={{ nickname: '', firstName: '', lastName: '' }}
        validationSchema={schema}
        onSubmit={onSubmitMemoized}
      >
        <Form>
          <Field
            type="text"
            name="firstName"
            label={t('Page.ActivateUser.FirstNameLabel')}
            placeholder={t('Page.ActivateUser.FirstNamePlaceholder')}
          />

          <Field
            type="text"
            name="lastName"
            label={t('Page.ActivateUser.LastNameLabel')}
            placeholder={t('Page.ActivateUser.LastNamePlaceholder')}
          />

          <Field
            type="text"
            name="nickname"
            label={t('Page.ActivateUser.NicknameLabel')}
            placeholder={t('Page.ActivateUser.NicknamePlaceholder')}
          />

          <Layout flex justify-center>
            <Button
              submit
              color="primary"
              disabled={activateUserState.isLoading}
            >
              {t('Page.ActivateUser.SubmitActivateUserButton')}
            </Button>
          </Layout>
        </Form>
      </Formik>
    </NotLoggedInPageLayout>
  );
};
