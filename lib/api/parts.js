const API_BASE_URL = '/api';

export const getPartsByCategory = async (categoryId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/categories/${categoryId}/parts`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch parts');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching parts by category:', error);
    throw error;
  }
};
