// CreateClub.jsx
// CreateClub.jsx
import { useState } from 'react';
import FormComponent from '../components/form';
import { addClub } from '../apis/userApi';
import { IconButton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

export default function CreateClub() {
    const [clubAvatar, setClubAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [formValues, setFormValues] = useState({
        ownerName: '',
        password: ''
    });

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setClubAvatar(file);
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

        try {
            // eslint-disable-next-line no-unused-vars
            const data = await addClub( formData.ownerName, formData.password, clubAvatar);
            // Reset form fields and avatar preview
            setFormValues({
                ownerName: '',
                password: ''
            });
            setClubAvatar(null);
            setAvatarPreview(null);
        } catch (error) {
            console.error("Error creating club:", error);
        }
    };


    return (
        <div className="flex flex-col px-4 gap-5">
            <div className="border shadow-lg w-max p-3">
                <h1 className="font-bold font-mono text-2xl">Create Members</h1>
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
                            { name: 'ownerName', type: 'text', placeholder: 'Enter Member Name', value: formValues.ownerName, onChange: handleInputChange },
                            { name: 'password', type: 'password', placeholder: 'Password', value: formValues.password, onChange: handleInputChange },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}


