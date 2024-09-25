import PropTypes from 'prop-types';
import { Button } from "@mui/material";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import EditSharpIcon from '@mui/icons-material/EditSharp';

export default function TableBox({ headers, data, onEdit, onDelete }) {
    const baseURL = "http://localhost:3000";

    return (
        <table className="min-w-full border-collapse">
            <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th key={index} className="border px-4 py-2">{header}</th>
                    ))}
                    <th className="border px-4 py-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr className="justify-center h-14 items-center content-center text-center border shadow-md gap-2" key={index}>
                        <td className='flex justify-center items-center content-center text-center'>
                            {item.clubAvatar ? (
                                <img 
                                    src={`${baseURL}${item.clubAvatar}`} 
                                    alt={`${item.clubName} Avatar`} 
                                    className="w-16 h-16 object-cover"
                                />
                            ) : (
                                <img 
                                    src="/images/dummyavatar.jpg" 
                                    alt="defaultAvatar" 
                                    className="w-16 h-16 object-cover" 
                                />
                            )}
                        </td>
                        <td className="border px-4 py-2">{item.clubName}</td>
                        <td className="border px-4 py-2">{item.ownerName}</td>
                        <td className="border px-4 py-2">{item.email}</td>
                        <td className="border px-4 py-2">{item.password}</td>
                        <td className="justify-center items-center text-center border gap-2">
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
    );
}

TableBox.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};
