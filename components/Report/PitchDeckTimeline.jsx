"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileText } from "lucide-react";

export function PitchDeckTimeline({ pitchDeckOutline }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-8"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
          <FileText className="w-5 h-5 text-purple-400" strokeWidth={2} />
        </div>
        <h3 className="text-white">Pitch Deck Outline</h3>
      </div>

      <div className="relative pl-8">
        {/* Vertical line */}
        <motion.div
          className="absolute left-0 top-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-violet-500 origin-top"
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{ height: `${pitchDeckOutline.length * 80}px` }}
        />

        {/* Timeline items */}
        <div className="space-y-8">
          {pitchDeckOutline.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
              className="relative flex items-center gap-4 group"
            >
              {/* Dot */}
              <motion.div
                className="absolute -left-8 w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-gray-950"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.15 }}
                whileHover={{ scale: 1.3 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.5 + index * 0.15,
                  }}
                />
              </motion.div>

              {/* Content */}
              <div className="flex-1 bg-gray-800/30 border border-gray-800 rounded-lg p-4 group-hover:bg-gray-800/50 group-hover:border-indigo-500/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-indigo-500/10">
                <div className="flex items-center gap-3">
                  <span className="text-indigo-400" style={{ fontSize: "14px", fontWeight: 600 }}>
                    Slide {index + 1}
                  </span>
                  <span className="text-gray-600">•</span>
                  <span className="text-white" style={{ fontSize: "15px", fontWeight: 500 }}>
                    {item}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}