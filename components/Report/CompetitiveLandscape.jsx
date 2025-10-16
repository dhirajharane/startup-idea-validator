"use client";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

// Function to get initials from company name
const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Mock function to check if we should show a logo (in production, you'd fetch actual logos)
const hasLogo = (name) => {
  const knownCompanies = ["Shopify", "Wix", "Amazon", "Etsy", "WooCommerce", "BigCommerce"];
  return knownCompanies.includes(name);
};

export function CompetitiveLandscape({ competitors }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-orange-400" strokeWidth={2} />
        </div>
        <h3 className="text-white">Competitive Landscape</h3>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitors.map((competitor, index) => {
          const initials = getInitials(competitor.name);
          const showLogo = hasLogo(competitor.name);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 transition-all duration-300 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer group"
            >
              {/* Logo/Initial Circle */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                {showLogo ? (
                  <span className="text-white" style={{ fontSize: "20px", fontWeight: 700 }}>
                    {initials}
                  </span>
                ) : (
                  <span className="text-white" style={{ fontSize: "24px", fontWeight: 700 }}>
                    {initials}
                  </span>
                )}
              </div>

              {/* Name */}
              <h4 className="text-white mb-3 group-hover:text-indigo-400 transition-colors" style={{ fontWeight: 600 }}>
                {competitor.name}
              </h4>

              {/* Description */}
              <p className="text-gray-400" style={{ fontSize: "14px", lineHeight: 1.6 }}>
                {competitor.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}