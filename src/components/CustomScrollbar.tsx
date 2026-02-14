"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CustomScrollbar() {
  const { scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[4px] z-[9999] pointer-events-none bg-white/5">
      <motion.div
        className="w-full bg-theme-primary origin-top h-full"
        style={{ scaleY }}
      />
      
      {/* Glow effect */}
      <motion.div
        className="absolute top-0 right-0 w-full h-full bg-theme-primary blur-[4px] opacity-30 origin-top"
        style={{ scaleY }}
      />
    </div>
  );
}
