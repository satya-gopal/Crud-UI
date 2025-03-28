import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

interface ErrorMessage {
  key: string;
  message: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ErrorMessage[]>([
    { key: "email", message: "" },
    { key: "password", message: "" },
  ]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let hasErrors = false;

    if (!email) {
      setErrors((prevErrors) =>
        prevErrors.map((err) =>
          err.key === "email" ? { ...err, message: "Email is required" } : err
        )
      );
      hasErrors = true;
    }

    if (!password) {
      setErrors((prevErrors) =>
        prevErrors.map((err) =>
          err.key === "password" ? { ...err, message: "Password is required" } : err
        )
      );
      hasErrors = true;
    }

    if (hasErrors) return;

    try {
      const response = await fetch("https://reqres.in/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success("Login successful!");
        const access_token = data.token;
        const expiryDays = 7;

        Cookies.set("token", access_token, {
          expires: expiryDays,
          secure: true,
          sameSite: "Strict",
        });

        navigate("/users");
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Try again!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-1/2 flex items-center justify-center bg-white p-4 md:p-8"
      >
        <div className="w-full max-w-md">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="inline-block"
            >
              <LogIn className="w-12 h-12 text-violet-600 mx-auto mb-4" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
            <p className="text-gray-600 mt-2">Please sign in to your account</p>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:border-transparent pl-12 bg-gray-50"
                  placeholder="Email Address"
                />
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.find(err => err.key === "email")?.message && (
                <p className="text-red-500 text-sm mt-1">{errors.find(err => err.key === "email")?.message}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:border-transparent pl-12 pr-12 bg-gray-50"
                  placeholder="Password"
                />
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5"
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.find(err => err.key === "password")?.message && (
                <p className="text-red-500 text-sm mt-1">{errors.find(err => err.key === "password")?.message}</p>
              )}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 text-lg"
            >
              Sign In
            </motion.button>
          </form>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2 bg-cover bg-center min-h-[300px] md:min-h-screen relative"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-indigo-900 bg-opacity-50 ">
          <div className="h-full flex items-center justify-center">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-center text-white p-6 md:p-10"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">CrudUI Management System</h2>
              <p className="text-lg md:text-xl">Streamline your user management workflow</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;