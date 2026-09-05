import { request } from './baseApi';

export async function trainLinearRegression(payload) {
  return request('/train/linear-regression', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function trainLogisticRegression(payload) {
  return request('/train/logistic-regression', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
