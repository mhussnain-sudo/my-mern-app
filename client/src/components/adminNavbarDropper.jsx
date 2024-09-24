import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { Link } from 'react-router-dom';

export default function Sidebar() {
    return (
        <div className="flex flex-col h-screen w-52  shadow-md">
            <div className="flex flex-col py-4 space-y-2">
                {/* Sidebar Item: Club Details */}
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <MenuButton className="flex justify-between w-full rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
                            Club Details
                            <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
                        </MenuButton>
                    </div>
                    <MenuItems className="w-full mt-2 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                            <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
                        </MenuButton>
                    </div>
                    <MenuItems className="w-full mt-2 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                            <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
                        </MenuButton>
                    </div>
                    <MenuItems className="w-full mt-2 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            <MenuItem>
                                <Link to="/all-PigeonsOwners" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100">
                                    All Pigeon Owners
                                </Link>
                            </MenuItem>
                        </div>
                        <div className="py-1">
                            <MenuItem>
                                <Link to="/create-PigeonsOwners" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100">
                                    Create Pigeon Owners
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
                            <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
                        </MenuButton>
                    </div>
                    <MenuItems className="w-full mt-2 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
