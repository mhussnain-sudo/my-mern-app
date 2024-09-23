import Axios from 'axios'

const api = Axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Use the env variable
  });

  export const login = async (email, password) => {
    return await api.post('/users/login', { email, password });
};

export const signup = async (userData) => {
  return await api.post('/users/register', userData); // Ensure userData is an object with email and password
};

  export const getheaders = async () => {
    try {
      const response = await api.get('/users/header');
      console.log('API Response:', response); // Log the full response
      return response.data; // Ensure this matches your expected structure
    } catch (error) {
      console.error('API Error:', error); // Log the error
      // Check if error.response exists
      if (error.response) {
        throw error.response.data; 
      } else {
        throw { message: "Network error occurred" }; // Handle network errors
      }
    }
  };

  export const getAllClubs = async () => {
    try {
      const response = await api.get('/users/all-Clubs');
      console.log('API Response:', response); // Log the full response
      return response.data;
    } catch (error) {
      throw error.response.data; 
    }
  };