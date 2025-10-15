"use client";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Button } from "../ui/button";
import { Logo } from "./Logo";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Demo", href: "#demo" },
  { label: "Testimonials", href: "#testimonials" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer"
              onClick={() => scrollToSection("#home")}
            >
              <Logo />
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-gray-300 hover:text-white transition-all duration-300 relative group hover:scale-105"
                >
                  <span className="relative">
                    {link.label}
                    <span className="absolute -inset-2 bg-indigo-500/20 rounded-lg opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10" />
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                </button>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button
                size="sm"
                onClick={() => scrollToSection("#demo")}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full px-6 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          height: isMobileMenuOpen ? "auto" : 0,
        }}
        className="fixed top-[73px] left-0 right-0 z-40 bg-gray-900/98 backdrop-blur-lg border-b border-gray-800 md:hidden overflow-hidden"
      >
        <div className="px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="block w-full text-left text-gray-300 hover:text-white transition-colors duration-200 py-2"
            >
              {link.label}
            </button>
          ))}
          <Button
            size="sm"
            onClick={() => scrollToSection("#demo")}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full"
          >
            Get Started
          </Button>
        </div>
      </motion.div>
    </>
  );
}
