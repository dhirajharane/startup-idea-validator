'use client';
import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  Target,
  DollarSign,
  Lightbulb,
  FileText,
  Users,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Advanced machine learning algorithms analyze your startup idea from every angle.",
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    icon: Target,
    title: "SWOT Analysis",
    description:
      "Comprehensive breakdown of Strengths, Weaknesses, Opportunities, and Threats.",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: TrendingUp,
    title: "Market Trends",
    description:
      "Real-time market insights and emerging trends in your industry.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: DollarSign,
    title: "Monetization Strategies",
    description:
      "Proven revenue models and pricing strategies tailored to your business.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Users,
    title: "Competitor Analysis",
    description:
      "Detailed insights on competitors, market positioning, and differentiation.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Lightbulb,
    title: "Actionable Insights",
    description:
      "Data-driven recommendations to refine and improve your startup concept.",
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    icon: FileText,
    title: "Pitch Deck Outline",
    description:
      "Professional pitch deck structure to impress investors and stakeholders.",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: BarChart3,
    title: "Success Score",
    description:
      "Quantified rating with visual charts showing your startup's potential.",
    gradient: "from-purple-500 to-indigo-600",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/15 rounded-full filter blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/15 rounded-full filter blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-5xl md:text-6xl mb-8 leading-tight md:leading-snug bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
            style={{ fontWeight: 700 }}
          >
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive tools and insights to transform your idea into a
            thriving business.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative"
            >
              <div className="relative h-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-transparent hover:shadow-2xl transition-all duration-300">
                {/* Gradient border on hover */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm`}
                />

                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
