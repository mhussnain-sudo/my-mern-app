import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const FormComponent = ({ onSubmit, fields }) => {
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); // Pass only form data
        setFormData({}); // Reset form data after submission
    };

    return (
        <form className="flex flex-col w-full p-4 justify-center items-center gap-4 sm:gap-6 lg:gap-8" onSubmit={handleSubmit}>
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
                    required
                    className="w-full sm:w-72 lg:w-80"
                />
            ))}
            <Button variant="contained" type="submit" className="w-full sm:w-72 lg:w-80">Submit</Button>
        </form>
    );
};
// Define prop types
FormComponent.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            placeholder: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default FormComponent;


