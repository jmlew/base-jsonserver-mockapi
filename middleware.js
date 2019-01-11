const userdb = require('./data/users.json');

module.exports = (req, res, next) => {
  const { url, body, method, headers } = req;

  // Add created_at
  if (url.includes('users') && (method === 'POST' || method === 'PUT')) {
    if (method === 'PUT') {
      body.updated_at = Date.now();
    }
    body.created_at = Date.now();
  }

  // Strip out credentials from users BD.
  if (url.includes('users') && method === 'GET') {
    res.send(sanitisedUsersData());
  }

  // account
  if (method === 'GET' && url === '/account') {
    if (
      headers.authorization === undefined ||
      headers.authorization.split(' ')[0] !== 'Bearer'
    ) {
      const status = 401;
      const message = 'Error in authorization format';
      res.status(status).json({ status, message });
      return;
    }
  }

  // authenticate
  if (method === 'POST' && url === '/authenticate') {
    if (isAuthenticated(body)) {
      // Add Authorization header
      res.header(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicGFzc3dvcmQiOiJhZG1pbiIsImlhdCI6MTUzMTczMTA0NSwiZXhwIjoxNTMxNzM0NjQ1fQ.NgYp6HbPjzv1ihFnLJpxjovBkt-w6CLfibS92hJFAsA'
      );
    } else {
      const status = 401;
      const message = 'Incorrect email or password';
      res.status(status).json({ status, message });
      return;
    }
  }

  // Continue to JSON Server router
  next();
};

/**
 * Determines whether a user is authenticated.
 */
function isAuthenticated(credentials) {
  const { email, password } = credentials;
  return userdb.users.some((user) => user.email === email && user.password === password);
}

/**
 * Removes the password field from the users collection.
 */
function sanitisedUsersData() {
  return userdb.users.map((user) => {
    delete user.password;
    return user;
  });
}
