"use client";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

export function CoreFindings({ summary, conclusion }) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-8"
      >
        <h3 className="text-white mb-4">Summary</h3>
        <p className="text-gray-300" style={{ fontSize: "18px", lineHeight: 1.7 }}>
          {summary}
        </p>
      </motion.div>

      {/* Conclusion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 border-l-4 border-l-indigo-500 rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-indigo-400" strokeWidth={2} />
          </div>
          <h3 className="text-white">Conclusion</h3>
        </div>
        <p className="text-gray-300" style={{ fontSize: "18px", lineHeight: 1.7 }}>
          {conclusion}
        </p>
      </motion.div>
    </div>
  );
}