import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

const LOCAL_STORAGE_AUTH_KEY = 'the-league-auth';

const initialState = {
  token: null,
  user: null,
  privileges: [],
};

const AuthContext = createContext(
  createContextValue({
    token: initialState.token,
    user: initialState.user,
    privileges: initialState.privileges,
    setState: () =>
      console.error('You are using AuthContext without AuthProvider!'),
  }),
);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [state, setState] = usePersistedAuth(initialState);

  const contextValue = useMemo(() => {
    const { token, user, privileges } = state;
    return createContextValue({ token, user, privileges, setState });
  }, [state, setState]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

function createContextValue({ token, user, privileges, setState }) {
  return {
    token,
    user,
    privileges,
    signin: ({ token, user, privileges }) =>
      setState({ token, user, privileges }),
    signout: () => setState({ token: null, user: null, privileges: [] }),
  };
}

function usePersistedAuth(defaultState) {
  const [state, setStateRaw] = useState(() => getStorageState(defaultState));

  const setState = useCallback(newState => {
    setStateRaw(newState);
    setStorageState(newState);
  }, []);

  return [state, setState];
}

function getStorageState(defaultState) {
  if (!window.localStorage) {
    return defaultState;
  }

  const rawData = window.localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
  if (!rawData) {
    return defaultState;
  }

  try {
    const { user, token, privileges } = JSON.parse(rawData);

    if (token && user && privileges) {
      return { token, user, privileges };
    }
  } catch {}

  return defaultState;
}

function setStorageState(newState) {
  if (!window.localStorage) {
    return;
  }

  window.localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(newState));
}
