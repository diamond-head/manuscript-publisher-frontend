import axios from 'axios';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import helperConstant from '../_constants/constant';

export const axiosInstance = axios.create({
  baseURL: helperConstant.apiUrl ? `${helperConstant.apiUrl}/api/v1` : '/api/v1',
  headers: {
    Accept: 'application/json;charset=utf-8'
  }
});

const errorHandler = (error) =>
  new Promise((resolve, reject) => {
    reject(error);
  });

axiosInstance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('auth')}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => {
    // console.log(res);
    if (res.status === 201) {
      toast.success(`${res.data.message}`);
    }
    return Promise.resolve(res);
  },
  (error) => {
    if (error.response) {
      if (error.response?.status === 400 || error.response?.status === 401) {
        toast.error(`${error.response.data.message}`);
      }
      if (error.response?.status === 401) {
        const navigate = useNavigate();
        navigate('/login', { replace: true });
        toast.error(`${error.response.data.message}`);
      }
    }
    // toast.error('Service not available');
    return Promise.reject(error);
  }
);
