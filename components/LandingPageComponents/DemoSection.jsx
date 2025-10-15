'use client';

import React from "react";

import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { CheckCircle2, XCircle, TrendingUp, AlertTriangle } from "lucide-react";

const swotData = {
  strengths: [
    "Unique value proposition in untapped market",
    "Strong technical team with industry experience",
    "Scalable business model with low overhead",
  ],
  weaknesses: [
    "Limited initial funding and resources",
    "New brand with no market recognition",
    "Dependency on third-party APIs",
  ],
  opportunities: [
    "Growing demand for AI-powered solutions",
    "Potential partnerships with major platforms",
    "Expansion into international markets",
  ],
  threats: [
    "Established competitors with market share",
    "Rapid technology changes requiring adaptation",
    "Regulatory challenges in data privacy",
  ],
};

const scoreData = [
  { name: "Market Potential", value: 85, color: "#8b5cf6" },
  { name: "Innovation", value: 92, color: "#3b82f6" },
  { name: "Execution Risk", value: 68, color: "#ec4899" },
  { name: "Competitive Edge", value: 78, color: "#10b981" },
];

export function DemoSection() {
  const totalScore = Math.round(
    scoreData.reduce((acc, item) => acc + item.value, 0) / scoreData.length
  );

  return (
    <section id="demo" className="py-24 bg-gray-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-5xl md:text-6xl mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
            style={{ fontWeight: 700 }}
          >
            See It In Action
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Real analysis preview for a sample startup idea
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* SWOT Analysis Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <h3 className="mb-6 flex items-center gap-2 text-white">
                <span className="w-2 h-2 bg-purple-600 rounded-full" />
                SWOT Analysis
              </h3>

              <div className="space-y-6">
                {/* Strengths */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <h4 className="text-green-400">Strengths</h4>
                  </div>
                  <ul className="space-y-2">
                    {swotData.strengths.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <h4 className="text-red-400">Weaknesses</h4>
                  </div>
                  <ul className="space-y-2">
                    {swotData.weaknesses.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Opportunities */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <h4 className="text-blue-400">Opportunities</h4>
                  </div>
                  <ul className="space-y-2">
                    {swotData.opportunities.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Threats */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <h4 className="text-orange-400">Threats</h4>
                  </div>
                  <ul className="space-y-2">
                    {swotData.threats.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0" />
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Score & Visualization Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700/50 hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
              <h3 className="mb-6 flex items-center gap-2 text-white">
                <span className="w-2 h-2 bg-blue-600 rounded-full" />
                Startup Score
              </h3>

              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative w-full max-w-sm aspect-square mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={scoreData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {scoreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div
                        className="text-6xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
                        style={{ fontWeight: 700 }}
                      >
                        {totalScore}
                      </div>
                      <div className="text-gray-400 mt-2">Overall Score</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  {scoreData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="text-sm">
                        <div className="text-gray-200">{item.name}</div>
                        <div className="text-gray-400">{item.value}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
                  High Potential
                </Badge>
                <p className="text-sm text-gray-400 mt-3">
                  This startup shows strong market potential with innovative
                  approach. Focus on reducing execution risks for optimal success.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
