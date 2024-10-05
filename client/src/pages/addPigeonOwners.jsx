import { useEffect, useState } from 'react';
import FormPigeonOwnerComponent from '../components/formPigeonOwner';
import { addPigeonOwner, getEveryTournament } from '../apis/userApi';
import { IconButton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function CreatePigeonOwners() {
    const [pigeonAvatar, setPigeonAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [formValues, setFormValues] = useState({
        name: '',
        phone: '',
        city: ''
    });
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null); // Separate state for selected tournament

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await getEveryTournament();
                if (response.tournaments && Array.isArray(response.tournaments)) {
                    setTournaments(response.tournaments);
                } else {
                    setTournaments([]);
                }
            } catch (error) {
                console.error("Error fetching tournaments:", error);
                toast.error("Error fetching tournaments: " + error.message);
            }
        };

        fetchTournaments();
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setPigeonAvatar(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleFormChange = (newFormValues) => {
        setFormValues(prevValues => ({
            ...prevValues,
            ...newFormValues
        }));
    };

    const handleSubmit = async (formData) => {
        const completeData = { 
            tournamentName: selectedTournament ? selectedTournament.tournamentName : '', // Use selectedTournament
            ...formValues, 
            ...formData, 
            pigeonAvatar 
        };

        // If phone is not provided, set it to null
        if (!completeData.phone) {
            completeData.phone = null; // or you can use undefined based on your API's requirement
        }

        console.log('Form Data:', completeData);

        try {
            const data = await addPigeonOwner(
                completeData.tournamentName, 
                completeData.name, 
                completeData.phone, 
                completeData.city, 
                pigeonAvatar
            );
            console.log("Pigeon created successfully:", data);
            toast.success("Pigeon added successfully!");

            // Reset form values, including tournamentName
            setFormValues({
                name: '',
                phone: '',
                city: '',
            });
            setSelectedTournament(null); // Reset selected tournament
            setPigeonAvatar(null);
            setAvatarPreview(null);
        } catch (error) {
            console.error("Error creating pigeon owner:", error);
            toast.error("Error adding pigeon owner. Please try again.");
        }
    };

    return (
        <div className="flex flex-col px-4 gap-5">
            <ToastContainer />
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
                    <Autocomplete
                        options={tournaments}
                        getOptionLabel={(option) => option.tournamentName || ""}
                        onChange={(event, value) => {
                            setSelectedTournament(value); // Update selected tournament
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Enter Tournament" variant="outlined" />
                        )}
                        style={{ width: '100%' }}
                        value={selectedTournament} // Control the value of Autocomplete
                    />
                    <FormPigeonOwnerComponent
                        onSubmit={handleSubmit}
                        fields={[
                            { name: 'name', type: 'text', placeholder: 'Enter Name' },
                            { name: 'phone', type: 'text', placeholder: 'Enter Phone (optional)' },
                            { name: 'city', type: 'text', placeholder: 'Enter City' },
                        ]}
                        formValues={formValues}
                        onFormChange={handleFormChange}
                    />
                </div>
            </div>
        </div>
    );
}
