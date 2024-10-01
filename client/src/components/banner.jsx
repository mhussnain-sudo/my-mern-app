import { useEffect, useState } from 'react';
import { getheaders } from '../apis/userApi';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const baseurl = "http://localhost:3000";

const HeaderComponent = () => {
  const [headerData, setHeaderData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getHeader = async () => {
      try {
        const data = await getheaders();
        setHeaderData(data.headers); // Set the array of headers
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

  // Carousel settings
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Adjust autoplay speed as needed
    arrows: true, // Show arrows for manual navigation
  };

  return (
    <div>
      <Slider {...settings}>
        {headerData.map(header => {
          const imagePath = `${baseurl}${header.banner}`;
          return (
            <div key={header._id}>
              <img src={imagePath} alt="Header Banner" className='w-full h-max object-cover' />
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default HeaderComponent;
