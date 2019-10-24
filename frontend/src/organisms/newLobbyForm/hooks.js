import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { isNewLobbyFormValid, validateNewLobbyForm } from './validations';

import ENDPOINTS from '../../endpoints';
import { useRequest } from '../../utils';

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

const useSubmitNewLobby = ({ history, lobbyName, setLobbyNameError }) => {
  const { t } = useTranslation();
  const state = useRequest();

  const submitNewLobbyForm = useCallback(() => {
    validateNewLobbyForm({
      lobbyName,
      setLobbyNameError,
      t,
    });

    if (isNewLobbyFormValid({ lobbyName })) {
      state.request(ENDPOINTS.newLobby(), {
        method: 'POST',
        data: { lobbyName },
      });
    }
  }, [lobbyName, setLobbyNameError, state, t]);

  return [state, submitNewLobbyForm];
};

export const useNewLobbyState = history => {
  const [lobbyName, setLobbyNameState] = useInputState();
  const {
    setValue: setLobbyName,
    setError: setLobbyNameError,
  } = useInputStateMemoizedCallback(setLobbyNameState);

  const [newLobbyState, submitNewLobbyForm] = useSubmitNewLobby({
    history,
    lobbyName: lobbyName.value,
    setLobbyNameError,
  });

  return {
    lobbyName,
    setLobbyName,
    newLobbyState,
    submitNewLobbyForm,
  };
};
