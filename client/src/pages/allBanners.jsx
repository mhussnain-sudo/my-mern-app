import { Button, Typography } from "@mui/material";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { useEffect, useState } from 'react';
import { getheaders } from '../apis/userApi'; // Adjust the path as needed

const baseurl = "http://localhost:3000";

export default function AllBanners() {
    const [headers, setHeaders] = useState([]);
    const [error, setError] = useState("");

    // Fetch headers when the component mounts
    useEffect(() => {
        const fetchHeaders = async () => {
            try {
                const data = await getheaders();
                setHeaders(data.headers); // Set the array of headers
            } catch (err) {
                setError(err.message || "Failed to fetch headers");
            }
        };

        fetchHeaders();
    }, []);

    const handleDelete = (bannerId) => {
        console.log(`Delete banner with ID: ${bannerId}`);
        // Implement your delete functionality here
    };

    if (error) {
        return <Typography color="error">Error: {error}</Typography>;
    }

    if (!headers.length) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <div className="flex flex-col px-4 gap-5">
            <div className="border shadow-lg w-max p-3">
                <h1 className="font-bold font-mono text-2xl">All Banners</h1>
            </div>
            <div className="flex flex-col justify-center items-center">
                {headers.map(header => (
                    <div key={header._id} className="flex flex-row justify-center items-center mb-4">
                        <img src={`${baseurl}${header.banner}`} alt="Banner" className="w-full h-[200px] object-cover" />
                        <Button sx={{ color: "red" }} onClick={() => handleDelete(header._id)}>
                            <DeleteForeverOutlinedIcon />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}