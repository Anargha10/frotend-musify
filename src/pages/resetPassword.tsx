import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserData } from '../context/userContext';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [checks, setChecks] = useState({
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
    length: false,
  });

  const { resetPassword: resetPasswordFromContext, btnLoading } = useUserData(); // Renamed to avoid conflict

  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    setChecks({
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
      length: password.length >= 8,
    });
  }, [password]);

  const allValid = Object.values(checks).every(Boolean) && password === confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('Invalid or missing token');
      return;
    }

    if (!allValid) {
      toast.error('Password validation failed');
      return;
    }

    try {
      await resetPasswordFromContext(token, password);
      toast.success('Password reset successfully. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Error resetting password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-green-700 p-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg border border-green-600 rounded-2xl p-8 max-w-md w-full space-y-6 shadow-lg"
      >
        <h2 className="text-2xl text-white font-bold text-center">Reset Password</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1 text-sm text-white">
          <p className="font-semibold">Password must contain:</p>
          <ul className="space-y-1">
            <li className={checks.lowercase ? 'text-green-300' : 'text-red-400'}>- Lowercase letter</li>
            <li className={checks.uppercase ? 'text-green-300' : 'text-red-400'}>- Uppercase letter</li>
            <li className={checks.number ? 'text-green-300' : 'text-red-400'}>- Number</li>
            <li className={checks.special ? 'text-green-300' : 'text-red-400'}>- Special character</li>
            <li className={checks.length ? 'text-green-300' : 'text-red-400'}>- Minimum 8 characters</li>
            <li className={password === confirm && confirm ? 'text-green-300' : 'text-red-400'}>- Passwords match</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={!allValid || btnLoading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition-opacity ${
            allValid ? 'bg-green-600 hover:bg-green-500' : 'bg-green-600/50 cursor-not-allowed'
          }`}
        >
          {btnLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </motion.form>
    </div>
  );
};

export default ResetPassword;
