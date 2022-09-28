import './App.css';

import {BrowserRouter, Routes, Route} from 'react-router-dom';

// component Imports
import Signup from './pages/Signup';
import Login from './pages/Login';
import Homepage from './pages/Homepage';
import UserHomePage from './pages/UserHomePage';

function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Signup/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/homepage' element={<Homepage/>}/>
          <Route path='/userhomepage' element={<UserHomePage/>}/>
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
