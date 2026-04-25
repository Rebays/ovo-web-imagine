"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function OvoLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 1. Capture scroll progress (0 to 1) over a 400vh track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 2. Smooth out the scroll value for a "weighty" feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // 3. Update video frame on scroll
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // We use a subscription to avoid React re-renders on every pixel scrolled
    const unsubscribe = smoothProgress.on("change", (v) => {
      if (video.duration) {
        video.currentTime = v * video.duration;
      }
    });

    return () => unsubscribe();
  }, [smoothProgress]);

  // 4. Content Animations (Fade in/out based on video milestones)
  const warehouseOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);
  const oceanOpacity = useTransform(smoothProgress, [0.3, 0.4, 0.6], [0, 1, 0]);
  const finalOpacity = useTransform(smoothProgress, [0.85, 0.95], [0, 1]);

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-[#F8F9FA]">
      {/* Sticky Video Canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          src="/3D_Logistics_Animation.mp4"
          className="h-full w-full object-cover"
          muted
          playsInline
          preload="auto"
        />
        
        {/* Modern Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10 pointer-events-none" />
      </div>

      {/* Hero Section */}
      <motion.div 
        style={{ opacity: warehouseOpacity }}
        className="fixed inset-0 flex flex-col items-center justify-center p-6 text-center"
      >
        <h1 className="text-7xl font-bold tracking-tight text-[#1D1D1F]">OVO</h1>
        <p className="mt-4 text-xl text-zinc-500">Logistics, redefined for the Pacific.</p>
      </motion.div>

      {/* Mid-Journey Section */}
      <motion.div 
        style={{ opacity: oceanOpacity }}
        className="fixed inset-0 flex flex-col items-center justify-center p-6 text-center"
      >
        <h2 className="text-4xl font-medium text-[#1D1D1F]">Australia to Honiara</h2>
        <p className="mt-2 text-zinc-500 max-w-md">Seamless shipping from Australian retailers directly to your doorstep.</p>
      </motion.div>

      {/* Call to Action Section */}
      <motion.div 
        style={{ opacity: finalOpacity }}
        className="fixed inset-0 flex flex-col items-center justify-center p-6"
      >
        <div className="max-w-xl w-full p-10 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl">
          <h2 className="text-4xl font-bold text-zinc-900">Coming Soon</h2>
          <p className="mt-3 text-zinc-600">Be the first to know when we launch.</p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Email address" 
              className="flex-1 bg-white/50 border border-zinc-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500/20 transition"
            />
            <button className="bg-zinc-900 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-black transition shadow-lg">
              Get Early Access
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}