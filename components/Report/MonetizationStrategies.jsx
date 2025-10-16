"use client";
import { motion } from "framer-motion";
import { DollarSign, CreditCard, TrendingUp, Zap } from "lucide-react";

// Mock descriptions - in production these would come from the API
const getMonetizationDetails = (title, index) => {
  const details = {
    "Commission-based sales model": {
      description: "Earn a percentage from each transaction made through your platform. This model scales well with transaction volume and aligns your success with your customers' success.",
      icon: DollarSign,
      gradient: "from-green-500 to-emerald-500",
    },
    "Subscription-based service": {
      description: "Provide recurring value through monthly or annual subscriptions. This creates predictable revenue streams and encourages long-term customer relationships.",
      icon: CreditCard,
      gradient: "from-blue-500 to-cyan-500",
    },
    "Advertising revenue": {
      description: "Monetize through strategic ad placements. Partner with relevant brands to display targeted advertisements to your user base while maintaining user experience quality.",
      icon: TrendingUp,
      gradient: "from-purple-500 to-pink-500",
    },
  };
  
  const defaultIcons = [DollarSign, CreditCard, TrendingUp, Zap];
  const defaultGradients = [
    "from-green-500 to-emerald-500",
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-orange-500 to-amber-500",
  ];
  
  return details[title] || {
    description: "A strategic approach to generating revenue for your business.",
    icon: defaultIcons[index % defaultIcons.length],
    gradient: defaultGradients[index % defaultGradients.length],
  };
};

export function MonetizationStrategies({ monetization }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-green-400" strokeWidth={2} />
        </div>
        <h3 className="text-white">Monetization Strategies</h3>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monetization.map((item, index) => {
          const details = getMonetizationDetails(item, index);
          const Icon = details.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 overflow-hidden cursor-pointer"
            >
              {/* Animated gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${details.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Glow effect */}
              <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${details.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

              {/* Number badge */}
              <div className="relative flex items-start justify-between mb-4">
                <motion.div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${details.gradient} flex items-center justify-center shadow-lg`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                </motion.div>

                <motion.div
                  className="px-3 py-1 bg-gray-800/50 border border-gray-700 rounded-full"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.15 + 0.2 }}
                >
                  <span className="text-gray-400" style={{ fontSize: "12px", fontWeight: 600 }}>
                    #{index + 1}
                  </span>
                </motion.div>
              </div>

              {/* Content */}
              <div className="relative">
                <h4 className="text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300"
                  style={{ 
                    fontWeight: 600,
                    backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                  }}
                  className={`group-hover:from-green-400 group-hover:to-emerald-400`}
                >
                  {item}
                </h4>
                
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300" 
                  style={{ fontSize: "14px", lineHeight: 1.6 }}
                >
                  {details.description}
                </p>
              </div>

              {/* Bottom decoration */}
              <motion.div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${details.gradient} opacity-0 group-hover:opacity-100`}
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}