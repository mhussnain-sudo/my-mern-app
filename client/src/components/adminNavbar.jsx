import { Button } from "@mui/material"
import { useNavigate } from 'react-router-dom'; // Make sure to import useNavigate
import { logout } from '../apis/userApi';
export default function AdminNavbar() {

    const navigate = useNavigate();

    const logoutUser = async () => {
        try {
            await logout(); // Call the logout API
            localStorage.removeItem('token'); // Remove token from local storage
            navigate('/'); // Redirect to login page
        } catch (error) {
            console.error('Logout Error:', error.response?.data || error.message); // Handle any errors here
            if (error.response?.status === 401) {
                // Handle unauthorized error
                navigate('/'); // Redirect to login if unauthorized
            }
        }
    };
    return(
        <div>
        <div className="flex flex-row justify-between gap-5 p-4 bg-slate-100">
                <div className="px-28">
                    <h2 className="text-2xl">SONA PUNJAB</h2>
                </div>
                <div>
                    <Button onClick={logoutUser}>LOGOUT</Button>
                </div>
            </div>
            </div>
    )
}
