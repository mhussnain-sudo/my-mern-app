/* eslint-disable no-unused-vars */
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../apis/userApi';

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const loginUser = async (email, password) => {
        const response = await login(email, password);
        
        if (response.data.type === "success") {
            const { token, userId } = response.data; // Destructure token and userId
            setUser({ id: userId }); // Set user state with the user ID
            localStorage.setItem('token', token); // Save token
            navigate('/'); // Redirect to home after login
        } else {
            // Handle login failure (e.g., show an error message)
            console.error(response.data.message);
        }
    };
    

    const signupUser = async (userData) => {
        try {
            const response = await signup(userData);
            console.log("Registration successful, navigating to login...");
            navigate('/login'); // Navigate to the login page after signup
        } catch (error) {
            console.error('Signup error:', error.response?.data || error.message);
            throw error; // Rethrow the error for further handling in the component
        }
    };
    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem('token'); // Remove token
        navigate('/login'); // Redirect to login
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, signupUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
