// auth.js
export const login = (accessToken, role) => ({
    type: 'LOGIN',
    accessToken,
    role,
  });
export const removeAccessToken = () => ({
    type: 'LOGOUT',
  });