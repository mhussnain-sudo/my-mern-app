import { useEffect, useState } from 'react';
import TableBox from "../components/tableBox";
import { getAllClubs, deleteClub } from '../apis/userApi';
import Pagination from '../components/pagination';

export default function AllClubs() {
    const headers = ["Avatar","Member ID" ,"Member Name", "Password"];
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchClubs = async (page = 1) => {
        setLoading(true);
        try {
            const response = await getAllClubs(page);
            setData(response.data.clubs);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching clubs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClubs(currentPage);
    }, [currentPage]);

    const handleEdit = (club) => {
        console.log("Editing club:", club);
    };

    const handleDelete = async (club) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ${club.clubName}?`);
        if (confirmDelete) {
            try {
                await deleteClub(club.id);
                fetchClubs(currentPage);
            } catch (error) {
                console.error("Error deleting club:", error);
            }
        }
    };

    return (
        <div className="flex flex-col px-4 gap-5">
            <div className="border shadow-lg w-full p-3">
                <h1 className="font-bold font-mono text-2xl">All Members</h1>
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
                        <p>No clubs found.</p>
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
