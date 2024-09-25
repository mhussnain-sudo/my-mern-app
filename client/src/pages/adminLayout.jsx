// AdminLayout.jsx

import PropTypes from 'prop-types'; // Import PropTypes
import Sidebar from '../components/adminNavbarDropper'; // Adjust the path as needed
import AdminNavbar from '../components/adminNavbar';
const AdminLayout = ({ children }) => {
    return (
        <div className="flex flex-col">
        <AdminNavbar/>
        <div className="flex flex-col">
           
            <Sidebar />
            <div className="flex-1 bg-slate-50 p-4">
                {children}
            </div>
        </div>
        </div>
    );
};

// Add prop types validation
AdminLayout.propTypes = {
    children: PropTypes.node.isRequired, // Specify that children is required and can be any renderable node
};

export default AdminLayout;