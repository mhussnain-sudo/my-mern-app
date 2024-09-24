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
export const logout = async () => {
  const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  return await api.post('/users/logout', {}, {
      headers: {
          Authorization: `Bearer ${token}` // Include the token in the headers
      }
  });
};




export const postHeader = async (formData) => {
  try {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage or your state management
      const response = await api.post('/users/upload-banner', formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}` // Attach the token
          }
      });
      return response.data; 
  } catch (error) {
      console.error('API Error:', error); 
      if (error.response) {
          throw error.response.data; 
      } else {
          throw { message: "Network error occurred" }; 
      }
  }
};

export const getheaders = async () => {
  try {
      const response = await api.get('/users/header'); // Adjust the endpoint as necessary
      return response.data;
    
 // Ensure this matches your expected structure
  } catch (error) {
      console.error('API Error:', error);
      if (error.response) {
          throw error.response.data; 
      } else {
          throw { message: "Network error occurred" }; 
      }
  }
};

  export const getAllClubs = async () => {
    try {
      const response = await api.get('/users/all-Clubs');
      return response.data;
    } catch (error) {
      throw error.response.data; 
    }
  };