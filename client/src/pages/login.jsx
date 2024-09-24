// src/pages/Login.jsx

import { useAuth } from '../authContext/authContext';
import FormComponent from '../components/form';
const Login = () => {
    const { loginUser } = useAuth();

    const handleSubmit = ({ email, password }) => {
        loginUser(email, password);
    };
    

    const fields = [
        { name: 'email', type: 'email', placeholder: 'Email' },
        { name: 'password', type: 'password', placeholder: 'Password' },
    ];

    return (
        <div className="flex flex-col h-screen  justify-center items-center">
            <h1 className=" font-bold text-3xl text-red-600 my-2 ">SONA PUNJAB</h1>
            <div className="border  rounded-lg shadow-lg py-5  text-center justify-center items-center">
            <h3 className="text-slate-900 text-[32px] font-semibold">Login</h3>
            <FormComponent onSubmit={handleSubmit} fields={fields} />
            </div>
        </div>
    );
};

export default Login;
