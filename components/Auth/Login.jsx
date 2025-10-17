"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Lock, Mail, User, Zap, ShieldCheck, ArrowRight, LoaderCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label ref={ref} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props} />
));

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-slate-50 ring-offset-slate-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 focus:scale-[1.02] ${className}`}
      ref={ref}
      {...props}
    />
  );
});

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-slate-950 transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95";
  const variantClasses = {
    default: "bg-purple-600 text-slate-50 hover:bg-purple-600/90",
    outline: "border border-slate-800 bg-transparent hover:bg-slate-800 hover:text-slate-50",
  };
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    lg: "h-11 rounded-md px-8",
  };
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${sizeClasses[size] || sizeClasses.default} ${className}`}
      ref={ref}
      {...props}
    />
  );
});

const OtpInput = ({ length = 6, onChange }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value.slice(-1);
    setOtp(newOtp);
    onChange(newOtp.join(""));
    if (element.value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const value = e.clipboardData.getData("text");
    if (isNaN(value) || value.length !== length) return;
    const newOtp = value.split('');
    setOtp(newOtp);
    onChange(newOtp.join(""));
    inputRefs.current[length - 1].focus();
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-4" onPaste={handlePaste}>
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          ref={(el) => (inputRefs.current[index] = el)}
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={(e) => e.target.select()}
          className="aspect-square w-12 sm:w-14 h-12 sm:h-14 text-center text-xl sm:text-2xl font-semibold text-white bg-slate-800/50 border-2 border-slate-700 rounded-lg transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:scale-105"
        />
      ))}
    </div>
  );
};

