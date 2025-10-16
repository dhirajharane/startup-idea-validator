"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const loadingMessages = [
  "Analyzing market potential...",
  "Evaluating competitive landscape...",
  "Assessing monetization strategies...",
  "Calculating startup score...",
  "Generating final report...",
];

export function LoadingState() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center relative overflow-hidden">
      {/* Background animated grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Neural network animation */}
        <div className="mb-12 relative w-64 h-64 mx-auto">
          {/* Center node */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            style={{ x: "-50%", y: "-50%" }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Orbiting nodes */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i * 60 * Math.PI) / 180;
            const radius = 80;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2"
                style={{ x: "-50%", y: "-50%" }}
              >
                <motion.div
                  className="w-3 h-3 bg-indigo-400 rounded-full"
                  animate={{
                    x: [x, x * 1.2, x],
                    y: [y, y * 1.2, y],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                />
                {/* Connection lines */}
                <motion.div
                  className="absolute top-1/2 left-1/2 h-px bg-gradient-to-r from-indigo-500/50 to-transparent origin-left"
                  style={{
                    width: radius,
                    rotate: `${i * 60}deg`,
                    x: "-50%",
                    y: "-50%",
                  }}
                  animate={{
                    opacity: [0.2, 0.8, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Loading messages */}
        <div className="space-y-4 min-h-[80px]">
          {loadingMessages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: currentMessageIndex === index ? 1 : 0,
                y: currentMessageIndex === index ? 0 : 20,
              }}
              transition={{ duration: 0.5 }}
              className="absolute left-1/2 -translate-x-1/2"
            >
              <p className="text-white" style={{ fontSize: "20px", fontWeight: 600 }}>
                {message}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-16 max-w-md mx-auto">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 10,
                ease: "easeInOut",
              }}
            />
          </div>
          <p className="mt-4 text-gray-400" style={{ fontSize: "14px" }}>
            This usually takes 5-10 seconds
          </p>
        </div>
      </div>
    </div>
  );
}