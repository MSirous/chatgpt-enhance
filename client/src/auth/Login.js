import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


const Login = () => {

    const navigate = useNavigate();
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const [loggedIn, setLoggedIn] = useState(false);

    const authenticate = async() =>{
  
    try{
      const token = localStorage.getItem('token');
      console.log(token);
      if (token){
        setLoggedIn(true);
      }else{
        setLoggedIn(false);
      }
  
    }catch(err){
      console.log(err);
      setLoggedIn(false);
    }
  }
    useEffect(()=>{
      authenticate();
    }, []);
  
  const handleLogOut = () =>{
    localStorage.removeItem('token');
    setLoggedIn(false);
  }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:9000/login', formData);
            const { token } = response.data;
            console.log("Login Token is: " + token)
            localStorage.setItem('token', token);
            setError('')
            navigate('/dashboard')

        } catch (error) {
            console.log("Login Failed: " + error)
            setError(error.response.data.message)
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    }


return (
    <>
    <div className="container">
 		<form className="login-page" onSubmit={handleSubmit}>
 			<h1>Sign in</h1>
 			{/* <div className="social-container">
 				<Link href="" className="social"><i className="fab fa-facebook-f"></i></Link>
 				<Link href="" className="social"><i className="fab fa-google-plus-g"></i></Link>
 				<Link href="" className="social"><i className="fab fa-linkedin-in"></i></Link>
 			</div> */}
 			<span>or use your account</span>
             {error && <p style={{color: 'red'}}>{error}</p>}
 			<input type="text" name="username"
                    value={formData.username} onChange={handleChange}
                    required placeholder="Username" />

 			<input type="password" name="password"
                    value={formData.password} onChange={handleChange}
                    required placeholder="Password"
 			/>
            <p>Don't have an account? <Link to='/register'>Register</Link></p>
 			<Link href="">Forgot your password?</Link>
 			<button>Login</button>
 		</form>

    </div>
    </>
)
}
export default Login;