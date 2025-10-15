"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Sparkles, Lock, Mail, User, Zap, ShieldCheck } from "lucide-react";

export default function Login() {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [authMethod, setAuthMethod] = useState("password"); // "password" or "otp"

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-gray-950 via-purple-950 to-gray-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 -right-40 w-96 h-96 bg-gradient-to-br from-pink-600 to-purple-700 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0],
            opacity: [0.12, 0.28, 0.12],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 left-1/3 w-72 h-72 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-full blur-3xl"
        />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo/Branding */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center gap-2 mb-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg"
              >
                <Sparkles className="size-6 text-white" />
              </motion.div>
            </div>
            <h1 className="text-4xl bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
              StartupInspector
            </h1>
            <p className="text-gray-400 mt-2">AI-Powered Startup Analysis</p>
          </motion.div>

          {/* Auth Card */}
          <motion.div
            layout
            className="bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800/50 p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-600/20 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-600/20 to-transparent rounded-tr-full" />

            <div className="relative">
              <AnimatePresence mode="wait">
                {mode === "login" ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <h2 className="text-3xl text-white">Welcome Back</h2>
                      <p className="text-gray-400 mt-1">Sign in to continue your journey</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2 text-gray-300">
                          <Mail className="size-4 text-purple-400" />
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          className="transition-all duration-200 focus:scale-[1.01] bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                        />
                      </div>

                      {authMethod === "password" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2"
                        >
                          <Label htmlFor="password" className="flex items-center gap-2 text-gray-300">
                            <Lock className="size-4 text-purple-400" />
                            Password
                          </Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="transition-all duration-200 focus:scale-[1.01] bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                          />
                        </motion.div>
                      )}

                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                        size="lg"
                      >
                        <ShieldCheck className="size-5" />
                        {authMethod === "password" ? "Sign in with Password" : "Sign in with OTP"}
                      </Button>

                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-700" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-4 bg-gray-900 text-gray-400">--OR--</span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full border-gray-700 hover:border-purple-500 hover:bg-gray-800 transition-all duration-200 text-gray-300"
                        size="lg"
                        onClick={() => setAuthMethod(authMethod === "password" ? "otp" : "password")}
                      >
                        <Zap className="size-5 text-purple-400" />
                        {authMethod === "password" ? "Sign in with OTP" : "Sign in with Password"}
                      </Button>
                    </div>

                    <div className="mt-6 text-center">
                      <p className="text-gray-400">
                        New to StartupInspector?{" "}
                        <button
                          onClick={() => setMode("signup")}
                          className="text-purple-400 hover:text-purple-300 transition-colors underline-offset-4 hover:underline"
                        >
                          SignUp
                        </button>
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <h2 className="text-3xl text-white">Create Account</h2>
                      <p className="text-gray-400 mt-1">Start analyzing your startup ideas</p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="flex items-center gap-2 text-gray-300">
                            <User className="size-4 text-purple-400" />
                            First Name
                          </Label>
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="John"
                            className="transition-all duration-200 focus:scale-[1.01] bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="flex items-center gap-2 text-gray-300">
                            <User className="size-4 text-purple-400" />
                            Last Name
                          </Label>
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Doe"
                            className="transition-all duration-200 focus:scale-[1.01] bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signupEmail" className="flex items-center gap-2 text-gray-300">
                          <Mail className="size-4 text-purple-400" />
                          Email
                        </Label>
                        <Input
                          id="signupEmail"
                          type="email"
                          placeholder="your@email.com"
                          className="transition-all duration-200 focus:scale-[1.01] bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signupPassword" className="flex items-center gap-2 text-gray-300">
                          <Lock className="size-4 text-purple-400" />
                          Password
                        </Label>
                        <Input
                          id="signupPassword"
                          type="password"
                          placeholder="••••••••"
                          className="transition-all duration-200 focus:scale-[1.01] bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                        />
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                        size="lg"
                      >
                        <Zap className="size-5" />
                        Send OTP
                      </Button>
                    </div>

                    <div className="mt-6 text-center">
                      <p className="text-gray-400">
                        Already a user?{" "}
                        <button
                          onClick={() => setMode("login")}
                          className="text-purple-400 hover:text-purple-300 transition-colors underline-offset-4 hover:underline"
                        >
                          Login
                        </button>
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 text-center text-sm text-gray-500"
          >
            <p>Secured by enterprise-grade encryption</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
