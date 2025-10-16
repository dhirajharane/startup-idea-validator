"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";

export function MarketTrends({ trendSummary, trends }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(trends.length - 1, prev + 1));
  };

  const scrollToCard = (index) => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.scrollWidth / trends.length;
      scrollContainerRef.current.scrollTo({
        left: cardWidth * index,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = scrollContainerRef.current.scrollWidth / trends.length;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(newIndex);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-cyan-400" strokeWidth={2} />
        </div>
        <h3 className="text-white">Market Trends</h3>
      </div>

      <p className="text-gray-400 mb-8" style={{ fontSize: "16px", lineHeight: 1.6 }}>
        {trendSummary}
      </p>

      {/* Carousel */}
      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={() => {
            handlePrevious();
            scrollToCard(Math.max(0, currentIndex - 1));
          }}
          disabled={currentIndex === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-indigo-500 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed -translate-x-1/2"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2} />
        </button>

        <button
          onClick={() => {
            handleNext();
            scrollToCard(Math.min(trends.length - 1, currentIndex + 1));
          }}
          disabled={currentIndex === trends.length - 1}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-indigo-500 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed translate-x-1/2"
        >
          <ChevronRight className="w-5 h-5" strokeWidth={2} />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 py-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {trends.map((trend, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                opacity: Math.abs(currentIndex - index) === 0 ? 1 : 0.6,
                transform: Math.abs(currentIndex - index) === 0 ? "scale(1)" : "scale(0.95)",
                transition: "all 0.3s ease-out",
              }}
            >
              <div className="h-full bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
                <h4 className="text-white mb-3" style={{ fontWeight: 600 }}>
                  {trend.title}
                </h4>
                <p className="text-gray-400" style={{ fontSize: "14px", lineHeight: 1.6 }}>
                  {trend.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {trends.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                scrollToCard(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-indigo-500"
                  : "w-2 bg-gray-700 hover:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.div>
  );
}