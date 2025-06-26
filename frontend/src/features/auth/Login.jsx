import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../providers/AuthContext"
import Input from '../../shared/components/atoms/Input';
import Label from '../../shared/components/atoms/Label';

function Login() {
    const {login, user} = useAuth();
    const [data, setData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();



    const loginUser = async (e) => {
        e.preventDefault();
        const {email, password} = data
        try {
            const {data} = await axios.post('http://localhost:5033/api/auth/login', {
            email, password
        });

        //storing token in local storage using login function
        login({token: data.token, id: data.id});

        }
        catch(error) {
            console.error(error);
        }
    };

    useEffect(() => {
        //wait for the user to be set in context then nevigate
        if (user) {
            navigate("/user");  // Redirect to Admin page
        }
    },[user, navigate])


    
  return (
    <>
        
            <div className="flex p-6  border border-gray-600 rounded-lg shadow-sm bg-[#054099]  w-full h-100">
                
                <div className=" w-full pt-5">
                    <h2 className="font-extrabold text-4xl text-white mb-2 mt-2">Login</h2>
                    <form onSubmit={loginUser} className=" w-full">
                        <Label htmlFor="email">Email Address:</Label>
                        <Input value={data.email} 
                            placeholder='johndoe@email.com' 
                            id='email' 
                            onChange={(e)=> setData({...data, email: e.target.value})}
                        /><br/>
                        
                        <Label htmlFor="password">Password:</Label>
                        <Input type="password"
                            value={data.password} 
                            placeholder='********' 
                            id='password' 
                            onChange={(e)=> setData({...data, password: e.target.value})}
                        /><br/>

                        <Input type='submit' value='Login' />
                        
                    </form>
                </div>
            </div>
        
    </>
  )
}

export default Login