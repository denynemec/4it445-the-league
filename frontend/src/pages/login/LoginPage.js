import React from 'react';
import { withRouter } from 'react-router-dom';

import PATHNAMES from '../../pathnames';
import { Heading, Button, Form, Layout, Link } from '../../atoms';
import { PageLayout } from '../../templates';
import { TextInputWithLabel } from '../../molecules';
import { useLoginState } from './hooks';

const LoginPageBase = ({ history }) => {
  const [
    username,
    setUsername,
    password,
    setPassword,
    loginState,
    submitLoginForm,
  ] = useLoginState(history);

  return (
    <PageLayout>
      <Layout flex justify-center pb2>
        <Heading>Login into The League</Heading>
      </Layout>

      <Form onSubmit={submitLoginForm}>
        <TextInputWithLabel
          name="username"
          label="Username"
          placeholder="Enter Username"
          value={username.value}
          error={username.error}
          onChange={setUsername}
        />

        <TextInputWithLabel
          type="password"
          name="password"
          label="Password"
          placeholder="Enter Password"
          value={password.value}
          error={password.error}
          onChange={setPassword}
        />

        <Layout flex justify-end ph2 pb2>
          <Link to={PATHNAMES.resetPassword()}>Did you forget password?</Link>
        </Layout>

        <Layout flex justify-center>
          <Button submit primary disabled={loginState.isLoading}>
            Login
          </Button>
        </Layout>
      </Form>
    </PageLayout>
  );
};

export const LoginPage = withRouter(LoginPageBase);
