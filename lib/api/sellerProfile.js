import axios from 'axios';

const API_BASE_URL = '/api/seller';

export const sellerProfileService = {
  // Get current seller's profile
  async getProfile() {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/profile`);
      return data;
    } catch (error) {
      console.error('Error fetching seller profile:', error);
      throw error.response?.data || { message: 'Error fetching profile' };
    }
  },

  // Update seller profile
  async updateProfile(updateData) {
    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/profile`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return data;
    } catch (error) {
      console.error('Error updating seller profile:', error);
      throw error.response?.data || { message: 'Error updating profile' };
    }
  },

  // Get seller public profile by ID
  async getPublicProfile(sellerId) {
    try {
      const { data } = await axios.get(`/api/sellers/${sellerId}`);
      return data;
    } catch (error) {
      console.error('Error fetching public seller profile:', error);
      throw error.response?.data || { message: 'Error fetching seller profile' };
    }
  },
};

export default sellerProfileService;
