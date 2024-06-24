import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="wrapper">
            <div className="left">
                <div className="left-content">
                <b1>Hello,</b1> 
                </div>
            <div className="left-context"> 
            Welcome to EMU AI,<br /><br />
            By Register in the right, access everything.
            </div>
            </div>

            <div className="right">
                <div className="right-content">
                <h1>Ready for Register?!</h1><br/><br/>
                </div>
                <Link to="/register">
                <button >Register/Login</button></Link>
                <div>

                </div>
            </div>
      </div>
    );
}

export default Home;