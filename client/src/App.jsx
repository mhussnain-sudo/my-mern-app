import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './authContext/authContext';
import Login from './pages/login';
import Signup from './pages/signup';
import Home from './pages/home';

function App() {
    const { user } = useAuth(); // Access user from AuthContext

    return (
        <div className='flex flex-col px-4 gap-3'>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
                {/* Redirect to login if the user is not authenticated */}
            </Routes>
        </div>
    );
}

export default App;
