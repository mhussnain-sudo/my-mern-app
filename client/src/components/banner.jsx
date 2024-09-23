import { useEffect, useState } from 'react';
import { getheaders } from '../apis/userApi';

const baseurl = "http://localhost:3000";

const HeaderComponent = () => {
  const [headerData, setHeaderData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getHeader = async () => {
      try {
        const data = await getheaders();
        setHeaderData(data.header);
      } catch (err) {
        setError(err.message);
      }
    };

    getHeader();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!headerData) {
    return <div>Loading...</div>;
  }

  const imagePath = `${baseurl}${headerData.banner}`;

  return (
    <div>
      <img src={imagePath} alt="Header Banner" className='w-full h-[300px]' />
    </div>
  );
};

export default HeaderComponent;
