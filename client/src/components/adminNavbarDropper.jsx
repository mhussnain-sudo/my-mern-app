import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";


import { Link } from 'react-router-dom';

export default function Sidebar() {
    return (
        <div className="flex  justify-between items-center  w-full  shadow-md">
            <div className="flex w-full justify-evenly items-center  py-4 space-y-2">
                {/* Sidebar Item: Club Details */}
                <Menu as="div" className="relative inline-block text-center">
                    <div>
                        <MenuButton className="flex justify-between w-full rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
                            Club Details
                            
                        </MenuButton>
                    </div>
                    <MenuItems className=" absolute w-max mt-2 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            <MenuItem>
                                <Link to="/all-clubs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100">
                                    All Clubs
                                </Link>
                            </MenuItem>
                            <MenuItem>
                                <Link to="/create-club" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100">
                                    Create Clubs
                                </Link>
                            </MenuItem>
                        </div>
                    </MenuItems>
                </Menu>

                {/* Sidebar Item: Tournaments */}
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <MenuButton className="flex justify-between w-full rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
                            Tournaments
                          
                        </MenuButton>
                    </div>
                    <MenuItems className="absolute w-max mt-2 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            <MenuItem>
                                <Link to="/all-tournaments" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100">
                                    All Tournaments
                                </Link>
                            </MenuItem>
                            <MenuItem>
                                <Link to="/create-tournaments" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100">
                                    Create Tournaments
                                </Link>
                            </MenuItem>
                        </div>
                    </MenuItems>
                </Menu>

                {/* Sidebar Item: Pigeon Owners */}
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <MenuButton className="flex justify-between w-full rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
                            Pigeon Owners
                            
                        </MenuButton>
                    </div>
                    <MenuItems className=" absolute w-max mt-2 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            <MenuItem>
                                <Link to="/add-PigeonsResult" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100">
                                    Add Pigeons Result
                                </Link>
                            </MenuItem>
                        </div>
                        <div className="py-1">
                            <MenuItem>
                                <Link to="/create-PigeonsOwners" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100">
                                    Add Pigeons Owners
                                </Link>
                            </MenuItem>
                        </div>
                    </MenuItems>
                </Menu>

                {/* Sidebar Item: Banners */}
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <MenuButton className="flex justify-between w-full rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
                            Banners
                          
                        </MenuButton>
                    </div>
                    <MenuItems className=" absolute w-max  mt-2 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            <MenuItem>
                                <Link to="/all-banners" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100">
                                    All Banners
                                </Link>
                            </MenuItem>
                            <div className="py-1">
                            <MenuItem>
                                <Link to="/create-banners" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100">
                                    Create Banners
                                </Link>
                            </MenuItem>
                        </div>
                        </div>
                    </MenuItems>
                </Menu>
            </div>
        </div>
    );
}
