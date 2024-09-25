import { useState } from 'react';
import FormTournamentComponent from "../components/formTournament";

export default function CreateTournaments() {
    const [numberOfPrizes, setNumberOfPrizes] = useState(1);
    const [prizes, setPrizes] = useState(['']);

    const fields = [
        { name: 'tournamentImage', type: 'file' },
        { name: 'tournamentName', type: 'text', placeholder: 'Tournament Name' },
        { name: 'tournamentInfo', type: 'text', placeholder: 'Tournament Description' },
        { name: 'date', type: 'date' },
        { name: 'timeStart', type: 'time', placeholder: ' Start Time' },
        { name: 'numberOfContinueDays', type: 'number', placeholder: 'Tournament Days' },
        { name: 'numberOfPigeons', type: 'number', placeholder: 'Enter No. Of Pigeons' },
        { name: 'numberOfHelperPigeons', type: 'number', placeholder: 'Enter No. Of Helper Pigeons' },
        { name: 'numberOfLoftedPigeons', type: 'number', placeholder: 'Total Loft' },
        {
            name: 'numberOfPrizes',
            type: 'number',
            placeholder: 'Enter No. Of Prizes',
            value: numberOfPrizes,
            readOnly: true
        },
    ];

    const prizeFields = Array.from({ length: numberOfPrizes }, (_, index) => ({
        name: `prize${index + 1}`,
        type: 'text',
        placeholder: `Enter Prize ${index + 1}`,
        value: prizes[index] || '',
        onChange: (e) => {
            const updatedPrizes = [...prizes];
            updatedPrizes[index] = e.target.value;
            setPrizes(updatedPrizes);
        }
    }));

    const handleFormSubmit = (formData) => {
        console.log("Tournament Data Submitted:", formData);
    };

    return (
        <div className="flex flex-col px-4 gap-10">
            <div className="border shadow-lg w-max p-3">
                <h1 className="font-bold font-mono text-2xl">Create Tournament</h1>
            </div>
            <div className="">
                <FormTournamentComponent
                    onSubmit={handleFormSubmit}
                    fields={[...fields, ...prizeFields]}
                    numberOfPrizes={numberOfPrizes}
                    setNumberOfPrizes={setNumberOfPrizes}
                    setPrizes={setPrizes}
                />
            </div>
        </div>
    );
}
