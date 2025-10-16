"use client";
import { FileText, Download, Gem, Bookmark } from "lucide-react";
import { useEffect, useState } from "react";

function AnimatedCounter({ target }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1000; // 1 second
    const steps = 30;
    const increment = target / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep === steps) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(increment * currentStep));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}</span>;
}

export function QuickStats({
  numberOfIdeasAnalysed,
  noOfDownloadedReports,
  creditsLeft,
  numberOfSavedReports,
}) {
  const stats = [
    {
      icon: FileText,
      metric: numberOfIdeasAnalysed,
      label: "Ideas Analyzed",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Download,
      metric: noOfDownloadedReports,
      label: "Reports Downloaded",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Gem,
      metric: creditsLeft,
      label: "Credits Remaining",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Bookmark,
      metric: numberOfSavedReports,
      label: "Saved Reports",
      color: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <div
            key={stat.label}
            className="relative bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 group cursor-pointer overflow-hidden"
            style={{
              animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
            }}
          >
            {/* Hover glow on top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
              style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
              className={`bg-gradient-to-r ${stat.color}`} 
            />
            
            {/* Icon container */}
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-10 mb-4`}>
              <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>

            {/* Metric */}
            <div className="mb-1 text-white" style={{ fontSize: "32px", fontWeight: 700 }}>
              <AnimatedCounter target={stat.metric} />
            </div>

            {/* Label */}
            <div className="text-gray-400" style={{ fontSize: "14px", fontWeight: 500 }}>
              {stat.label}
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}