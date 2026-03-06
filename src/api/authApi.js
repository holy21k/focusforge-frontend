import axiosClient from './axiosClient';

const authApi = {
  login: (data) => axiosClient.post('auth/login', data),
  register: (data) => axiosClient.post('auth/register', data),
  getMe: () => axiosClient.get('auth/me'),
  googleLogin: (token) => axiosClient.post('auth/google', { token }),
};

export default authApi;