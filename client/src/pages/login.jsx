// src/pages/Login.jsx
import { useAuth } from '../authContext/authContext';
import FormComponent from '../components/form';
import Button from '@mui/material/Button';

const Login = () => {
    const { loginUser } = useAuth();

    const handleSubmit = ({ email, password }) => {
        console.log('Form Data:', { email, password });
        loginUser(email, password);
    };
    

    const fields = [
        { name: 'email', type: 'email', placeholder: 'Email' },
        { name: 'password', type: 'password', placeholder: 'Password' },
    ];

    return (
        <div className="flex flex-col h-screen  justify-center items-center">
            <div className="border  rounded-lg shadow-lg py-5  text-center justify-center items-center">
            <h3 className="text-slate-900 text-[32px] font-semibold">Login</h3>
            <FormComponent onSubmit={handleSubmit} fields={fields} />
            <span>Dont have an Account?<Button size="small" href="/Signup" >Signup Now!</Button></span>
            </div>
        </div>
    );
};

export default Login;
