const authActons = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGOUT: 'LOGOUT',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  login: (loginCredentials) => ({
    type: authActons.LOGIN_REQUEST,
    email: loginCredentials.email,
    password: loginCredentials.password
  }),
  logout: () => ({
    type: authActons.LOGOUT,
  }),
};
export default authActons;
