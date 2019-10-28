import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import ENDPOINTS from '../../endpoints';
import PATHNAMES from '../../pathnames';
import { useAuth, useRequest } from '../../utils';
import {
  isRegistrationFormValid,
  validateRegistrationForm,
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

const useSubmitRegistration = ({
  history,
  email,
  password,
  passwordConfirmation,
  setEmailError,
  setPasswordError,
  setPasswordConfirmationError,
}) => {
  const { signup } = useAuth();
  const { t } = useTranslation();
  const state = useRequest();

  const postRegistrationOnSuccess = useCallback(
    ({ data: { user, token } }) => {
      signup({ user, token });
      history.push(PATHNAMES.home());
    },
    [signup, history],
  );

  const submitRegistrationForm = useCallback(() => {
    validateRegistrationForm({
      email,
      setEmailError,
      password,
      passwordConfirmation,
      setPasswordError,
      setPasswordConfirmationError,
      t,
    });

    if (isRegistrationFormValid({ email, password })) {
      state.request(ENDPOINTS.Registration(), {
        method: 'POST',
        onSuccess: postRegistrationOnSuccess,
        data: { email, password },
      });
    }
  }, [
    email,
    password,
    passwordConfirmation,
    state,
    postRegistrationOnSuccess,
    setEmailError,
    setPasswordError,
    setPasswordConfirmationError,
    t,
  ]);

  return [state, submitRegistrationForm];
};

export const useRegistrationState = history => {
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

  const [passwordConfirmation, setPasswordConfirmationState] = useInputState();
  const {
    setValue: setPasswordConfirmation,
    setError: setPasswordConfirmationError,
  } = useInputStateMemoizedCallback(setPasswordConfirmationState);

  const [RegistrationState, submitRegistrationForm] = useSubmitRegistration({
    history,
    email: email.value,
    password: password.value,
    passwordConfirmation: passwordConfirmation.value,
    setEmailError,
    setPasswordError,
    setPasswordConfirmationError,
  });

  return {
    email,
    setEmail,
    password,
    passwordConfirmation,
    setPassword,
    setPasswordConfirmation,
    RegistrationState,
    submitRegistrationForm,
  };
};
