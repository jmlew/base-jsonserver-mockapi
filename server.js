const db = require('./data/db.json');
const users = require('./data/users.json');
const foos = require('./data/foos.json');

module.exports = () => {
  const data = {
    ...db,
    ...users,
    ...foos,
  };

  return data;
};
