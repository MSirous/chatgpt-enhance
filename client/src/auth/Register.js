import React, { useState } from 'react';
import Axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

	
	const [formData, setFormData] = useState({
        username: '',
        password: '',
		full_name: '',
		mobile:''
    });

	const handleChange = (e) =>{
        const {name, value} = e.target;
        setFormData((prevData)=>({
            ...prevData,
            [name]: value,
        }))
    }


    const handleSubmit = async(e) =>{
        e.preventDefault();
        try {
            const response = await Axios.post('http://localhost:9000/register',formData );
            console.log("Registration Successful")
            navigate('/login')
        } catch (error) {
            console.log("Registration Failed: " + error)
        }
    }

	
    return (
	<div className="container">
			<form onSubmit={handleSubmit} >
				<h1>Create Account</h1>
				{/* <div className="social-container">
					<Link href="" className="social"><i className="fab fa-facebook-f"></i></Link>
					<Link href="" className="social"><i className="fab fa-google-plus-g"></i></Link>
					<Link href="" className="social"><i className="fab fa-linkedin-in"></i></Link>
				</div> */}
				<span>or use your email for registration</span><br />
				<input  type="email" name='username'
					placeholder="EMU ID/Email Address" 
					value={formData.username} onChange={handleChange} required
				/>
				<input type="password" name='password'
					placeholder="Enter password" 
					value={formData.password} onChange={handleChange} required 
				/>
				<input type="text"
					name='full_name'
					placeholder="Full Name" 
					value={formData.full_name} onChange={handleChange} required
				/>
				<input type="phone" name='mobile'
					placeholder="Mobile Number" 
					value={formData.mobile} onChange={handleChange} required  
				/>
				<p>Already have an account? <Link to='/login'>Login</Link></p>
				<button type="submit"> Register </button>
		</form>
			
				
	</div>





    )
}

export default Register;