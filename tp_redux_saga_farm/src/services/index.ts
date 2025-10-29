import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

export function uploadFile(file: File, config?: AxiosRequestConfig) {
  const url = 'https://httpbin.org/post';
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(url, formData, config);
}
