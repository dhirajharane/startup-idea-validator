'use client';
import { motion } from "framer-motion";

const stats = [
  { value: "50K+", label: "Ideas Analyzed" },
  { value: "94%", label: "Accuracy Rate" },
  { value: "10M+", label: "Data Points" },
  { value: "<30s", label: "Average Analysis Time" },
];

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl text-white mb-4" style={{ fontWeight: 700 }}>
            Trusted by Entrepreneurs Worldwide
          </h2>
          <p className="text-xl text-indigo-100">
            Join thousands who've validated their ideas with us
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div
                className="text-5xl md:text-6xl text-white mb-2"
                style={{ fontWeight: 700 }}
              >
                {stat.value}
              </div>
              <div className="text-lg text-purple-100">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
