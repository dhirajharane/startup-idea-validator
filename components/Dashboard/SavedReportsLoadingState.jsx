"use client";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";

export function SavedReportsLoadingState() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(236, 72, 153, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(236, 72, 153, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <motion.div
        className="absolute top-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      <div className="relative z-10 text-center">
        <motion.div
          className="mb-8 w-24 h-24 mx-auto"
          animate={{
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Bookmark className="w-full h-full text-pink-400" strokeWidth={1.5} />
        </motion.div>

        <div className="space-y-4">
          <p className="text-white" style={{ fontSize: "20px", fontWeight: 600 }}>
            Loading Saved Reports...
          </p>
        </div>

        <div className="mt-12 max-w-sm mx-auto">
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-500 to-orange-500"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
          <p className="mt-3 text-gray-400" style={{ fontSize: "14px" }}>
            Retrieving your saved collection.
          </p>
        </div>
      </div>
    </div>
  );
}