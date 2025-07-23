// app/page.tsx
"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  Users,
  CheckCircle,
  ArrowRight,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/molecules/card";
import { ThemeToggle } from "@/components/ui/atoms/theme-toggle";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "@/providers/ThemeContext";
// import toast from "react-hot-toast";

export default function LandingPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [imgLoaded, setImgLoaded] = useState(false);
  const features = [
    {
      icon: <Users className="w-5 h-5" />,
      title: "Team Collaboration",
      description: "Streamline teamwork with real-time collaboration",
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Task Management",
      description: "Organize and track tasks with intelligent workflows",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Secure & Private",
      description: "Enterprise-grade security and access controls",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Lightning Fast",
      description: "Built for speed with optimized performance",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="max-w-6xl mx-auto py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image
                src={
                  theme === "dark"
                    ? "/landscape-logo-white.png"
                    : "/landscape-logo-black.png"
                }
                alt="DoDesk"
                width={140}
                height={140}
              />
            </div>

            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button
                variant="ghost"
                onClick={() => router.push("/signin")}
                className="text-sm font-medium"
              >
                Log In
              </Button>
              <Button
                onClick={() => router.push("/signup")}
                className="text-sm font-medium"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
            <span>✨ New: Advanced Analytics Dashboard</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Workspace Management
            <br />
            <span className="text-primary">Reimagined</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your team&apos;s productivity with intelligent task
            management, seamless collaboration, and powerful analytics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              onClick={() => router.push("/signup")}
              className="group"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* <Button
              variant="outline"
              size="lg"
              className="group"
              onClick={() => toast.error("Coming soon")}
            >
              Watch Demo
              <div className="w-2 h-2 rounded-full bg-primary ml-2"></div>
            </Button> */}
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Open Source</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Free to use</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Better than Linear</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="relative max-w-4xl mx-auto mb-24">
          <Card className="p-0 bg-card border shadow-2xl">
            <div className="w-full  bg-muted rounded-lg flex items-center justify-center overflow-hidden relative">
              <Image
                src={
                  theme === "dark"
                    ? "/DashboardScreenshotDark.png"
                    : "/DashboardScreenshotLight.png"
                }
                alt="Dashboard Preview"
                width={1280}
                height={1000}
                className={`object-cover w-full h-full rounded-lg transition-opacity duration-500 ${
                  imgLoaded ? "opacity-100" : "opacity-0"
                }`}
                priority
                onLoadingComplete={() => setImgLoaded(true)}
              />
            </div>
          </Card>

          {/* Floating feature cards */}
          <Card className="absolute -top-4 -left-4 p-4 bg-card border shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Tasks Completed
                </p>
                <p className="text-xs text-muted-foreground">
                  +127% this month
                </p>
              </div>
            </div>
          </Card>

          <Card className="absolute -bottom-4 -right-4 p-4 bg-card border shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Team Active
                </p>
                <p className="text-xs text-muted-foreground">
                  24/7 collaboration
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help your team work better together
              and achieve more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-200"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {React.cloneElement(feature.icon, {
                      className: "w-6 h-6 text-primary-foreground",
                    })}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
