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
  email,
  password,
  setEmailError,
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
      email,
      setEmailError,
      password,
      setPasswordError,
      t,
    });

    if (isLoginFormValid({ email, password })) {
      state.request(ENDPOINTS.login(), {
        method: 'POST',
        onSuccess: postLoginOnSuccess,
        data: { email, password },
      });
    }
  }, [
    email,
    password,
    state,
    postLoginOnSuccess,
    setEmailError,
    setPasswordError,
    t,
  ]);

  return [state, submitLoginForm];
};

export const useLoginState = history => {
  const [email, setEmailState] = useInputState();
  const {
    setValue: setEmail,
    setError: setEmailError,
  } = useInputStateMemoizedCallback(setEmailState);

  const [password, setPasswordState] = useInputState();
  const {
    setValue: setPassword,
    setError: setPasswordError,
  } = useInputStateMemoizedCallback(setPasswordState);

  const [loginState, submitLoginForm] = useSubmitLogin({
    history,
    email: email.value,
    password: password.value,
    setEmailError,
    setPasswordError,
  });

  return {
    email,
    setEmail,
    password,
    setPassword,
    loginState,
    submitLoginForm,
  };
};
