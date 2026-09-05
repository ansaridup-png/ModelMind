import { request } from './baseApi';

export async function fetchModelData() {
  return request('/models');
}

export async function fetchDlModelData() {
  return request('/dlmodels');
}
