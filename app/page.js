'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import InputForm from '../components/InputForm';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="min-h-screen">
      <Hero />
      {mounted && (
        <motion.section
          initial="hidden"
          animate="visible"
          variants={!shouldReduceMotion ? variants : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <InputForm />
        </motion.section>
      )}
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
