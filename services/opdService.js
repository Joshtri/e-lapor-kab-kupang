import axios from 'axios';

/**
 * Fetch all OPD/organizations
 */
export const fetchOpds = async () => {
  const { data } = await axios.get('/api/opd/list');
  return data;
};

/**
 * Fetch OPD detail by ID
 */
export const fetchOpdDetail = async (id) => {
  const { data } = await axios.get(`/api/opd/${id}`);
  return data;
};

/**
 * Create new OPD
 */
export const createOpd = async (opdData) => {
  const { data } = await axios.post('/api/opd', opdData);
  return data;
};

/**
 * Update OPD by ID
 */
export const updateOpd = async (id, opdData) => {
  const { data } = await axios.put(`/api/opd/${id}`, opdData);
  return data;
};

/**
 * Delete OPD by ID
 */
export const deleteOpd = async (id) => {
  await axios.delete(`/api/opd/${id}`);
};

/**
 * Get available wilayah options
 */
export const fetchWilayahOptions = async () => {
  // Hardcoded options atau bisa dari API
  return [
    { value: 'AMARASI', label: 'Amarasi' },
    { value: 'FATULEU', label: 'Fatuleu' },
    { value: 'SOUTH_CENTRAL', label: 'South Central' },
  ];
};

/**
 * Get OPD statistics
 */
export const fetchOpdStats = async () => {
  const { data } = await axios.get('/api/opd/stats');
  return data;
};

/**
 * Fetch available users for OPD (users with role OPD that don't have an OPD yet)
 */
export const fetchAvailableOpdUsers = async () => {
  const { data } = await axios.get('/api/opd/available-staff');
  return data;
};

/**
 * Create new OPD with staff assignment
 */
export const createOpdWithStaff = async (opdData) => {
  const { data } = await axios.post('/api/opd/create', {
    ...opdData,
    staffUserId: opdData.staffUserId,
  });
  return data;
};
