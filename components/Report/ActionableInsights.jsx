"use client";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";


const getInsightDetails = (title) => {
  const details = {
    "Actionable Insight 1": {
      description: "Focus on intuitive design patterns that reduce friction and make it easy for users to complete their goals. Conduct usability testing with real users to identify pain points and optimize the user journey.",
      priority: "high",
    },
    "Actionable Insight 2": {
      description: "Choose a reliable payment processor that supports multiple payment methods and currencies. Ensure PCI compliance and implement fraud detection to build trust with your customers and protect transactions.",
      priority: "high",
    },
  };
  
  return details[title] || {
    description: "",
    priority: "medium",
  };
};

const priorityConfig = {
  high: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    label: "High Priority",
  },
  medium: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    label: "Medium Priority",
  },
  low: {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    label: "Low Priority",
  },
};

export function ActionableInsights({ actionableInsights }) {
  const [checkedItems, setCheckedItems] = useState(new Set());

  const toggleCheck = (index) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-indigo-400" strokeWidth={2} />
        </div>
        <h3 className="text-white">Actionable Insights</h3>
      </div>

      <div className="space-y-4">
        {actionableInsights.map((item, index) => {
          const details = getInsightDetails(item);
          const isChecked = checkedItems.has(index);
          const config = priorityConfig[details.priority];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Vertical line connector (except for last item) */}
              {index < actionableInsights.length - 1 && (
                <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500/50 to-transparent" />
              )}

              <div
                className={`relative bg-gray-900/30 backdrop-blur-sm border-2 rounded-2xl p-6 transition-all duration-300 cursor-pointer overflow-hidden ${
                  isChecked
                    ? "border-green-500/50 bg-green-500/5"
                    : "border-gray-800 hover:border-indigo-500/30"
                }`}
                onClick={() => toggleCheck(index)}
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative flex items-start gap-4">
                  {/* Checkbox */}
                  <motion.div
                    className={`flex-shrink-0 w-12 h-12 rounded-xl border-2 grid place-items-center transition-all duration-300 ${ // MODIFIED: Changed flex to grid
                      isChecked
                        ? "bg-green-500 border-green-500"
                        : "bg-gray-800/50 border-gray-700 group-hover:border-indigo-500"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="col-start-1 row-start-1" // MODIFIED: Added grid placement
                      initial={false}
                      animate={{
                        scale: isChecked ? 1 : 0,
                        rotate: isChecked ? 0 : -180,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckCircle2 className="w-7 h-7 text-white" strokeWidth={2.5} />
                    </motion.div>
                    
                    {!isChecked && (
                      <div 
                        className="col-start-1 row-start-1 text-gray-500" // MODIFIED: Added grid placement
                        style={{ fontSize: "20px", fontWeight: 700 }}>
                        {index + 1}
                      </div>
                    )}
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h4
                        className={`text-white group-hover:text-indigo-400 transition-colors ${
                          isChecked ? "line-through opacity-60" : ""
                        }`}
                        style={{ fontWeight: 600 }}
                      >
                        {item}
                      </h4>

                      {/* Priority badge */}
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                        className={`flex-shrink-0 px-3 py-1 ${config.bg} border ${config.border} rounded-full`}
                      >
                        <span className={config.color} style={{ fontSize: "12px", fontWeight: 600 }}>
                          {config.label}
                        </span>
                      </motion.div>
                    </div>

                    <p
                      className={`text-gray-400 mb-4 transition-opacity ${
                        isChecked ? "opacity-50" : ""
                      }`}
                      style={{ fontSize: "14px", lineHeight: 1.6 }}
                    >
                      {details.description}
                    </p>

                    {/* Action button */}
                    {!isChecked && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                        className="flex items-center gap-2 text-indigo-400 group-hover:text-indigo-300 transition-colors"
                        style={{ fontSize: "14px", fontWeight: 500 }}
                      >
                        <span>Take action</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-4 h-4" strokeWidth={2} />
                        </motion.div>
                      </motion.div>
                    )}

                    {isChecked && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 text-green-400"
                        style={{ fontSize: "14px", fontWeight: 500 }}
                      >
                        <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                        <span>Completed</span>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Shine effect on complete */}
                {isChecked && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 0.8 }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400" style={{ fontSize: "14px", fontWeight: 500 }}>
            Implementation Progress
          </span>
          <span className="text-white" style={{ fontSize: "14px", fontWeight: 600 }}>
            {checkedItems.size} / {actionableInsights.length} completed
          </span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${(checkedItems.size / actionableInsights.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}