export default function Login() {
  const [mode, setMode] = useState("login");
  const [authMethod, setAuthMethod] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    otp: "",
  });
  const router = useRouter();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleOtpChange = (otpValue) => {
    setFormData({ ...formData, otp: otpValue });
    setError("");
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });
    setIsLoading(false);
    if (result.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/dashboard");
    }
  };

  const handleOtpLoginRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/request-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send OTP.");
      }
      setAuthMethod("verify-login-otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpLoginVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, otp: formData.otp, purpose: 'login' }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to verify OTP.");
      }
      
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        loginToken: data.loginToken,
      });

      if (result.error) {
        setError("Login failed. Please try again.");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupOtpRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Could not start sign-up process.");
      }
      setMode("verify-signup");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupOtpVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const verifyRes = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: formData.otp, purpose: 'signup' }),
      });
      
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.message || "Failed to verify OTP.");
      }

      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result.error) {
        setError("Verification successful, but login failed. Please log in manually.");
        setMode("login");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getLoginFormHandler = () => {
    switch (authMethod) {
      case 'password':
        return handlePasswordLogin;
      case 'request-otp':
        return handleOtpLoginRequest;
      case 'verify-login-otp':
        return handleOtpLoginVerify;
      default:
        return handlePasswordLogin;
    }
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0 z-0 opacity-50">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600/50 rounded-full blur-3xl animate-[spin_20s_linear_infinite]" />
          <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-600/50 rounded-full blur-3xl animate-[spin_25s_linear_infinite_reverse]" />
          <div className="absolute -bottom-40 left-1/3 w-72 h-72 bg-pink-600/50 rounded-full blur-3xl animate-[spin_18s_linear_infinite]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiPjxwYXRoIGQ9Ik0wIC41SDMybTAtMTBWMzJNMCAxNS41SDMybTAtMTBWMzIiLz48L3N2Zz4=')] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000,transparent_100%)]" />
      </div>
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-2 mb-3">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg shadow-purple-600/30">
                <Sparkles className="size-6 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
              StartupInspector
            </h1>
            <p className="text-slate-400 mt-2">AI-Powered Startup Analysis</p>
          </div>
          <motion.div
            layout
            transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl shadow-purple-900/20 border border-slate-800 p-6 sm:p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 -m-4 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 -m-4 w-24 h-24 bg-indigo-600/10 rounded-full blur-2xl" />
            <div className="relative">
              <AnimatePresence mode="wait">
                {mode === "login" && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                      <p className="text-slate-400 mt-1">Sign in to continue your journey</p>
                    </div>
                    <form onSubmit={getLoginFormHandler()} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2 text-slate-300">
                          <Mail className="size-4 text-purple-400" /> Email
                        </Label>
                        <Input id="email" name="email" type="email" placeholder="your@email.com" required onChange={handleInputChange} />
                      </div>
                      <AnimatePresence>
                        {authMethod === 'password' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{duration: 0.3}} className="space-y-2 overflow-hidden">
                            <Label htmlFor="password" className="flex items-center gap-2 text-slate-300">
                              <Lock className="size-4 text-purple-400" /> Password
                            </Label>
                            <Input id="password" name="password" type="password" placeholder="••••••••" required onChange={handleInputChange} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {authMethod === 'verify-login-otp' && (
                         <motion.div key="login-otp" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-2 pt-2">
                           <Label htmlFor="otp" className="flex items-center justify-center gap-2 text-slate-300 text-center text-sm">
                               Enter the OTP sent to your email
                           </Label>
                           <OtpInput length={6} onChange={handleOtpChange} />
                         </motion.div>
                      )}
                      {error && <p className="text-red-400 text-sm font-medium text-center bg-red-500/10 p-2 rounded-md border border-red-500/20">{error}</p>}
                      <Button type="submit" disabled={isLoading} className="w-full group gap-2" size="lg">
                        {isLoading ? <LoaderCircle className="size-5 animate-spin"/> : <ShieldCheck className="size-5 group-hover:scale-110 transition-transform"/>}
                        <span>{isLoading ? 'Loading...' : (authMethod === 'request-otp' ? 'Send OTP' : (authMethod === 'verify-login-otp' ? 'Verify & Sign In' : 'Sign In'))}</span>
                      </Button>
                    </form>
                    <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div><div className="relative flex justify-center text-sm"><span className="px-4 bg-slate-900 text-slate-500">OR</span></div></div>
                    <div className="space-y-3">
                        <Button variant="outline" className="w-full gap-2 text-white" size="lg" onClick={() => setAuthMethod(authMethod === 'password' ? 'request-otp' : 'password')}>
                           <Zap className="size-5 text-purple-400" />
                           {authMethod === 'password' ? 'Sign in with OTP' : 'Sign in with Password'}
                        </Button>
                        {/* <Button variant="outline" className="w-full gap-2 text-white" size="lg" onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
                          <svg className="size-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Google</title><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                          Sign in with Google
                        </Button> */}
                    </div>
                    <p className="mt-8 text-center text-sm text-slate-400">
                      New to StartupInspector?{" "}
                      <button onClick={() => { setMode("signup"); setError(''); setFormData({}); }} className="font-semibold text-purple-400 hover:text-purple-300 transition-colors underline-offset-4 hover:underline">
                        Sign Up Now
                      </button>
                    </p>
                  </motion.div>
                )}
                {mode === "signup" && (
                  <motion.div key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold text-white">Create Account</h2>
                      <p className="text-slate-400 mt-1">Start analyzing your startup ideas</p>
                    </div>
                    <form onSubmit={handleSignupOtpRequest} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="flex items-center gap-2 text-slate-300"><User className="size-4 text-purple-400" />First Name</Label>
                          <Input id="firstName" name="firstName" type="text" placeholder="John" required onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="flex items-center gap-2 text-slate-300"><User className="size-4 text-purple-400" />Last Name</Label>
                          <Input id="lastName" name="lastName" type="text" placeholder="Doe" required onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2 text-slate-300"><Mail className="size-4 text-purple-400" />Email</Label>
                        <Input id="email" name="email" type="email" placeholder="your@email.com" required onChange={handleInputChange}/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="flex items-center gap-2 text-slate-300"><Lock className="size-4 text-purple-400" />Password</Label>
                        <Input id="password" name="password" type="password" placeholder="min. 8 characters" required minLength={8} onChange={handleInputChange}/>
                      </div>
                      {error && <p className="text-red-400 text-sm font-medium text-center bg-red-500/10 p-2 rounded-md border border-red-500/20">{error}</p>}
                      <Button type="submit" disabled={isLoading} className="w-full group gap-2" size="lg">
                        {isLoading ? <LoaderCircle className="size-5 animate-spin"/> : <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform"/>}
                        <span>{isLoading ? 'Creating...' : 'Continue'}</span>
                      </Button>
                    </form>
                    <p className="mt-8 text-center text-sm text-slate-400">
                      Already have an account?{" "}
                      <button onClick={() => { setMode("login"); setError(''); setFormData({}); }} className="font-semibold text-purple-400 hover:text-purple-300 transition-colors underline-offset-4 hover:underline">
                        Login
                      </button>
                    </p>
                  </motion.div>
                )}
                {mode === "verify-signup" && (
                  <motion.div
                    key="verify-signup"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-8 text-center">
                      <ShieldCheck className="mx-auto size-12 text-purple-400 mb-2"/>
                      <h2 className="text-3xl font-bold text-white">Verify Your Email</h2>
                      <p className="text-slate-400 mt-2">
                        An OTP has been sent to <br/>
                        <span className="font-semibold text-purple-300">{formData.email}</span>
                      </p>
                    </div>
                    <form onSubmit={handleSignupOtpVerify} className="space-y-6">
                        <OtpInput length={6} onChange={handleOtpChange} />
                        {error && <p className="text-red-400 text-sm font-medium text-center bg-red-500/10 p-2 rounded-md border border-red-500/20">{error}</p>}
                        <Button type="submit" disabled={isLoading} className="w-full gap-2" size="lg">
                            {isLoading ? <LoaderCircle className="size-5 animate-spin"/> : <Zap className="size-5" />}
                            <span>{isLoading ? 'Verifying...' : 'Verify & Create Account'}</span>
                        </Button>
                    </form>
                    <p className="mt-8 text-center text-sm text-slate-400">
                      Didn't get a code?{" "}
                      <button onClick={(e) => handleSignupOtpRequest(e)} disabled={isLoading} className="font-semibold text-purple-400 hover:underline disabled:opacity-50">Resend</button>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          <p className="mt-8 text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} StartupInspector. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}