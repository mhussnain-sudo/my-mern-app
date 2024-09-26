import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './authContext/authContext';
import Login from './pages/login';
import Signup from './pages/signup';
import Home from './pages/home';
import AdminDashboard from './pages/adminDashboard';
import ClubDashboard from './pages/clubDashboard';
import AllClubs from './pages/allClubs';
import CreateClub from './pages/createClub';
import AllTournaments from './pages/alltournaments';
import CreateTournaments from './pages/createTournaments';
import AddPigeonsResult from './pages/addPigeonResult';
import CreatePigeonOwners from './pages/addPigeonOwners';
import AllBanners from './pages/allBanners';
import CreateBanners from './pages/createBanners';
import AdminLayout from './pages/adminLayout';

function App() {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>; // Show a loading state while checking auth

    return (
        <div className='flex flex-col px-4 gap-3'>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Home />} />
                <Route path="/admin-dashboard" element={user && user.role === "admin" ? <AdminLayout><AdminDashboard /></AdminLayout> : <Navigate to="/" />} />
                <Route path="/clubowner-dashboard" element={user && user.role === "clubowner" ? <AdminLayout><ClubDashboard /></AdminLayout> : <Navigate to="/" />} />

                <Route path="/all-clubs" element={user && user.role === "admin" ? <AdminLayout><AllClubs /></AdminLayout> : <Navigate to="/" />} />
                <Route path="/create-club" element={user && user.role === "admin" ? <AdminLayout><CreateClub /></AdminLayout> : <Navigate to="/" />} />
                <Route path="/all-tournaments" element={user && user.role === "admin" ? <AdminLayout><AllTournaments /></AdminLayout> : <Navigate to="/" />} />
                <Route path="/create-tournaments" element={user && user.role === "admin" ? <AdminLayout><CreateTournaments /></AdminLayout> : <Navigate to="/" />} />
                <Route path="/add-PigeonsResult" element={user && (user.role === "admin" || user.role === "clubowner") ? <AdminLayout><AddPigeonsResult /></AdminLayout> : <Navigate to="/" />} />

                <Route path="/create-PigeonsOwners" element={user &&(user.role === "admin" || user.role === "clubowner") ? <AdminLayout><CreatePigeonOwners /></AdminLayout> : <Navigate to="/" />} />
                <Route path="/all-banners" element={user && user.role === "admin" ? <AdminLayout><AllBanners /></AdminLayout> : <Navigate to="/" />} />
                <Route path="/create-banners" element={user && user.role === "admin" ? <AdminLayout><CreateBanners /></AdminLayout> : <Navigate to="/" />} />
            </Routes>
        </div>
    );
}

export default App;
