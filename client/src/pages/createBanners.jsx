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
        <div className="flex flex-col px-4">
            <div className="border shadow-lg w-max p-3">
                <h1 className="font-bold font-mono text-2xl">Add New Banner</h1>
            </div>
            <div className="flex justify-center items-center py-20">
                <Box className="flex flex-col border shadow-md rounded-lg">
                    <Box className="w-max h-max border shadow-md rounded-lg p-4 gap-3 justify-center text-center">
                        <div className="flex flex-col gap-3">
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
                            >
                                <InboxOutlinedIcon sx={{ color: "black", fontSize: "60px" }} />
                            </Button>
                            <Box>
                                <Typography sx={{ fontSize: "16px" }}>
                                    Click the Icon For Uploading
                                </Typography>
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: "14px" }}>
                                    Support for Single or 5 Uploading Files at once
                                </Typography>
                            </Box>
                            <Button onClick={handleUpload} variant="contained" color="primary">
                                Upload Banners
                            </Button>
                            {message && <Typography color="error">{message}</Typography>}
                        </div>
                    </Box>
                </Box>
            </div>
        </div>
    );
}
