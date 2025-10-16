"use client";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Rocket, ShieldAlert } from "lucide-react";

const SWOT_CONFIG = {
  strengths: {
    title: "Strengths",
    icon: TrendingUp,
    bgColor: "bg-green-500/5",
    borderColor: "border-green-500/20",
    iconColor: "text-green-400",
    iconBg: "bg-green-500/20",
  },
  weaknesses: {
    title: "Weaknesses",
    icon: TrendingDown,
    bgColor: "bg-amber-500/5",
    borderColor: "border-amber-500/20",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/20",
  },
  opportunities: {
    title: "Opportunities",
    icon: Rocket,
    bgColor: "bg-green-500/5",
    borderColor: "border-green-500/20",
    iconColor: "text-green-400",
    iconBg: "bg-green-500/20",
  },
  threats: {
    title: "Threats",
    icon: ShieldAlert,
    bgColor: "bg-red-500/5",
    borderColor: "border-red-500/20",
    iconColor: "text-red-400",
    iconBg: "bg-red-500/20",
  },
};

export function SwotAnalysis({ swot }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {Object.entries(swot).map(([key, items], index) => {
        const config = SWOT_CONFIG[key];
        const Icon = config.icon;

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className={`${config.bgColor} backdrop-blur-sm border ${config.borderColor} rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer group`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-lg ${config.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-6 h-6 ${config.iconColor}`} strokeWidth={2} />
              </div>
              <h3 className="text-white">{config.title}</h3>
            </div>

            <ul className="space-y-3">
              {items.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 + i * 0.05 }}
                  className="flex items-start gap-3 text-gray-300"
                  style={{ fontSize: "14px", lineHeight: 1.6 }}
                >
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${config.iconColor.replace('text-', 'bg-')} flex-shrink-0`} />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        );
      })}
    </div>
  );
}