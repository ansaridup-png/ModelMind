import { request } from './baseApi';

export async function analyzeDataset(file) {
  const formData = new FormData();
  formData.append('file', file);

  return request('/datasets/analyze', {
    method: 'POST',
    body: formData,
  });
}

export async function uploadDataset(file) {
  const formData = new FormData();
  formData.append('file', file);

  return request('/datasets/upload', {
    method: 'POST',
    body: formData,
  });
}
