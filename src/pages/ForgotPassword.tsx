import React, { useState } from 'react';
import { useUserData } from '../context/userContext';
import { motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';


const ForgotPassword = () => {
    const navigate= useNavigate()
  const [email, setemail] = useState('');
  const [isSubmitted, setisSubmitted] = useState(false);

  const { btnLoading, forgotPassword } = useUserData();
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await forgotPassword(email);
    setisSubmitted(true);
  };



  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] p-4 overflow-hidden">
     


      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md p-8 rounded-3xl shadow-2xl backdrop-blur-md bg-white/10 border border-white/20 z-10"
      >
        {isSubmitted ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }}
            className="text-center space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">Check your email 📧</h2>
            <p className="text-gray-300 text-sm">
              We've sent you a link to reset your password. Please check your inbox (and spam folder).
            </p>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="mt-6 inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow-lg hover:from-pink-400 hover:to-purple-400 transition-all duration-300"
            >
              Back to Login
            </motion.button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-extrabold text-white text-center">Forgot Password</h2>
            <p className="text-gray-400 text-center text-sm">Enter your email address below</p>

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={btnLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 disabled:opacity-50"
            >
              {btnLoading ? 'Sending...' : 'Send Reset Link'}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
