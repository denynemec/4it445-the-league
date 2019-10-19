import dotenv from 'dotenv';
import express from 'express';
var cors = require('cors');

import { mocks } from './mocks';

dotenv.config();
dotenv.config({ path: '.env.local' });

const { PORT = 3001 } = process.env;

const app = express();

app.use(cors());

app.use(express.json());

app.post('/api/auth/login', (req, res, next) => {
  // test
  const {
    body: { username, password },
  } = req;

  if (!username) {
    handleError({ code: 400, error: '400: Bad request - empty username', res });

    return;
  }

  if (!password) {
    handleError({ code: 400, error: '400: Bad request - empty password', res });

    return;
  }

  res.json({
    token: 'mock-token',
    user: mocks.users[0],
  });
});

app.use((req, res, next) => {
  handleError({ code: 404, error: '404: Not found', res });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}!`);
});

const handleError = ({ code, error, res }) => {
  res.status(code);
  res.json({ error });
};
