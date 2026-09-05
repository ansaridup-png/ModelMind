import { request } from './baseApi';

export async function fetchDashboardData() {
  return request('/dashboard');
}
