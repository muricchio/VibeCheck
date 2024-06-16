const base64url = require('base64url');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const TOKEN_COOKIE_NAME = "AuthToken";
const API_SECRET = "gnUFZpWmjEnDptWhd4DGOKXXAcptraGdrmxnIF2U9SI";

exports.TokenMiddleware = (req, res, next) => {
  let token = null;
  if(!req.cookies[TOKEN_COOKIE_NAME]) {
    const authHeader = req.get('Authorization');
    if(authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }
  else {
    token = req.cookies[TOKEN_COOKIE_NAME];
  }

  if(!token) {
    res.status(401).json({error: 'Not authenticated'});
    return;
  }

  try {
    const decoded = jwt.verify(token, API_SECRET);
    req.user = decoded.user;
    next();
  }
  catch(err) {
    res.status(401).json({error: 'Not authenticated'});
    return;
  }
}

exports.generateAuthToken = (req, res, user) => {
  let payload = {
    user: user,
    exp: Math.floor(Date.now() / 1000) + (60 * 60)
  }
  const token = jwt.sign(payload, API_SECRET);

  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    maxAge: 10 * 60 * 1000
  });
};


exports.removeAuthToken = (req, res) => {
  res.cookie(TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    maxAge: -360000
  });
}
