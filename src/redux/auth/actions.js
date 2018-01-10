const authActons = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGOUT: 'LOGOUT',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  loginSuccess: (userResult) => ({
    type: authActons.LOGIN_SUCCESS,
    payload: userResult
  }), 
  login: (loginCredentials) => ({
    type: authActons.LOGIN_REQUEST,
    payload: loginCredentials
  }),
  logout: () => ({
    type: authActons.LOGOUT,
  }),
  loginError: (userResult) => ({
    type: authActons.LOGIN_ERROR,
    payload: userResult
  })
};
export default authActons;
