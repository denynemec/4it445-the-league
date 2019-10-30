import jwt from 'jsonwebtoken';

const JWT_TOKEN_SECRET = 'JWT_TOKEN_SECRET';

// generate JWT token with no expiration
export const getJwtToken = payload => jwt.sign(payload, JWT_TOKEN_SECRET);

// verify JWT token and save decoded payload into req.jwtDecoded
export const verifyJwtToken = (req, res, next) => {
  const tokenWithBearer = req.headers['authorization'];

  if (tokenWithBearer) {
    // Remove `Bearer `
    const token = tokenWithBearer.slice(7, tokenWithBearer.length);

    jwt.verify(token, JWT_TOKEN_SECRET, (err, jwtDecoded) => {
      if (err) {
        return res.status(401).json({ error: '401: Unauthorized' });
      } else {
        req.jwtDecoded = jwtDecoded;
        next();
      }
    });
  } else {
    res.status(401).json({ error: '401: Missing `authorization` header' });
  }
};
