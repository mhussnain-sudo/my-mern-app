// CreateClub.jsx
import { useState } from 'react';
import FormComponent from '../components/form';
import { addPigeonOwner } from '../apis/userApi';
import { IconButton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
export default function CreatePigeonOwners(){
    const [pigeonAvatar, setpigeonAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [formValues, setFormValues] = useState({
        tournamentName: '',
        name: '',
        phone: '',
        city: ''
    });

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setpigeonAvatar(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };

    const handleSubmit = async (formData) => {
        console.log('Form Data:', { ...formData, pigeonAvatar });

        try {
            const data = await addPigeonOwner(formData.tournamentName, formData.name, formData.phone, formData.city, pigeonAvatar);
            console.log("Club created successfully:", data);
            // Reset form fields and avatar preview
            setFormValues({
                tournamentName: '',
                name: '',
                phone: '',
                city: '',
            });
            setpigeonAvatar(null);
            setAvatarPreview(null);
        } catch (error) {
            console.error("Error creating club:", error);
        }
    };

    return (
        <div className="flex flex-col px-4 gap-5">
            <div className="border shadow-lg w-max p-3">
                <h1 className="font-bold font-mono text-2xl">Add Pigeon Owner</h1>
            </div>
            <div className="flex justify-center items-center">
                <div className="flex flex-col border rounded-lg shadow-lg py-16 px-8 text-center justify-center items-center gap-8">
                    <div>
                        <input 
                            type="file" 
                            accept="image/jpeg,image/png" 
                            onChange={handleFileChange} 
                            style={{ display: 'none' }}
                            id="avatar-upload"
                        />
                        <label htmlFor="avatar-upload">
                            <IconButton component="span">
                                <Avatar 
                                    src={avatarPreview || '/default-avatar.png'}
                                    sx={{ width: 56, height: 56 }}
                                >
                                    <PhotoCamera />
                                </Avatar>
                            </IconButton>
                        </label>
                    </div>
                    <FormComponent 
                        onSubmit={handleSubmit} 
                        fields={[
                            { name: 'tournamentName', type: 'text', placeholder: 'Enter Tournament Name', value: formValues.clubName, onChange: handleInputChange },
                            { name: 'name', type: 'text', placeholder: 'Enter Name', value: formValues.clubName, onChange: handleInputChange },
                            { name: 'phone', type: 'text', placeholder: 'Enter Phone', value: formValues.ownerName, onChange: handleInputChange },
                            { name: 'city', type: 'text', placeholder: 'Enter City', value: formValues.ownerName, onChange: handleInputChange },
                        ]} 
                    />
                </div>
            </div>
        </div>
    );
}
