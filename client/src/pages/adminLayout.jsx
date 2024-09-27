// AdminLayout.jsx

import PropTypes from 'prop-types'; // Import PropTypes
import Sidebar from '../components/adminNavbarDropper'; // Adjust the path as needed
import AdminNavbar from '../components/adminNavbar';
const AdminLayout = ({ children }) => {
    return (
        <div className="flex flex-col">
        <AdminNavbar/>
        <div className="flex flex-col  md:flex-row ">
           
            <Sidebar />
            <div className="md:flex-1 xl:flex-1 bg-slate-50 mt-2 ">
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