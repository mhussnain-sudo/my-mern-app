import PropTypes from 'prop-types';
import { Button } from "@mui/material";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import EditSharpIcon from '@mui/icons-material/EditSharp';

export default function TableBox({ headers, data, onEdit, onDelete }) {
    const baseURL = "http://localhost:3000";

    return (
        <div className="overflow-x-auto w-full max-w-full xl:p-4"> {/* Adjusted padding for smaller screens */}
            <table className="min-w-full border-collapse table-auto">
                <thead className="bg-gray-200">
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className="border px-2 py-2 text-center text-sm md:text-base">{header}</th>
                        ))}
                        <th className="border px-2 py-2 text-center text-sm md:text-base ">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr className="h-14 text-center border shadow-md text-sm md:text-base" key={index}>
                            <td className='flex justify-center items-center'>
                                <img 
                                    src={item.clubAvatar ? `${baseURL}${item.clubAvatar}` : "/images/dummyavatar.jpg"} 
                                    alt={`${item.clubName} Avatar`} 
                                    className="w-12 h-12 object-cover rounded-full md:w-16 md:h-16" // Responsive sizes for avatars
                                />
                            </td>
                            <td className="border px-2 py-2 text-sm md:text-base">{item.clubName}</td>
                            <td className="border px-2 py-2 text-sm md:text-base">{item.ownerName}</td>
                            <td className="border px-2 py-2 text-sm md:text-base">{item.email}</td>
                            <td className="border px-2 py-2 text-sm md:text-base">{item.password}</td>
                            <td className="justify-center items-center text-centerflex">
                                <Button onClick={() => onEdit(item)} sx={{ color: "blue" }}>
                                    <EditSharpIcon />
                                </Button>
                                <Button onClick={() => onDelete(item)} sx={{ color: "red" }}>
                                    <DeleteForeverOutlinedIcon />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

TableBox.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};
