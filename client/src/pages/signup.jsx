import { useAuth } from '../authContext/authContext';
import FormComponent from '../components/form'; // Adjust path if necessary
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import if you're using react-router for navigation

const Signup = () => {
    const { signupUser } = useAuth();
    const navigate = useNavigate();
    const [message, setMessage] = useState(''); // State for messages
    const handleSubmit = async (formData) => {
        console.log('Form Data:', formData); // Log the form data to check its structure
        try {
            await signupUser(formData); // Pass formData directly to signupUser
            navigate('/login'); // Navigate to the login page after signup
        } catch (error) {
            setMessage('Signup failed: ' + (error.response?.data.message || error.message)); // Handle error message
        }
    };
    const fields = [
        { name: 'ID', type: 'text', placeholder: 'ID' },
        { name: 'password', type: 'password', placeholder: 'Password' },
    ];

    return (
        <div className="flex flex-col h-screen justify-center items-center">
            <div className="border rounded-lg shadow-lg py-5 text-center justify-center items-center">
                <h3 className="text-slate-900 text-[32px] font-semibold">Sign Up</h3>
                <FormComponent onSubmit={handleSubmit} fields={fields} />
                {message && <p className="text-green-600">{message}</p>} {/* Display message */}
                <span>
                    Already have an Account? <Button size="small" href="/login">Login Now!</Button>
                </span>
            </div>
        </div>
    );
};

export default Signup;


