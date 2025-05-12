import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserData } from '../context/userContext';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti'; 
import ReCAPTCHA from "react-google-recaptcha";
import toast from "react-hot-toast";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_CAPTCHA_CLIENT_KEY as string

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setcaptchaToken] = useState<string | null>(null)
  const { registerUser, btnLoading } = useUserData();
  const navigate = useNavigate();
  const confettiFired = useRef(false);
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  function getPasswordChecks(password: string) {
    return {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  }

  const passwordChecks = getPasswordChecks(password);

  const totalChecksPassed = Object.values(passwordChecks).filter(Boolean).length;
  const isPasswordStrong = totalChecksPassed === 4;

  useEffect(() => {
    if (isPasswordStrong && !confettiFired.current) {
      confettiFired.current = true;
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else if (!isPasswordStrong) {
      confettiFired.current = false;
    }
  }, [isPasswordStrong]);


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
  
      registerUser(name,email, password, navigate, token);
    } catch (error) {
      console.error("Captcha error:", error);
      toast.error("Something went wrong with captcha");
    }
  }
  

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#0f172a] overflow-hidden px-4">
      {/* Background Orbs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute w-[400px] h-[400px] bg-cyan-500/20 blur-3xl rounded-full top-[-100px] left-[-100px] z-0"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute w-[500px] h-[500px] bg-sky-700/30 blur-2xl rounded-full bottom-[-150px] right-[-150px] z-0"
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl font-bold text-center text-white drop-shadow mb-4"
        >
          Sign up to <span className="text-cyan-400">Musify</span>
        </motion.h2>

        <p className="text-sm text-center text-gray-400 mb-8">
          Your music journey begins here 🚀
        </p>

        <form onSubmit={submitHandler} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="text-sm block mb-1 text-white">Full Name</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              className="auth-glass-input"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="text-sm block mb-1 text-white">Email Address</label>
            <input
              type="email"
              placeholder="e.g. johndoe@mail.com"
              className="auth-glass-input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-sm block mb-1 text-white flex items-center">
              Password
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="ml-2 cursor-pointer relative group"
              >
                <span className="text-xs text-cyan-400">ℹ️</span>
                <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 left-1/2 transform -translate-x-1/2 bottom-full mb-2 shadow-lg w-48 z-50">
                  Password must have:
                  <ul className="list-disc ml-4 mt-1">
                    <li>6+ characters</li>
                    <li>1 uppercase letter</li>
                    <li>1 number</li>
                    <li>1 special character</li>
                  </ul>
                </div>
              </motion.div>
            </label>

            <input
              type="password"
              placeholder="Enter Password"
              className="auth-glass-input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Live Progress */}
            {password && (
              <motion.div
                className={`mt-4 p-4 rounded-xl border ${
                  isPasswordStrong ? 'border-green-500 animate-pulse' : 'border-gray-700'
                } bg-black/30 backdrop-blur`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    {passwordChecks.length ? '✅' : '❌'} Minimum 6 characters
                  </li>
                  <li className="flex items-center gap-2">
                    {passwordChecks.uppercase ? '✅' : '❌'} 1 Uppercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    {passwordChecks.number ? '✅' : '❌'} 1 Number
                  </li>
                  <li className="flex items-center gap-2">
                    {passwordChecks.special ? '✅' : '❌'} 1 Special character
                  </li>
                </ul>
              </motion.div>
            )}
          </div>
          <ReCAPTCHA
  ref={recaptchaRef}
  sitekey={RECAPTCHA_SITE_KEY}
  size="invisible"
/>

          {/* Submit Button */}
          <button
            disabled={btnLoading}
            className={`auth-glow-btn ${btnLoading && 'cursor-not-allowed opacity-80'}`}
          >
            {btnLoading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Please Wait
              </div>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <button onClick={() => navigate('/login')}>Login</button>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
