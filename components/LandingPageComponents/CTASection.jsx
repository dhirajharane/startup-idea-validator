'use client';

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function CTASection() {
  const router = useRouter();
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = [...Array(20)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600" />
      
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          {particles.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{ top: pos.top, left: pos.left }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: pos.duration,
                repeat: Infinity,
                delay: pos.delay,
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/20 mb-8">
            <Zap className="w-4 h-4 text-amber-300" />
            <span className="text-sm text-white">Start Your Journey Today</span>
          </div>

          <h2 className="text-5xl md:text-6xl text-white mb-6" style={{ fontWeight: 700 }}>
            Ready to Validate Your
            <br />
            Million-Dollar Idea?
          </h2>

          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who've turned their ideas into
            successful businesses with AI-powered insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => router.push('/login')}
              className="group bg-white text-indigo-600 hover:bg-gray-50 px-8 py-6 rounded-full transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:scale-105"
            >
              <span className="flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("#features")}
              className="px-8 py-6 rounded-full border-2 border-white text-white hover:bg-white/10 transition-all duration-300"
            >
              Explore Features
            </Button>
          </div>

          <p className="text-sm text-indigo-200 mt-8">
            No credit card required • Free analysis • Instant results
          </p>
        </motion.div>
      </div>
    </section>
  );
}