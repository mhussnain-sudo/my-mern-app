
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const FormPigeonOwnerComponent = ({ onSubmit, fields, formValues, onFormChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onFormChange({ [name]: value }); // Notify parent of changes
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formValues); // Submit all form values
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
                    value={formValues[field.name] || ''}
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
FormPigeonOwnerComponent.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            placeholder: PropTypes.string.isRequired,
        })
    ).isRequired,
    formValues: PropTypes.object.isRequired,
    onFormChange: PropTypes.func.isRequired,
};

export default FormPigeonOwnerComponent;
