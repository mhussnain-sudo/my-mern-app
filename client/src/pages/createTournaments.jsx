import { useState } from 'react';
import FormTournamentComponent from "../components/formTournament";
import { addTournament } from '../apis/userApi';
import { ToastContainer, toast } from 'react-toastify'; // Import toast here

export default function CreateTournaments() {
    const [numberOfPrizes, setNumberOfPrizes] = useState(1);
    const [prizes, setPrizes] = useState(['']);

    const fields = [
        { name: 'tournamentImage', type: 'file' },
        { name: 'tournamentName', type: 'text', placeholder: 'Tournament Name' },
        { name: 'tournamentInfo', type: 'text', placeholder: 'Tournament Description' },
        { name: 'date', type: 'date' },
        { name: 'timeStart', type: 'time' },
        { name: 'numberOfPigeons', type: 'number', placeholder: 'Enter No. Of Pigeons' },
        { name: 'numberOfHelperPigeons', type: 'number', placeholder: 'Enter No. Of Helper Pigeons' },
        { name: 'numberOfLoftedPigeons', type: 'number', placeholder: 'Total Loft' },
    ];

    const handleFormSubmit = async (formData) => {
        const formDataWithPrizesAndDates = {
            ...formData,
            continueDates: JSON.stringify(formData.continueDates.map(date => ({ date }))),
            prizes: JSON.stringify(formData.prizes.map(prize => ({ name: prize }))),
            numberOfPrizes
        };

        console.log("Submitting form data:", formDataWithPrizesAndDates); // Debugging line
        try {
            const result = await addTournament(formDataWithPrizesAndDates);
            console.log("Tournament created successfully:", result);
            toast.success("Tournament created successfully!"); // Toast on success
        } catch (error) {
            console.error("Error creating tournament:", error);
            toast.error("Error creating tournament: " + error.message); // Toast on error
        }
    };

    return (
        <div className="flex flex-col px-4 gap-10">
            <ToastContainer />
            <div className="border shadow-lg w-max p-3">
                <h1 className="font-bold font-mono text-2xl">Create Tournament</h1>
            </div>
            <FormTournamentComponent
                onSubmit={handleFormSubmit}
                fields={fields}
                numberOfPrizes={numberOfPrizes}
                setNumberOfPrizes={setNumberOfPrizes}
                setPrizes={setPrizes}
                prizes={prizes}
            />
        </div>
    );
}
