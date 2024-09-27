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
      const token = localStorage.getItem('token');
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

export const getAllClubs = async (page = 1, limit = 10) => {
  try {
      const response = await api.get(`/users/all-Clubs?page=${page}&limit=${limit}`);
      return response.data; // Ensure your API returns { clubs: [], totalPages: number }
  } catch (error) {
      throw error.response.data; 
  }
};

export const addClub = async (clubName, ownerName, email, password, clubAvatar) => {
  try {
      const token = localStorage.getItem('token');
      const formData = new FormData(); // Create a FormData object
      formData.append('clubName', clubName);
      formData.append('ownerName', ownerName);
      formData.append('email', email);
      formData.append('password', password);
      if (clubAvatar) {
          formData.append('clubAvatar', clubAvatar); // Append the avatar file
      }

      const response = await api.post('/users/add-Club', formData, {
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data' // Set content type for FormData
          }
      });
      return response.data;
  } catch (error) {
      throw error.response.data; // Log the error message
  }
};
export const deleteClub = async ()=>{
    try {
        const token = localStorage.getItem('token');
        const response = await api.delete('/users/delete-club', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data; // Log the error message
    }
}

export const addTournament = async (formData)=>{
    try {
        const token = localStorage.getItem('token');
        const response = await api.post(`/users/add-Tournament`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // For file uploads
              Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const getAllTournaments = async (page = 1, limit = 10) => {
    try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/users/all-Tournaments?page=${page}&limit=${limit}`, {
            
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
        
    } catch (error) {
        throw error.response.data;
    }
}

export const deleteTournaments = async ()=>{
    try {
        const token = localStorage.getItem('token');
        const response = await api.delete('/users/delete-club', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data; // Log the error message
    }
}

export const addPigeonOwner = async (tournamentName, name, phone, city, pigeonAvatar) => {
    try {
        const token = localStorage.getItem('token');
        const formData = new FormData(); // Create a FormData object
        formData.append('tournamentName',tournamentName);
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('city', city);
        if (pigeonAvatar) {
            formData.append('pigeonAvatar', pigeonAvatar); // Append the avatar file
        }
  
        const response = await api.post('/users/add-pigeon', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data' // Set content type for FormData
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data; // Log the error message
    }
  };