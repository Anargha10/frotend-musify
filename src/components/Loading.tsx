import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black text-white animate-fade-in relative overflow-hidden">
      {/* Particle Sparks */}
      <div className="absolute w-full h-full pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full animate-spark"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: `hsl(${Math.random() * 360}, 100%, 70%)`,
            }}
          />
        ))}
      </div>

      {/* Loader Core */}
      <div className="relative w-32 h-32 mb-6 glass-loader flex items-center justify-center rounded-full bg-opacity-10 backdrop-blur-md">
        {/* Neon Rings */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent animate-spinSlow neon-ring ring-1"></div>
        <div className="absolute top-[12%] left-[12%] w-[76%] h-[76%] rounded-full border-4 border-transparent animate-spinReverse neon-ring ring-2"></div>
        <div className="absolute top-[25%] left-[25%] w-[50%] h-[50%] rounded-full border-4 border-transparent animate-pulse neon-ring ring-3"></div>

        {/* Pulse Waves */}
        <div className="absolute w-[40%] h-[40%]">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-wave">
            <polyline
              fill="none"
              stroke="cyan"
              strokeWidth="2"
              points="0,50 20,30 40,70 60,30 80,50 100,40"
            />
          </svg>
        </div>
      </div>

      {/* Text */}
      <p className="text-lg font-semibold tracking-wider opacity-80 text-center">
        Tuning the universe...
      </p>

      <style>{`
        .neon-ring {
          box-shadow: 0 0 15px rgba(255, 0, 255, 0.4),
                      0 0 30px rgba(0, 255, 255, 0.3),
                      0 0 45px rgba(255, 255, 0, 0.2);
        }

        .ring-1 {
          border-top-color: #ec4899;
          border-right-color: #8b5cf6;
        }

        .ring-2 {
          border-top-color: #22d3ee;
          border-left-color: #c084fc;
        }

        .ring-3 {
          border-bottom-color: #facc15;
          border-top-color: #34d399;
        }

        .glass-loader {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .animate-spinSlow {
          animation: spinSlow 3.5s linear infinite;
        }

        .animate-spinReverse {
          animation: spinReverse 4s linear infinite;
        }

        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }

        .animate-wave {
          animation: waveMotion 1.5s ease-in-out infinite alternate;
        }

        .animate-fade-in {
          animation: fadeIn 0.7s ease-out;
        }

        .animate-spark {
          animation: spark 2.5s ease-in-out infinite;
        }

        @keyframes spinSlow {
          to { transform: rotate(360deg); }
        }

        @keyframes spinReverse {
          to { transform: rotate(-360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.15); opacity: 1; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes waveMotion {
          0% { transform: translateY(0); }
          100% { transform: translateY(-5px); }
        }

        @keyframes spark {
          0% { transform: scale(0.5) translateY(0); opacity: 0.8; }
          50% { transform: scale(1.2) translateY(-10px); opacity: 1; }
          100% { transform: scale(0.8) translateY(-20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Loading;
