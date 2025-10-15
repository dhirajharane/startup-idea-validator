'use client';
import { Sparkles } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-9 h-9">
        {/* Outer glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg blur-sm opacity-75" />
        {/* Main logo */}
        <div className="relative w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      </div>
      <span className="text-white" style={{ fontWeight: 600 }}>
        StartupInspector
      </span>
    </div>
  );
}
