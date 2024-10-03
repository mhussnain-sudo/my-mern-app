import PropTypes from 'prop-types';
import { Button } from "@mui/material";
import {Link} from 'react-router-dom'


export default function TableBox({ headers, data }) {
    const baseURL = "http://localhost:3000";


    return (
        <div className="overflow-x-auto"> {/* Horizontal scroll for small screens */}
            <table className="min-w-full border-collapse">
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                className="border px-2 py-2 text-xs sm:text-sm md:text-base "
                            >
                                {header}
                            </th>
                        ))}
                       {/* <th className="border px-2 py-2 text-xs sm:text-sm md:text-base ">
                            Actions
                        </th>*/}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr
                            className="justify-center h-14 items-center content-center text-center border shadow-md gap-2"
                            key={index}
                        >
                            <td className="flex justify-center items-center">
                                {item.tournamentImage ? (
                                    <img
                                        src={`${baseURL}${item.tournamentImage}`}
                                        alt={`${item.tournamentName} Avatar`}
                                        className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover"
                                    />
                                ) : (
                                    <img
                                        src="/images/dummyavatar.jpg"
                                        alt="defaultAvatar"
                                        className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover"
                                    />
                                )}
                            </td>
                            <td className="border px-2 py-2 text-xs sm:text-sm md:text-base ">
                                {item.tournamentName}
                            </td>
                            <td className="border px-2 py-2 text-xs sm:text-sm md:text-base ">
                                {item.numberOfPigeons !== undefined ? item.numberOfPigeons : "N/A"}
                            </td>
                            <td className="border px-2 py-2 text-xs sm:text-sm md:text-base ">
                                {item.date}
                            </td>
                            <td className="border px-2 py-2 text-xs sm:text-sm md:text-base ">
                                <Button
                                    size="small"
                                >
                                   <Link className="text-sm" to="/create-PigeonsOwners"> Add Participant</Link>
                                </Button>
                            </td>
                            <td className="border px-2 py-2 text-xs sm:text-sm md:text-base ">
                                {item.status}
                            </td>
                            {/*<td className="justify-center items-center text-center border gap-2">
                                <Button onClick={() => onEdit(item)} sx={{ color: "blue" }}>
                                    <EditSharpIcon className="text-base" />
                                </Button>
                                <Button onClick={() => onDelete(item)} sx={{ color: "red" }}>
                                    <DeleteForeverOutlinedIcon className="text-base" />
                                </Button>
                            </td>*/}
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
