"use client";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Star } from "lucide-react";

const testimonialsRow1 = [
  {
    name: "Sarah Chen",
    role: "Founder, TechFlow",
    avatar: "SC",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    content:
      "StartupInspector gave me insights I never would have discovered on my own. The SWOT analysis was incredibly detailed.",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "CEO, CloudSync",
    avatar: "MR",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    content:
      "The competitor analysis feature is a game-changer. We identified market gaps we didn't know existed.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Co-founder, HealthHub",
    avatar: "EW",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    content:
      "Within 30 seconds, I had a comprehensive analysis that would have taken weeks of research.",
    rating: 5,
  },
  {
    name: "David Park",
    role: "CEO, DataFlow",
    avatar: "DP",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    content:
      "The pitch deck outline saved us countless hours. We secured our seed round using insights directly from StartupInspector.",
    rating: 5,
  },
];

const testimonialsRow2 = [
  {
    name: "Jessica Martinez",
    role: "Founder, EcoTech",
    avatar: "JM",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop",
    content:
      "Market trend analysis helped us spot opportunities before our competitors. We launched at the perfect time.",
    rating: 5,
  },
  {
    name: "Alex Thompson",
    role: "Co-founder, FinFlow",
    avatar: "AT",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    content:
      "The startup score gave us confidence to move forward. Investors were impressed with the data-driven approach.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "CEO, MediCare AI",
    avatar: "PS",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
    content:
      "Actionable insights were spot-on. We implemented 90% of the recommendations and saw immediate improvements.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Founder, EdTech Pro",
    avatar: "JW",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
    content:
      "Best investment for any startup founder. The comprehensive analysis gave us clarity and direction.",
    rating: 5,
  },
];

function TestimonialCard({ testimonial }) {
  return (
    <Card className="p-5 min-w-[280px] max-w-[280px] bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-indigo-500/30 transition-all duration-300 flex-shrink-0">
      <div className="flex gap-1 mb-3">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
        {testimonial.content}
      </p>
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10 border-2 border-indigo-500/30">
          <AvatarImage src={testimonial.image} alt={testimonial.name} />
          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm">
            {testimonial.avatar}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="text-white text-sm">{testimonial.name}</div>
          <div className="text-xs text-gray-400">{testimonial.role}</div>
        </div>
      </div>
    </Card>
  );
}

export function Testimonials() {
  const cardWidth = 288; // 280 + gap approx
  const totalWidth1 = testimonialsRow1.length * cardWidth;
  const totalWidth2 = testimonialsRow2.length * cardWidth;

  return (
    <section
      id="testimonials"
      className="py-24 bg-gray-900 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2
            className="text-5xl md:text-6xl mb-8 leading-tight md:leading-snug bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
            style={{ fontWeight: 700 }}
          >
            Loved by Founders
          </h2>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            See what successful entrepreneurs say about StartupInspector
          </p>
        </motion.div>
      </div>

      {/** Scrolling rows **/}
      {[
        { row: testimonialsRow1, dir: 1, width: totalWidth1 },
        { row: testimonialsRow2, dir: -1, width: totalWidth2 },
      ].map((item, idx) => (
        <div key={idx} className="relative mb-6">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-900 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-900 to-transparent z-10" />

          <motion.div
            className="flex gap-4"
            animate={{ x: [0, item.dir * -item.width] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              },
            }}
          >
            {[...item.row, ...item.row].map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </motion.div>
        </div>
      ))}
    </section>
  );
}
