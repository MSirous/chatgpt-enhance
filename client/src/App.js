import { useEffect } from "react";
// import { BrowserRouter } from 'react-router-dom'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from "./Dashboard/Dashboard";


import Home from './Home';
import Register from './auth/Register'
import Login from './auth/Login'

import { connectWithSocketServer } from "./socketConnection/socketConn";
import './App.css'
function App() {
  useEffect(() => {
    connectWithSocketServer();
  }, []);



  return (
   <div className="App">
      <header className="App-header">
        <BrowserRouter>
        {/* <Navbar loggedIn={loggedIn} handleLogOut={handleLogOut} /> */}
          <Routes>
          <Route path='/' element={<Home/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/logout' element={<Navigate to= '/' />}/>
          
            <Route path='/dashboard' element={<Dashboard/>}/>
           
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
