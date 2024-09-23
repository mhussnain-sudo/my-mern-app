// storage.js
let role = null;

const setRole = (newRole) => {
  role = newRole;
};

const getRole = () => {
  return role;
};

const clearRole = () => {
  role = null;
};

module.exports = {
  setRole,
  getRole,
  clearRole,
};
