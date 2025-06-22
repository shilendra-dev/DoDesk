import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../providers/AuthContext"

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
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-100">Email Address:</label>
                        <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={data.email} placeholder='johndoe@email.com' id='email' onChange={(e)=> setData({...data, email: e.target.value})}></input><br/>
                        
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-100">Password:</label>
                        <input type="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={data.password} placeholder='********' id='password' onChange={(e)=> setData({...data, password: e.target.value})}></input><br/>

                        <input type='submit' value='Login' className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-"/>
                        
                    </form>
                </div>
            </div>
        
    </>
  )
}

export default Login