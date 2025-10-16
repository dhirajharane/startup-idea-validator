"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = {
  marketPotential: "#3B82F6", // Blue
  feasibility: "#EC4899", // Magenta
  competition: "#F59E0B", // Orange
  monetization: "#10B981", // Green
  innovation: "#A855F7", // Purple
};

const LABELS = {
  marketPotential: "Market Potential",
  feasibility: "Feasibility",
  competition: "Competition",
  monetization: "Monetization",
  innovation: "Innovation",
};

export function ScoreChart({ score, pieChartData }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [hoveredSegment, setHoveredSegment] = useState(null);

  useEffect(() => {
    const duration = 1500;
    const steps = 50;
    const increment = score / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep === steps) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(increment * currentStep));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [score]);

  const chartData = Object.entries(pieChartData).map(([key, value]) => ({
    name: key,
    value: value,
  }));

  return (
    <div className="grid lg:grid-cols-[1fr,300px] gap-8 items-center">
      {/* Chart */}
      <div className="relative h-[400px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={100}
              outerRadius={160}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={1000}
              onMouseEnter={(_, index) => setHoveredSegment(chartData[index].name)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name]}
                  opacity={hoveredSegment === null || hoveredSegment === entry.name ? 1 : 0.5}
                  className="transition-opacity duration-300 cursor-pointer"
                  style={{
                    filter: hoveredSegment === entry.name ? "brightness(1.2)" : "none",
                    transform: hoveredSegment === entry.name ? "scale(1.05)" : "scale(1)",
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Score */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <motion.div
              className="text-white mb-2"
              style={{ fontSize: "72px", fontWeight: 700, lineHeight: 1 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {animatedScore}
            </motion.div>
            <div className="text-gray-400" style={{ fontSize: "16px", fontWeight: 500 }}>
              Overall Score
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-4">
        {Object.entries(pieChartData).map(([key, value]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            onMouseEnter={() => setHoveredSegment(key)}
            onMouseLeave={() => setHoveredSegment(null)}
            className={`flex items-center justify-between p-4 rounded-lg border border-gray-800 transition-all duration-300 cursor-pointer ${
              hoveredSegment === key
                ? "bg-gray-800/50 border-gray-700 scale-105"
                : "bg-gray-900/30 hover:bg-gray-800/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: COLORS[key] }}
              />
              <span className="text-white" style={{ fontSize: "14px", fontWeight: 500 }}>
                {LABELS[key]}
              </span>
            </div>
            <span className="text-gray-400" style={{ fontSize: "18px", fontWeight: 700 }}>
              {value}%
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}