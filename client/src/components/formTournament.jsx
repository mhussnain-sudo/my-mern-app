import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';

const FormTournamentComponent = ({ onSubmit, fields, numberOfPrizes, setNumberOfPrizes, setPrizes }) => {
    const [formData, setFormData] = useState({});
    const [imagePreview, setImagePreview] = useState(null);

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        if (type === 'file') {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
                setFormData({ ...formData, [name]: file });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({});
        setImagePreview(null); // Reset image preview on submission
    };

    const incrementPrizes = () => {
        setNumberOfPrizes((prev) => prev + 1);
        setPrizes((prev) => [...prev, '']);
    };

    const decrementPrizes = () => {
        if (numberOfPrizes > 1) {
            setNumberOfPrizes((prev) => prev - 1);
            setPrizes((prev) => prev.slice(0, -1));
        }
    };

    return (
        <form className="flex flex-col p-4 justify-center items-center gap-2" onSubmit={handleSubmit}>
            {fields.map((field) => (
                field.type === 'file' ? (
                    <div key={field.name} className="w-[80%]">
                        <label className="block mb-2 text-gray-700">Upload Tournament Image</label>
                        <div
                            className={`border-dashed border-2 border-blue-500 rounded-md h-40 flex justify-center items-center cursor-pointer ${imagePreview ? 'bg-gray-100' : ''}`}
                            onClick={() => document.getElementById(field.name).click()}
                        >
                            {imagePreview ? (
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="h-full w-full object-contain rounded-md" 
                                />
                            ) : (
                                <span className="text-gray-500">Click to upload image</span>
                            )}
                        </div>
                        <input
                            type="file"
                            id={field.name}
                            name={field.name}
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                        />
                    </div>
                ) : (
                    <TextField
                        variant="outlined"
                        size="small"
                        key={field.name}
                        type={field.type}
                        name={field.name}
                        label={field.placeholder}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        required
                        className="w-[80%]"
                    />
                )
            ))}
            <div className="flex  justify-start items-center  gap-3">
            <Typography>Add Prize Fields</Typography>
            <div className="flex items-center gap-1">
                <button type="button" onClick={decrementPrizes} className="border border-gray-300 rounded px-4 py-2 hover:bg-gray-200">-</button>
                <input
                    type="number"
                    value={numberOfPrizes}
                    readOnly
                    className="w-20 text-center border border-gray-300 rounded py-2"
                />
                <button type="button" onClick={incrementPrizes} className="border border-gray-300 rounded px-4 py-2 hover:bg-gray-200">+</button>
            </div>
            </div>
            <Button variant="contained" type="submit">Submit</Button>
        </form>
    );
};

// Define prop types
FormTournamentComponent.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            placeholder: PropTypes.string.isRequired,
        })
    ).isRequired,
    numberOfPrizes: PropTypes.number.isRequired,
    setNumberOfPrizes: PropTypes.func.isRequired,
    setPrizes: PropTypes.func.isRequired,
};

export default FormTournamentComponent;
