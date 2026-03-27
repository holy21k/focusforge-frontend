import axiosClient from './axiosClient';

const settingsApi = {
  changePassword: (data) => axiosClient.put('settings/password', data),
  getPersonalization: () => axiosClient.get('settings/personalization'),
  updatePersonalization: (data) => axiosClient.put('settings/personalization', data),
  getProfile: () => axiosClient.get('settings/profile'),
  updateProfile: (data) => axiosClient.put('settings/profile', data),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('settings/avatar', formData);
  },
};

export default settingsApi;