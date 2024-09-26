/* eslint-disable no-unused-vars */
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../apis/userApi';

const AuthContext = createContext();

// Function to decode JWT
const decodeToken = (token) => {
    if (!token) return null;
    const payload = token.split('.')[1]; // Get the payload part
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload)); // Decode Base64Url
    return decoded;
};

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state for authentication checks
    const navigate = useNavigate();

    // Function to handle user login
    const loginUser = async (email, password) => {
        try {
            const response = await login(email, password);
            if (response.data.type === "success") {
                const { token, user } = response.data;
                localStorage.setItem('token', token);
                setUser({ id: user._id, role: user.role });
               if(user.role === "admin") {
                    navigate('/admin-dashboard'); 
               }else if(user.role === "clubowner"){
                     navigate('/clubowner-dashboard'); 
               }else{
                 navigate('/');
               }
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || error.message);
        }
    };

    // Check for token on mount and decode it
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = decodeToken(token);
            if (decoded) {
                setUser({ id: decoded.userId, role: decoded.role });
            } else {
                localStorage.removeItem('token'); // Clear invalid token
            }
        }
        setLoading(false); // Set loading to false after checking
    }, []);

    // Function to handle user signup
    const signupUser = async (userData) => {
        try {
            const response = await signup(userData);
            console.log("Registration successful, navigating to login...");
            navigate('/login'); // Navigate to login page after signup
        } catch (error) {
            console.error('Signup error:', error.response?.data || error.message);
            throw error; // Rethrow the error for further handling in the component
        }
    };

    // Function to handle user logout
    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem('token'); // Remove token
        navigate('/login'); // Redirect to login
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginUser, signupUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};
