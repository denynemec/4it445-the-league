import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import ENDPOINTS from '../../endpoints';
import PATHNAMES from '../../pathnames';
import { useAuth, useRequest } from '../../utils';
import { isLoginFormValid, validateLoginForm } from './validations';

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

const useSubmitLogin = ({
  history,
  username,
  password,
  setUsernameError,
  setPasswordError,
}) => {
  const { signin } = useAuth();
  const { t } = useTranslation();
  const state = useRequest();

  const postLoginOnSuccess = useCallback(
    ({ data: { user, token } }) => {
      signin({ user, token });
      history.push(PATHNAMES.home());
    },
    [signin, history],
  );

  const submitLoginForm = useCallback(() => {
    validateLoginForm({
      username,
      setUsernameError,
      password,
      setPasswordError,
      t,
    });

    if (isLoginFormValid({ username, password })) {
      state.request(ENDPOINTS.login(), {
        method: 'POST',
        onSuccess: postLoginOnSuccess,
        data: { username, password },
      });
    }
  }, [
    username,
    password,
    state,
    postLoginOnSuccess,
    setUsernameError,
    setPasswordError,
    t,
  ]);

  return [state, submitLoginForm];
};

export const useLoginState = history => {
  const [username, setUsernameState] = useInputState();
  const {
    setValue: setUsername,
    setError: setUsernameError,
  } = useInputStateMemoizedCallback(setUsernameState);

  const [password, setPasswordState] = useInputState();
  const {
    setValue: setPassword,
    setError: setPasswordError,
  } = useInputStateMemoizedCallback(setPasswordState);

  const [loginState, submitLoginForm] = useSubmitLogin({
    history,
    username: username.value,
    password: password.value,
    setUsernameError,
    setPasswordError,
  });

  return {
    username,
    setUsername,
    password,
    setPassword,
    loginState,
    submitLoginForm,
  };
};
