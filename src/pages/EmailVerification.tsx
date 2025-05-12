import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserData } from '../context/userContext';
import toast from 'react-hot-toast';

const EmailVerification = () => {
  const { verifyEmail } = useUserData();
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return; // Only allow numbers

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move focus
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const submitCode = async (finalCode: string) => {
   
     const isVerified= await verifyEmail(finalCode);
     if(isVerified)
      {navigate('/');
      toast.success('Email verified successfully');}
      else {
        setCode(['', '', '', '', '', '']);
        inputRefs.current.forEach((input, idx) => {
          if (input) {
            input.value = '';
          }
        });
        setError('Invalid or expired verification code');
        
      }
   
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('Text').slice(0, 6);
    if (!/^[0-9]+$/.test(pasted)) return; // Only allow numbers

    const newCode = pasted.split('').slice(0, 6);
    setCode(newCode);

    newCode.forEach((digit, idx) => {
      if (inputRefs.current[idx]) {
        inputRefs.current[idx]!.value = digit;
      }
    });

    // Auto submit
    if (newCode.length === 6) {
      submitCode(newCode.join(''));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-zinc-900 border border-zinc-700 p-8 rounded-xl shadow-lg max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Verify Your Email
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Enter the 6-digit code sent to your email
        </p>

        <div className="flex justify-center gap-4 mb-6">
          {code.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              ref={(el) => { inputRefs.current[idx] = el; }}
              className="w-12 h-12 text-center text-2xl bg-zinc-800 border border-zinc-700 rounded-lg text-white"
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={handlePaste}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <button
          onClick={() => submitCode(code.join(''))}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg mt-4"
        >
          Verify Email
        </button>
      </motion.div>
    </div>
  );
};

export default EmailVerification;