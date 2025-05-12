import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserData } from '../context/userContext';
import { motion } from 'framer-motion';
import ReCAPTCHA from "react-google-recaptcha";

import toast from 'react-hot-toast';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_CAPTCHA_CLIENT_KEY as string

const Register = () => {
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setcaptchaToken]= useState<string | null>(null)
  const navigate = useNavigate();
  const {loginUser, btnLoading } = useUserData();
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  async function submitHandler(e: React.FormEvent) {
    e.preventDefault();
  
    if (!recaptchaRef.current) {
      toast.error("Captcha not loaded");
      return;
    }
  
    try {
      const token = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset(); // optional: reset so it can be reused again
  
      if (!token) {
        toast.error("Captcha failed. Please try again.");
        return;
      }
  
      loginUser(email, password, navigate, token);
    } catch (error) {
      console.error("Captcha error:", error);
      toast.error("Something went wrong with captcha");
    }
  }
  

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden px-4">
      {/* Glow Orbs */}
      <div className="absolute w-[600px] h-[600px] bg-green-500 opacity-20 blur-[180px] rounded-full top-[-100px] left-[-100px] animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bg-purple-500 opacity-20 blur-[150px] rounded-full bottom-[-50px] right-[-50px] animate-pulse" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl"
      >
        <h2 className="text-4xl font-bold text-center text-white mb-2 tracking-tight">
          Create <span className="text-green-400">Musify</span> Account
        </h2>
        <p className="text-sm text-center text-gray-400 mb-8">
          Tune in to your own beat 🎶
        </p>

        <form onSubmit={submitHandler} className="space-y-6">
          

          <div>
            <label className="text-sm block mb-1 text-white">Email</label>
            <input
              type="email"
              placeholder="e.g. janedoe@mail.com"
              className="auth-input transition-all duration-200 focus:ring-2 focus:ring-green-400"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm block mb-1 text-white">Password</label>
            <input
              type="password"
              placeholder="Write your Password"
              className="auth-input transition-all duration-200 focus:ring-2 focus:ring-green-400"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <ReCAPTCHA
  ref={recaptchaRef}
  sitekey={RECAPTCHA_SITE_KEY}
  size="invisible"
/>

          <button
            disabled={btnLoading}
            className={`auth-btn ${btnLoading && 'cursor-not-allowed opacity-80'}`}
          >
            {btnLoading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Please Wait
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-6 text-sm flex justify-between text-center text-gray-400">
          <p>
            Don't have an account?{' '}
            <Link to={'/register'} className="text-green-400 hover:underline cursor-pointer">Register</Link>
            
          </p>
          <p>
            Forgot your Password?{' '}
            <Link to={'/forgot-password'} className="text-green-400 hover:underline cursor-pointer">forgot password</Link>
          </p>
        </div>
       
      </motion.div>
    </div>
  );
};

export default Register;
