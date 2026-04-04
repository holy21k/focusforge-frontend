import axiosClient from './axiosClient';

const authApi = {
  login: (data) => axiosClient.post('auth/login', data),
  register: (data) => axiosClient.post('auth/register', data),
  getMe: () => axiosClient.get('auth/me'),
  googleLogin: (token, redirectUri) => axiosClient.post('auth/google', { token, redirect_uri: redirectUri }),
};

export default authApi;