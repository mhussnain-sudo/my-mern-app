import { useState, useEffect, useRef } from 'react'; // Import useState and useEffect for managing sidebar state and outside click detection
import { Sidebar } from "flowbite-react";
import { HiChartPie } from "react-icons/hi";
import { SiClubforce } from "react-icons/si";
import { TbTournament } from "react-icons/tb";
import { GiSparrow } from "react-icons/gi";
import { HiBars3BottomLeft } from "react-icons/hi2";
import { HiBars3BottomRight } from "react-icons/hi2";
import { Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { logout } from '../apis/userApi';

export default function SidebarComponent() {
  const navigate = useNavigate();

  const logoutUser = async () => {
      try {
          await logout();
          localStorage.removeItem('token');
          navigate('/');
      } catch (error) {
          console.error('Logout Error:', error.response?.data || error.message);
          if (error.response?.status === 401) {
              navigate('/');
          }
      }
  };

  const [isOpen, setIsOpen] = useState(false); // State for managing sidebar visibility
  const sidebarRef = useRef(null); // Create a ref for the sidebar

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    };

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="h-screen flex absolute lg:relative"> {/* Flex container for positioning */}
      {/* Wrapper for the Sidebar to handle refs */}
      <div ref={sidebarRef} className="h-full">
        {/* Sidebar for all screen sizes */}
        <Sidebar
          aria-label="Sidebar with multi-level dropdown example"
          className={`lg:w-64 transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed left-0 top-0 h-full bg-white shadow-lg z-50 justify-between lg:relative lg:translate-x-0 flex flex-col`}
        >
          {/* Sidebar content that should take up available space */}
          <div className="flex-grow overflow-y-auto"> {/* Flex-grow to take up remaining space and allow scrolling */}
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                {/* Dashboard */}
                <Sidebar.Item href="/admin-dashboard" icon={HiChartPie} className="text-blue-700 font-bold">
                  Dashboard
                </Sidebar.Item>

                {/* Clubs Dropdown */}
                <Sidebar.Collapse label={<div className="flex items-center"><SiClubforce className="mr-2 text-blue-700 font-bold" /> Members</div>}>
                  <Sidebar.Item href="/all-members">All Members</Sidebar.Item>
                  <Sidebar.Item href="/create-members">Create Members</Sidebar.Item>
                </Sidebar.Collapse>

                {/* Tournaments Dropdown */}
                <Sidebar.Collapse label={<div className="flex items-center"><TbTournament className="mr-2 text-blue-700 font-bold" /> Tournaments</div>}>
                  <Sidebar.Item href="/all-tournaments">All Tournaments</Sidebar.Item>
                  <Sidebar.Item href="/create-tournaments">Create Tournament</Sidebar.Item>
                </Sidebar.Collapse>

                {/* Pigeon Owners Dropdown */}
                <Sidebar.Collapse label={<div className="flex items-center"><GiSparrow className="mr-2 text-blue-700 font-bold" /> Pigeons</div>}>
                  <Sidebar.Item href="/add-PigeonsResult">Add Pigeon Result</Sidebar.Item>
                  <Sidebar.Item href="/create-PigeonsOwners">Add Pigeon Owners</Sidebar.Item>
                </Sidebar.Collapse>

                {/* Banners Dropdown */}
                <Sidebar.Collapse label={<div className="flex items-center"><TbTournament className="mr-2 text-blue-700 font-bold" /> Banners</div>}>
                  <Sidebar.Item href="/all-banners">All Banner</Sidebar.Item>
                  <Sidebar.Item href="/create-banners">Add Banners</Sidebar.Item>
                </Sidebar.Collapse>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </div>

          {/* Logout Button placed at the bottom */}
          <div className="p-4 self-end w-full"> {/* Self-end to stick the logout button to the bottom */}
            <Button variant="contained" onClick={logoutUser} className="w-full sm:w-auto">
                LOGOUT
            </Button>
          </div>
        </Sidebar>
      </div>

      {/* Toggle Button for Mobile */}
      <button
        className="lg:hidden fixed top-4 right-4 z-10 bg-gray-100 text-white p-2 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <HiBars3BottomRight className="text-blue-700"/> : <HiBars3BottomLeft className="text-blue-700"/>}
      </button>
    </div>
  );
}
