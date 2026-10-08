"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail, ShieldCheck, Sparkles, User, LoaderCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label ref={ref} className={`text-sm font-medium leading-none ${className}`} {...props} />
));

const Input = React.forwardRef(({ className = "", type, ...props }, ref) => (
  <input ref={ref} type={type} className={`flex h-10 w-full rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${className}`} {...props} />
));

const Button = React.forwardRef(({ className = "", variant = "default", size = "default", ...props }, ref) => (
  <button ref={ref} className={`inline-flex items-center justify-center rounded-md text-sm font-semibold transition-transform active:scale-95 disabled:pointer-events-none disabled:opacity-50 ${variant === "outline" ? "border border-slate-800 bg-transparent hover:bg-slate-800" : "bg-purple-600 text-white hover:bg-purple-500"} ${size === "lg" ? "h-11 px-8" : "h-10 px-4"} ${className}`} {...props} />
));

export default function Login() {
  const [mode, setMode] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const router = useRouter();
  const isSignup = mode === "signup";

  const handleInputChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError("");
  };

  const handlePasswordLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    const result = await signIn("credentials", { redirect: false, email: formData.email, password: formData.password });
    setIsLoading(false);
    if (result?.error) setError("Invalid email or password.");
    else router.push("/dashboard");
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not create your account.");
      const loginResult = await signIn("credentials", { redirect: false, email: formData.email, password: formData.password });
      if (loginResult?.error) throw new Error("Account created, but sign in failed. Please log in.");
      router.push("/dashboard");
    } catch (signupError) {
      setError(signupError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(isSignup ? "login" : "signup");
    setError("");
    setFormData({ firstName: "", lastName: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0 z-0 opacity-50"><div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600/50 rounded-full blur-3xl animate-[spin_20s_linear_infinite]" /><div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-600/50 rounded-full blur-3xl animate-[spin_25s_linear_infinite_reverse]" /></div>
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
          <div className="text-center mb-8"><Sparkles className="mx-auto mb-3 size-12 text-purple-400" /><h1 className="text-4xl font-bold text-white">StartupInspector</h1><p className="text-slate-400 mt-2">AI-Powered Startup Analysis</p></div>
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 sm:p-8">
            <div className="mb-6"><h2 className="text-3xl font-bold text-white">{isSignup ? "Create Account" : "Welcome Back"}</h2><p className="text-slate-400 mt-1">{isSignup ? "Start analyzing your startup ideas" : "Sign in with your email and password"}</p></div>
            <form onSubmit={isSignup ? handleSignup : handlePasswordLogin} className="space-y-4">
              {isSignup && <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="firstName" className="text-slate-300"><User className="inline size-4 mr-2 text-purple-400" />First Name</Label><Input id="firstName" name="firstName" required onChange={handleInputChange} /></div><div className="space-y-2"><Label htmlFor="lastName" className="text-slate-300"><User className="inline size-4 mr-2 text-purple-400" />Last Name</Label><Input id="lastName" name="lastName" required onChange={handleInputChange} /></div></div>}
              <div className="space-y-2"><Label htmlFor="email" className="text-slate-300"><Mail className="inline size-4 mr-2 text-purple-400" />Email</Label><Input id="email" name="email" type="email" required onChange={handleInputChange} /></div>
              <div className="space-y-2"><Label htmlFor="password" className="text-slate-300"><Lock className="inline size-4 mr-2 text-purple-400" />Password</Label><Input id="password" name="password" type="password" minLength={8} required onChange={handleInputChange} /></div>
              {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-md">{error}</p>}
              <Button type="submit" disabled={isLoading} className="w-full gap-2" size="lg">{isLoading ? <LoaderCircle className="size-5 animate-spin" /> : isSignup ? <ArrowRight className="size-5" /> : <ShieldCheck className="size-5" />}{isLoading ? "Loading..." : isSignup ? "Create Account" : "Sign In"}</Button>
            </form>
            <p className="mt-8 text-center text-sm text-slate-400">{isSignup ? "Already have an account?" : "New to StartupInspector?"}{" "}<button onClick={switchMode} className="font-semibold text-purple-400 hover:underline">{isSignup ? "Login" : "Sign Up Now"}</button></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
