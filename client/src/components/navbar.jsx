import { useEffect, useState } from 'react';
import { getEveryTournament } from '../apis/userApi';
import { BsPerson } from "react-icons/bs";
import { GrHomeRounded } from "react-icons/gr";
import { Link } from 'react-router-dom';
import Navbar2 from './navbar2'; // Import Navbar2 component

export default function Navbar() {
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const data = await getEveryTournament();
                if (data && data.tournaments) {
                    setTournaments(data.tournaments);
                } else {
                    setTournaments([]);
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchTournaments();
    }, []);

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div className='flex flex-col'>
        <div className="flex flex-col md:flex-row justify-between bg-blue-800 p-4 gap-1">
            <div className="flex items-center justify-between px-5 gap-1">
                <Link className='text-white text-lg' to="/">
                    <div className="flex justify-center items-center gap-1">
                        <GrHomeRounded /> Home
                    </div>
                </Link>
                <Link className="text-white text-lg" to="/login">
                    <div className="flex justify-center items-center"> <BsPerson /> Login </div>
                </Link>
            </div>
            <div className="flex flex-wrap justify-center mt-4 md:mt-0">
                {tournaments.length > 0 ? (
                    tournaments.map((tournament) => (
                        <div key={tournament._id} className="p-2 text-center w-max">
                            <button
                                onClick={() => setSelectedTournament(tournament)}
                                className="text-slate-200 font-semibold hover:text-white"
                            >
                                {tournament.tournamentName}
                            </button>
                        </div>
                    ))
                ) : (
                    <span className="text-white">No tournaments available</span>
                )}
            </div>
           
        </div>
        {selectedTournament && <Navbar2 selectedTournament={selectedTournament} />} {/* Pass selectedTournament to Navbar2 */}
        </div>
    );
}
