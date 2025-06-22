import React, { useState } from 'react';
import dashboardMockup from '../assets/logos/DashboardMockup.png';

import SignUpForm from '../features/auth/SignUpForm';
import LoginForm from '../features/auth/LoginForm';

export default function LandingPage() {

    const [showSignup, setShowSignup] = useState(false);
    const [showLogin, setShowLogin] = useState(false)
    

  return (
    <div className="min-h-screen  text-gray-950">
      {/* Navbar */}
      <div className=' bg-[#024bba]'>
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
            <div className="text-2xl font-bold"> <img src="/assets/DoDeskLogo.png" alr="DoDesk Dashboard" className="w-[120px] h-fit "/></div>
            <div className="space-x-4 hidden md:block">
            <button onClick={()=> setShowSignup(true)}className="bg-white text-blue-600 font-semibold px-4 py-1.5 rounded hover:bg-blue-100">
                Sign Up
            </button>
            <button onClick={()=> setShowLogin(true)}className="bg-yellow-400 text-black font-semibold px-4 py-1.5 rounded hover:bg-blue-100">
                Log In
            </button>
            </div>
        </nav>
      </div>

      {/* Main Hero Section */}
      <div className="px-6">
        <div className="max-w-7xl text-gray-950 mx-auto flex flex-col md:flex-row items-center justify-between gap-10 py-10">
          {/* Left */}
          <div className="max-w-lg  space-y-6">
            <h1 className="text-4xl text-gray-950 md:text-5xl font-extrabold leading-tight">
              There's a DoDesk workspace for that
            </h1>
            <p className="text-lg">
              Start managing employee tasks with custom workflows built for every team.
            </p>

            <div className="rounded-full flex items-center overflow-hidden p-1 shadow-lg max-w-md">
              <input
                type="email"
                placeholder="you@company.com"
                className="flex-grow px-4 py-2 text-black outline-none"
              />
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-full">
                Get Quote
              </button>
            </div>
            <p className="text-sm ">Stay organized with DoDesk employee and task management.</p>

            <div className="space-y-4">
              <p className="text-sm font-bold">Trying to access DoDesk? <a href="#" className="underline">Log in</a></p>
            </div>
          </div>

          {/* Right */}
          <div className="relative">
            <img
              src={dashboardMockup}
              alt="DoDesk Dashboard"
              className="w-[700px] rounded-xl shadow-xl border border-white"
            />
          </div>
        </div>
      </div>

      {/*conditional rendering signup */}
      {showSignup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800  rounded-xl shadow-2xl w-[90%] max-w-md">
            <SignUpForm />
          </div>
        </div>
      )}  

      {/*conditional rendering login */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800  rounded-xl shadow-2xl w-[90%] max-w-md">
            <LoginForm />
          </div>
        </div>
      )} 

    </div>
  );
}
