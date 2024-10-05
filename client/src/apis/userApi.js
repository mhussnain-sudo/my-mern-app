import Axios from 'axios'

const api = Axios.create({
    baseURL:"http://localhost:3000/api", // Use the env variable
  });
export const setrole = async(role)=>{
  return  await api.post('/users/set-role',{role})
}


  export const login = async (ID, password) => {
   console.log('login api hit')
    return await api.post('/users/login', { ID, password });
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
       console.log(response);
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
  
  export const getAllMembers = async (page = 1, limit = 10) => {
    try {
        const response = await api.get(`/users/all-members?page=${page}&limit=${limit}`);
        return response.data; // Ensure your API returns { clubs: [], totalPages: number }
    } catch (error) {
        throw error.response.data;
    }
  };
  export const getClubs = async () => {
      try {
          const response = await api.get(`/users/Clubs`);
          return response.data.data; // Adjust this to access the clubs properly
      } catch (error) {
          throw error.response.data;
      }
  };
  export const addMember = async (ownerName,ID, password, avatar) => {
    try {
        const token = localStorage.getItem('token');
        const formData = new FormData(); // Create a FormData object
        formData.append('ownerName', ownerName);
        formData.append('ID',ID);
        formData.append('password', password);
        if (avatar) {
            formData.append('avatar', avatar); // Append the avatar file
        }
  
        const response = await api.post('/users/add-members', formData, {
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

export const getEveryTournament = async ()=>{
    try {
    
        const response = await api.get('/users/every-tournament', {

       
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

  export const addPigeonResult = async (tournamentName, name, startTime, numberOfPigeons, pigeonResults) => {
    try {
        const token = localStorage.getItem('token');

        const formData = {
            tournamentName,
            name,
            startTime,
            numberOfPigeons,
            pigeonResults
        };

        const response = await api.post('/users/add-pigeonresults', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data; // Return the successful response data
    } catch (error) {
        console.error('Error adding pigeon results:', error);
        if (error.response) {
            throw error.response.data; // Rethrow the error response
        } else {
            throw { message: "Network error occurred" }; // Handle network errors
        }
    }
};
export const getPigeonResult =async()=>{
    try {
        const token = localStorage.getItem('token');
        const response = await api.get('/users/every-pigeonResults', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}


