import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import axios from 'axios';

import { useAuth } from './auth';
import { config } from '../config';
import PATHNAMES from '../pathnames';

const activateUserUrl = `${config.PUBLIC_URL}${PATHNAMES.getActivateUser()}`;
const resetPasswordUrl = `${
  config.PUBLIC_URL
}${PATHNAMES.getResetPasswordConfirmation()}`;

const joinToLobbyUrl = `${config.PUBLIC_URL}${PATHNAMES.getJoinToLobby()}`;

const globalApiInstance = axios.create({
  baseURL: config.BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'x-the-league-app-activate-user-url': activateUserUrl,
    'x-the-league-app-join-to-the-lobby-url': joinToLobbyUrl,
    'x-the-league-app-reset-password-url': resetPasswordUrl,
  },
});

if (config.MOCK_API) {
  const { installApiMocks } = require('./api-mock.js');
  installApiMocks(globalApiInstance);
}

const ApiStateContext = createContext(globalApiInstance);

export function useApi() {
  return useContext(ApiStateContext);
}

export function ApiProvider({ children }) {
  const api = globalApiInstance;

  useSetAuthorizationHeader(api);
  useInstallSignoutApiInterceptror(api);

  return (
    <ApiStateContext.Provider value={api}>{children}</ApiStateContext.Provider>
  );
}

function useSetAuthorizationHeader(api) {
  const { token } = useAuth();

  // Using `useLayoutEffect` instead of `useEffect` because it is triggered
  // earlier then other `useEffect` calls that may already use `api`.
  useLayoutEffect(() => {
    if (!token) {
      delete api.defaults.headers.common['Authorization'];
    } else {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token, api]);
}

function useInstallSignoutApiInterceptror(api) {
  const { signout } = useAuth();
  const signoutRef = useRef(signout);

  useEffect(() => {
    signoutRef.current = signout;
  }, [signout]);

  useEffect(() => {
    const signoutInterceptr = api.interceptors.response.use(
      response => response,
      error => {
        const isInvalidTokenResponse =
          error && error.response && error.response.status === 401;

        if (isInvalidTokenResponse && signoutRef.current) {
          signoutRef.current();
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.request.eject(signoutInterceptr);
    };
  }, [api]);
}
