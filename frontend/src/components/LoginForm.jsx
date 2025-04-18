import axios from 'axios';
import {React, useState} from 'react'
import { useNavigate } from 'react-router-dom'

function LoginForm() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: "",
        password: "",
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
    
        try{
            const res = await axios.post("http://localhost:5033/api/auth/login", data);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            console.log(res.data);
            navigate("/dashboard");
        }catch(err){
            setError(err.response?.data?.message || "Something went wrong")
        }
    };

    return (
    <>

        <div className="rounded-2xl flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg dark:bg-gray-800">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">Log In</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                </div>

                <div>
                <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input
                    type="password"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    placeholder="********"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                </div>

                <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                Login
                </button>
            </form>
            </div>
        </div>

    </>
  )
}

export default LoginForm