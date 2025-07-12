import React, { useState } from 'react';
import { ChevronRight, Users, CheckCircle, ArrowRight, Mail, Shield, Zap } from 'lucide-react';
import dashboardMockup from '../assets/logos/DashboardScreenshot.png';
import SignUpForm from '../features/auth/SignUpForm';
import LoginForm from '../features/auth/LoginForm';
import ThemeToggle from '../shared/components/atoms/ThemeToggle';

export default function LandingPage() {
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const features = [
    {
      icon: <Users className="w-5 h-5" />,
      title: "Team Collaboration",
      description: "Streamline teamwork with real-time collaboration"
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Task Management",
      description: "Organize and track tasks with intelligent workflows"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Secure & Private",
      description: "Enterprise-grade security and access controls"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Lightning Fast",
      description: "Built for speed with optimized performance"
    }
  ];

  return (
    <div className="min-h-screen bg-primary text-primary relative overflow-hidden">
      {/* Grayscale background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 via-gray-800/30 to-gray-900/30 dark:from-gray-900/40 dark:via-gray-800/40 dark:to-gray-900/40"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-full blur-3xl"></div>
      
      {/* Compact frosted glass navbar */}
      <nav className="relative z-50 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-primary">
                DoDesk
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <ThemeToggle className="hover:bg-secondary/60 backdrop-blur-sm" />
              <button 
                onClick={() => setShowLogin(true)}
                className="text-sm font-medium text-secondary hover:text-primary transition-colors"
              >
                Log In
              </button>
              <button 
                onClick={() => setShowSignup(true)}
                className="bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 backdrop-blur-sm text-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Compact Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-secondary/60 backdrop-blur-sm border border-[var(--color-border-primary)] mb-6">
            <span className="text-xs font-medium text-secondary">✨ New: Advanced Analytics Dashboard</span>
            <ChevronRight className="w-3 h-3 ml-1 text-secondary" />
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-primary leading-tight">
            Workspace Management
            <br />
            <span className="text-primary">Reimagined</span>
          </h1>
          
          <p className="text-base text-secondary mb-8 max-w-xl mx-auto leading-relaxed">
            Transform your team's productivity with intelligent task management, seamless collaboration, and powerful analytics.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
            <button 
              onClick={() => setShowSignup(true)}
              className="group bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 backdrop-blur-sm flex items-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="group text-primary font-semibold px-6 py-3 rounded-lg border border-[var(--color-border-primary)] hover:bg-secondary/60 backdrop-blur-sm transition-all duration-200 flex items-center space-x-2">
              <span>Watch Demo</span>
              <div className="w-4 h-4 rounded-full bg-gray-600 dark:bg-gray-400 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white dark:bg-gray-900 rounded-full"></div>
              </div>
            </button>
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-xs text-secondary">
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3 text-gray-500" />
              <span>Open Source</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3 text-gray-500" />
              <span>Free to use</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3 text-gray-500" />
              <span>Better than any</span>
            </div>
          </div>
        </div>

        {/* Compact Dashboard Preview */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative backdrop-blur-xl bg-tertiary/60 border-1 border-[var(--color-border-primary)] rounded-xl p-4 shadow-2xl">
            <img
              src={dashboardMockup}
              alt="DoDesk Dashboard"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          
          {/* Smaller floating feature cards */}
          <div className="absolute -top-4 -left-4 backdrop-blur-xl bg-tertiary/90 border border-[var(--color-border-primary)] rounded-lg p-3 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-700 dark:bg-gray-300 rounded-full flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white dark:text-gray-900" />
              </div>
              <div>
                <p className="text-xs font-medium text-primary">Tasks Completed</p>
                <p className="text-xs text-secondary">+127% this month</p>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-4 -right-4 backdrop-blur-xl bg-tertiary/90 border border-[var(--color-border-primary)] rounded-lg p-3 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-700 dark:bg-gray-300 rounded-full flex items-center justify-center">
                <Users className="w-3 h-3 text-white dark:text-gray-900" />
              </div>
              <div>
                <p className="text-xs font-medium text-primary">Team Active</p>
                <p className="text-xs text-secondary">24/7 collaboration</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Features Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-primary">
            Everything you need to succeed
          </h2>
          <p className="text-base text-secondary max-w-xl mx-auto">
            Powerful features designed to help your team work better together and achieve more.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="group backdrop-blur-xl bg-tertiary/60 border border-[var(--color-border-primary)] rounded-lg p-4 hover:bg-tertiary/80 transition-all duration-300 hover:scale-105">
              <div className="w-8 h-8 bg-gray-700 dark:bg-gray-300 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                {React.cloneElement(feature.icon, { className: "w-4 h-4 text-white dark:text-gray-900" })}
              </div>
              <h3 className="text-sm font-semibold mb-2 text-primary">{feature.title}</h3>
              <p className="text-xs text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">            
            <SignUpForm />
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="backdrop-blur-xl bg-tertiary/95 border border-[var(--color-border-primary)] rounded-xl shadow-2xl w-[90%] max-w-sm">
            <LoginForm />
          </div>
        </div>
      )}
    </div>
  );
}
