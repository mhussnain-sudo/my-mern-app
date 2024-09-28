import { useEffect, useState } from 'react';
import { getClubs } from '../apis/userApi';
import { GrHomeRounded } from "react-icons/gr";
import { BsPerson } from "react-icons/bs";
import { Link } from 'react-router-dom';

export default function Navbar() {
    const [clubs, setClubs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClubs = async () => {
            console.log('Fetching');
            try {
                const data = await getClubs();
                console.log("Clubs Data:", data);
                
                if (data && data.clubs) {
                    setClubs(data.clubs);
                } else {
                    setClubs([]);
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchClubs();
    }, []);

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div className="flex flex-col justify-between bg-slate-500 p-4 gap-1">
            <div className="flex items-center justify-between w-full px-5 ">
                <Link className='text-white text-2xl font-bold' to="/">
                    <GrHomeRounded />
                </Link>
                <Link className='text-white text-2xl font-bold' to="/login">
                    <BsPerson />
                </Link>
            </div>
            <div className="flex flex-wrap justify-center mt-4 md:mt-0">
                {clubs.length > 0 ? (
                    clubs.map((club) => (
                        <div key={club._id} className="p-2 text-center w-max">
                            <Link to={`/clubs/${club._id}`} className="text-white font-semibold hover:text-yellow-500">
                                {club.clubName}
                            </Link>
                        </div>
                    ))
                ) : (
                    <span className="text-white">No clubs available</span>
                )}
            </div>
        </div>
    );
}
