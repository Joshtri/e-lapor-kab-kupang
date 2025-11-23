import axios from 'axios';

/**
 * Fetch all users
 */
export const fetchUsers = async () => {
  const { data } = await axios.get('/api/users');
  return data;
};

/**
 * Fetch users by role (e.g., 'OPD', 'PELAPOR', 'ADMIN', 'BUPATI')
 */
export const fetchUsersByRole = async (role) => {
  const { data } = await axios.get('/api/users/by-role', {
    params: { role },
  });
  return data;
};

/**
 * Fetch incomplete user profiles
 * Returns array of user IDs that have incomplete profiles
 */
export const fetchIncompleteProfiles = async () => {
  const { data } = await axios.get('/api/opd/incompleted-users');
  // API returns { incompleteUsers: [...] }, extract IDs only
  return data.incompleteUsers?.map(user => user.id) || [];
};

/**
 * Delete a user by ID
 */
export const deleteUser = async (userId) => {
  const { data } = await axios.delete(`/api/users/${userId}`);
  return data;
};

/**
 * Create a new OPD staff member
 * Staff OPD uses NIP (18 digits) instead of NIK (16 digits)
 */
export const createStaffOpd = async (staffData) => {
  const { data } = await axios.post('/api/opd/staff', staffData);
  return data;
};
