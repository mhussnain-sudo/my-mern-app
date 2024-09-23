import { useEffect, useState } from 'react';
import { getAllClubs } from '../apis/userApi'; // Adjust the import path as necessary

export default function Navbar() {
    const [clubs, setClubs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClubs = async () => {
            console.log('Fetching');
            try {
                const data = await getAllClubs(); // Get the response data
                console.log("Clubs Data:", data); // Check the full response
                
                // Check if the response has the expected structure
                if (data && data.clubs) {
                    setClubs(data.clubs); // Set the clubs state
                } else {
                    setClubs([]); // Fallback if no clubs are found
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchClubs();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="flex flex-row justify-between bg-slate-400 p-2">
            <div className="flex flex-row bg-slate-300">
                <a href="/">Home</a>
                {/* Map over clubs and display them */}
               
            </div>
            <div className='flex'>
            {clubs.length > 0 ? (
                    clubs.map((club) => (
                        <a key={club._id} href={`/clubs/${club._id}`} className="ml-4">
                            {club.clubName}
                        </a>
                    ))
                ) : (
                    <span>No clubs available</span>
                )}
            </div>
        </div>
    );
}
