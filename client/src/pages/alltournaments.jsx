import { useEffect, useState } from 'react';
import TableBox from "../components/tournamentTableBox"; // Assuming the same TableBox can be reused
import { getAllTournaments, deleteTournaments } from '../apis/userApi'; // Ensure deleteTournament API is defined
import Pagination from '../components/pagination';

export default function AllTournaments() {
    const headers = ["Image", "Tournament Name","No. Of Pigeons", "Start Date","Add Participants","Status"];
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchTournaments = async (page = 1) => {
        setLoading(true);
        try {
            const response = await getAllTournaments(page); // Ensure this API call is defined
            setData(response.data.tournaments);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching tournaments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTournaments(currentPage);
    }, [currentPage]);

    const handleEdit = (tournament) => {
        console.log("Editing tournament:", tournament);
        // Logic to handle editing the tournament (e.g., open a modal with a form)
    };

    const handleDelete = async (tournament) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ${tournament.tournamentName}?`);
        if (confirmDelete) {
            try {
                await deleteTournaments(tournament._id); // Adjust according to your API structure
                fetchTournaments(currentPage); // Refresh the list after deletion
            } catch (error) {
                console.error("Error deleting tournament:", error);
            }
        }
    };

    return (
        <div className="flex flex-col px-4 gap-5">
            <div className="border shadow-lg w-max p-3">
                <h1 className="font-bold font-mono text-2xl">All Tournaments</h1>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {data.length > 0 ? (
                        <TableBox 
                            headers={headers} 
                            data={data} 
                            onEdit={handleEdit} 
                            onDelete={handleDelete} 
                        />
                    ) : (
                        <p>No tournaments found.</p>
                    )}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </div>
    );
}
