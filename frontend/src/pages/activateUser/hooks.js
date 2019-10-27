import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import ENDPOINTS from '../../endpoints';
import PATHNAMES from '../../pathnames';
import { useAuth, useRequest } from '../../utils';
import {
  isActivateUserFormValid,
  validateActivateUserForm,
} from './validations';

const useInputState = () => {
  const [inputState, setInputState] = useState({ value: '', error: '' });

  return [inputState, setInputState];
};

const useInputStateMemoizedCallback = setInputState => {
  const setValue = useCallback(value => setInputState({ value, error: '' }), [
    setInputState,
  ]);

  const setError = useCallback(
    error => setInputState(prevState => ({ ...prevState, error })),
    [setInputState],
  );

  return { setValue, setError };
};

const useSubmitActivateUser = ({
  history,
  nickname,
  setNicknameError,
  userId,
}) => {
  const { signin } = useAuth();
  const { t } = useTranslation();
  const state = useRequest();

  const activateUserOnSuccess = useCallback(
    ({ data: { user, token } }) => {
      signin({ user, token });
      history.push(PATHNAMES.home());
    },
    [signin, history],
  );

  const submitActivateUserForm = useCallback(() => {
    validateActivateUserForm({
      nickname,
      setNicknameError,
      t,
    });

    if (isActivateUserFormValid({ nickname })) {
      state.request(ENDPOINTS.activateUser(), {
        method: 'PUT',
        onSuccess: activateUserOnSuccess,
        data: { nickname, userId },
      });
    }
  }, [nickname, state, activateUserOnSuccess, setNicknameError, t, userId]);

  return [state, submitActivateUserForm];
};

export const useActivateUserState = ({ history, userId }) => {
  const [nickname, setNicknameState] = useInputState();
  const {
    setValue: setNickname,
    setError: setNicknameError,
  } = useInputStateMemoizedCallback(setNicknameState);

  const [activateUserState, submitActivateUserForm] = useSubmitActivateUser({
    history,
    userId,
    nickname: nickname.value,
    setNicknameError,
  });

  return {
    nickname,
    setNickname,
    activateUserState,
    submitActivateUserForm,
  };
};
