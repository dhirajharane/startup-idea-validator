"use client";
import { motion } from "motion/react";
import { DollarSign, Lightbulb } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

// Mock descriptions - in production these would come from the API
const getMonetizationDescription = (title) => {
  const descriptions = {
    "Commission-based sales model": "Earn a percentage from each transaction made through your platform. This model scales well with transaction volume and aligns your success with your customers' success.",
    "Subscription-based service": "Provide recurring value through monthly or annual subscriptions. This creates predictable revenue streams and encourages long-term customer relationships.",
    "Advertising revenue": "Monetize through strategic ad placements. Partner with relevant brands to display targeted advertisements to your user base while maintaining user experience quality.",
  };
  return descriptions[title] || "A strategic approach to generating revenue for your business.";
};

const getInsightDescription = (title) => {
  const descriptions = {
    "Implement a user-friendly interface": "Focus on intuitive design patterns that reduce friction and make it easy for users to complete their goals. Conduct usability testing with real users to identify pain points and optimize the user journey.",
    "Integrate a robust payment gateway": "Choose a reliable payment processor that supports multiple payment methods and currencies. Ensure PCI compliance and implement fraud detection to build trust with your customers and protect transactions.",
  };
  return descriptions[title] || "A strategic action to improve your business performance.";
};

export function StrategyAccordion({ monetization, actionableInsights }) {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Monetization Strategies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-400" strokeWidth={2} />
          </div>
          <h3 className="text-white">Monetization Strategies</h3>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {monetization.map((item, index) => (
            <AccordionItem
              key={index}
              value={`monetization-${index}`}
              className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                <div className="flex items-center gap-3 text-left">
                  <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 text-green-400" style={{ fontSize: "12px", fontWeight: 600 }}>
                    {index + 1}
                  </span>
                  <span className="text-white group-hover:text-indigo-400 transition-colors" style={{ fontSize: "15px", fontWeight: 500 }}>
                    {item}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-gray-400 pl-9" style={{ fontSize: "14px", lineHeight: 1.6 }}>
                  {getMonetizationDescription(item)}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      {/* Actionable Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-indigo-400" strokeWidth={2} />
          </div>
          <h3 className="text-white">Actionable Insights</h3>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {actionableInsights.map((item, index) => (
            <AccordionItem
              key={index}
              value={`insight-${index}`}
              className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                <div className="flex items-center gap-3 text-left">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 text-indigo-400" style={{ fontSize: "12px", fontWeight: 600 }}>
                    {index + 1}
                  </span>
                  <span className="text-white group-hover:text-indigo-400 transition-colors" style={{ fontSize: "15px", fontWeight: 500 }}>
                    {item}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-gray-400 pl-9" style={{ fontSize: "14px", lineHeight: 1.6 }}>
                  {getInsightDescription(item)}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  );
}