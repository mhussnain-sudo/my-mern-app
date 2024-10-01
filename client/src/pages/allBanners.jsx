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
                console.log(setHeaders(data.headers));
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

    if (!headers) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <div className="flex flex-col gap-5 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24"> {/* Responsive padding */}
            <div className="border shadow-lg w-full sm:w-max p-3 text-center"> {/* Full width on small screens */}
                <h1 className="font-bold font-mono text-2xl">All Banners</h1>
            </div>
            <div className="flex flex-col justify-center items-center gap-6"> {/* Gap added for spacing between banners */}
                {headers.map(header => (
                    <div key={header._id} className="flex flex-col md:flex-row justify-between items-center w-full max-w-4xl gap-4 border rounded-lg p-4 shadow-lg"> {/* Stack on small screens, row layout on medium+ screens */}
                        <img 
                            src={`${baseurl}${header.banner}`} 
                            alt="Banner" 
                            className="w-full h-auto md:h-[200px] object-cover rounded-lg" 
                        />
                        <Button 
                            sx={{ color: "red", minWidth: "40px" }} 
                            onClick={() => handleDelete(header._id)}
                        >
                            <DeleteForeverOutlinedIcon />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
