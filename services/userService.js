import axios from 'axios';

/**
 * Fetch all users
 */
export const fetchUsers = async () => {
  const { data } = await axios.get('/api/users');
  return data;
};

/**
 * Fetch incomplete user profiles (OPD users with incomplete profile data)
 */
export const fetchIncompleteProfiles = async () => {
  const { data } = await axios.get('/api/opd/incompleted-users');
  return data.incompleteUsers.map((u) => u.id);
};

/**
 * Delete a user by ID
 */
export const deleteUser = async (id) => {
  await axios.delete(`/api/users/${id}`);
};

/**
 * Fetch user detail by ID
 */
export const fetchUserDetail = async (id) => {
  const { data } = await axios.get(`/api/users/${id}`);
  return data;
};
