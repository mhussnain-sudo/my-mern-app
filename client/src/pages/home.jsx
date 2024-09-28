import Header from '../components/banner'
import Navbar from '../components/navbar'
import Navbar2 from '../components/navbar2';

const Home = () => {
    return(
        <div className="flex flex-col gap-2">
      <Header/>
      <Navbar/>
      <Navbar2/>
      </div>
    )
}

export default Home;