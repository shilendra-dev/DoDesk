import axios from 'axios';
import {React, useState} from 'react'
import { useNavigate } from 'react-router-dom'

function SignUpForm() {
    const nevigate = useNavigate();
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [error, setError] = useState("")
    
    const handleChange = (e) => {
        setData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if(data.password != data.confirmPassword){
            setError("Passwords do not match!");
            return;
        }
        try{
            const res = await axios.post("http://localhost:5033/api/users/signup", data);
            console.log(res.data);
            navigate("/login");
        }catch(err){
            setError(err.response?.data?.message || "Something went wrong")
        }
    };

    return (
    <>
        <div className="max-w-sm p-6 content-right bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 w-full h-100">
                <h2 className="font-extrabold text-4xl mb-2 mt-2">Login</h2>
                <div className="flex w-full pt-5">
                    <form onSubmit={handleSubmit} className=" w-full">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-100">Full Name:</label>
                        <input type="text" name="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={data.name} placeholder='Dev Malik' id='name' onChange={handleChange}></input><br/>

                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-100">Email Address:</label>
                        <input type="text" name="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={data.email} placeholder='johndoe@email.com' id='email' onChange={handleChange}></input><br/>
                        
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-100">Password:</label>
                        <input type="password" name="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={data.password} placeholder='********' id='password' onChange={handleChange}></input><br/>

                        <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-100">Confirm Password:</label>
                        <input type="password" name="confirmPassword" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={data.confirmPassword} placeholder='********' id='confirmPassword' onChange={handleChange}></input><br/>

                        <input type='submit' value='Login' className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-"/>
                        
                    </form>
                </div>
        </div>
    </>
  )
}

export default SignUpForm