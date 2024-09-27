import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FormPigeonComponent = ({ onSubmit, fields, setNumberOfPrizes, setPrizes, prizes }) => {
    const [formData, setFormData] = useState({});
    const [ setImagePreview] = useState(null);
    const [continueDays, setContinueDays] = useState(0);
    const [selectedDates, setSelectedDates] = useState([]);

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
        onSubmit({ ...formData, continueDays, continueDates: selectedDates, prizes });
        setFormData({});
        setImagePreview(null);
        setContinueDays(0);
        setSelectedDates([]);
        setNumberOfPrizes(''); // Reset to empty after submission
        setPrizes(['']); // Reset prizes
    };

    const handleFocus = (e) => {
        e.target.showPicker();
    };

    return (
        <form className="flex flex-col p-4 justify-center items-center gap-2" onSubmit={handleSubmit}>
            {fields.map((field) => (

                    <TextField
                        variant="outlined"
                        size="small"
                        key={field.name}
                        type={field.type}
                        name={field.name}
                        label={field.placeholder}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        onFocus={field.type === 'date' || field.type === 'time' ? handleFocus : null}
                        required
                        className="w-full md:w-3/4"
                    />
                
            ))}


  

            <Button variant="contained" type="submit" className="mt-4">Submit</Button>
            <ToastContainer /> {/* Add ToastContainer to the form */}
        </form>
    );
};

// Define prop types
FormPigeonComponent.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            placeholder: PropTypes.string,
        })
    ).isRequired,
    numberOfPrizes: PropTypes.number.isRequired,
    setNumberOfPrizes: PropTypes.func.isRequired,
    setPrizes: PropTypes.func.isRequired,
    prizes: PropTypes.array.isRequired,
};

export default FormPigeonComponent;
