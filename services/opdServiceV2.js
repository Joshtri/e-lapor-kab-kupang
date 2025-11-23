import axios from 'axios';

const API_BASE = '/api/opd-v2';

/**
 * Fetch all OPDs - list view (staff data not included)
 * For detailed view with staff, use fetchOpdDetailV2()
 */
export const fetchOpdsV2 = async () => {
  const { data } = await axios.get(API_BASE);
  return data;
};

/**
 * Fetch single OPD detail by ID (includes staff and reports)
 */
export const fetchOpdDetailV2 = async (id) => {
  const { data } = await axios.get(`${API_BASE}/${id}`);
  return data;
};

/**
 * Create new OPD
 */
export const createOpdV2 = async (opdData) => {
  const { data } = await axios.post(API_BASE, opdData);
  return data;
};

/**
 * Update OPD by ID
 */
export const updateOpdV2 = async (id, opdData) => {
  const { data } = await axios.put(`${API_BASE}/${id}`, opdData);
  return data;
};

/**
 * Delete OPD by ID
 */
export const deleteOpdV2 = async (id) => {
  await axios.delete(`${API_BASE}/${id}`);
};
