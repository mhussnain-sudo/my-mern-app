import FormComponent from '../components/form';
export default function CreateClub(){
   
    const handleSubmit = ({ clubname,ownername, email, password }) => {
        console.log('Form Data:', { clubname,ownername, email, password });
    };

    const fields = [
        { name: 'clubname', type: 'clubname', placeholder: 'Enter ClubName' },
        { name: 'ownername', type: 'ownername', placeholder: 'Enter Ownername' },
        { name: 'email', type: 'email', placeholder: 'Email' },
        { name: 'password', type: 'password', placeholder: 'Password' },
    ];
    return(
        <div className="flex flex-col px-4 gap-5">
        <div className="border shadow-lg w-max p-3">
            <h1 className="font-bold font-mono text-2xl">Create Club</h1>
        </div>
        <div className="flex justify-center items-center">
        <div className="border  rounded-lg shadow-lg py-16 px-8  text-center justify-center items-center">
            <FormComponent onSubmit={handleSubmit} fields={fields} />
            </div>
        </div>
        </div>
    )
}