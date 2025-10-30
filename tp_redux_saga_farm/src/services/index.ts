import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

export function uploadFile(file: File, config?: AxiosRequestConfig) {
  const url = 'https://httpbin.org/post';
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(url, formData, config).then(() => {
    if (Math.random() > 0.5) {
      throw new Error('手动制造错误');
    }
  });
}
