/**
 * Authorization Roles
 */
const authRoles = {
  admin: ['admin'],
  regular: ['regular'],
  owner: ['onwer'],
  user: ['admin', 'regular', 'owner'],
  onlyGuest: [],
};

export default authRoles;
