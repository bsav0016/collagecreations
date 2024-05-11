import { useNavigate } from 'react-router-dom';
import '../App.css';
import bigLogo from './big-logo.png';
import bothCollages from './bothCollages.jpg'
import NavBar from './navBar';

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <NavBar/>
      <div className="App">
        <header>
          <img src={bigLogo} alt="Big Logo" className="big-logo" style={{ width: '20%' }}/>
          <h1 style={{ marginTop: -10 }}>Welcome!</h1>
          <p>Collage Creations is a small business that provides unique image collages. You can build a collage of images that can look like a larger image or word! Please stop by the "Helpful Tips" page before you begin creating your collage.</p>
        </header>

        <div style={{ justifyContent: 'center' }}>
          <img src={bothCollages} alt="Collages" className="big-logo" style={{ width: '60%'}}/>
        </div>
      </div>
    </div>
  );
}

export default Home;
