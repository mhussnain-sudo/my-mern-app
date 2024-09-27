import { Box, Typography } from "@mui/material";
import Button from '@mui/material/Button';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { useRef, useState, useEffect } from 'react';
import { postHeader } from '../apis/userApi'; 

export default function CreateBanners() {
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [message, setMessage] = useState("");
    const [timeoutId, setTimeoutId] = useState(null); 

    const handleOpenImageFunction = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const selectedFiles = event.target.files;
        if (selectedFiles.length > 0) {
            setFiles(selectedFiles); 
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setMessage("No files selected for upload");
            return;
        }

        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('banners', file); 
        });

        try {
            await postHeader(formData); 
            setMessage("Banners uploaded successfully!");
            setFiles([]); 
            fileInputRef.current.value = null; 
            
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            
            const id = setTimeout(() => {
                setMessage(""); 
            }, 3000);
            setTimeoutId(id); 
        } catch (error) {
            setMessage("Error uploading banners: " + (error.message || "An error occurred"));
        }
    };

    // Clean up the timeout if the component unmounts
    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    return (
        <div className="flex flex-col px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 gap-5"> {/* Responsive padding for different screen sizes */}
            <div className="border shadow-lg w-full sm:w-max p-3 text-center">
                <h1 className="font-bold font-mono text-2xl">Add New Banner</h1>
            </div>
            <div className="flex justify-center items-center py-10">
                <Box className="flex flex-col border shadow-md rounded-lg w-full max-w-lg"> {/* Limit width on larger screens */}
                    <Box className="w-full h-max border shadow-md rounded-lg p-6 gap-3 justify-center text-center">
                        <div className="flex flex-col gap-5">
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                multiple // Allow multiple file uploads
                            />
                            <Button
                                sx={{
                                    '&:hover': {
                                        backgroundColor: "ButtonShadow"
                                    }
                                }}
                                onClick={handleOpenImageFunction}
                                className="mx-auto"
                            >
                                <InboxOutlinedIcon sx={{ color: "black", fontSize: { xs: "40px", md: "60px" } }} /> {/* Responsive icon size */}
                            </Button>
                            <Box>
                                <Typography sx={{ fontSize: { xs: "14px", md: "16px" } }}>
                                    Click the Icon For Uploading
                                </Typography>
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: { xs: "12px", md: "14px" } }}>
                                    Support for Single or 5 Uploading Files at once
                                </Typography>
                            </Box>
                            <Button
                                onClick={handleUpload}
                                variant="contained"
                                color="primary"
                                sx={{ fontSize: { xs: "12px", md: "14px" }, padding: { xs: "6px 12px", md: "8px 16px" } }} // Responsive button size
                            >
                                Upload Banners
                            </Button>
                            {message && <Typography color="error" sx={{ fontSize: { xs: "12px", md: "14px" } }}>{message}</Typography>}
                        </div>
                    </Box>
                </Box>
            </div>
        </div>
    );
}
