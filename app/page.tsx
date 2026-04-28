"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 backdrop-blur-md bg-black/20 border-b border-white/10 text-white transition-all">
      <div className="text-3xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">OVO</div>
      <nav className="hidden md:flex gap-10 font-medium text-sm tracking-wide">
        <a href="#how-it-works" className="hover:text-blue-400 transition-colors">How it Works</a>
      </nav>
      <a href="#cta" className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)] inline-block">
        Join Waitlist
      </a>
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative bg-[#050505] text-white py-16 px-8 md:px-12 z-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8 text-center md:text-left">
        <div className="max-w-sm">
          <div className="text-4xl font-extrabold tracking-tighter">OVO</div>
          <p className="text-zinc-500 mt-4 leading-relaxed text-sm">
            Logistics, redefined for the Pacific. Fast, reliable, and transparent shipping from Australia to Honiara.
          </p>
        </div>
        <div className="flex gap-8 text-sm font-medium text-zinc-400">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex justify-center md:justify-start items-center text-zinc-600 text-xs">
        <div>&copy; {new Date().getFullYear()} OVO Logistics. All rights reserved.</div>
      </div>
    </footer>
  );
}

export default function OvoLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1000);
  };

  // 1. Capture scroll progress (0 to 1) over a 500vh track inside the scroll container
  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: sectionRef,
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

    const setInitialFrame = () => {
      video.pause();
      if (video.readyState >= 1 && video.currentTime < 0.1) {
        video.currentTime = 0.01;
      }
    };

    setInitialFrame();
    video.addEventListener('loadedmetadata', setInitialFrame);

    let animationFrameId: number;
    let isSeeking = false;

    // WebM performance optimization: Prevent seeking while a seek is already in progress,
    // and debounce the requestAnimationFrame to prevent call stacking.
    const handleSeeked = () => { isSeeking = false; };
    video.addEventListener('seeked', handleSeeked);

    const unsubscribe = smoothProgress.on("change", (v) => {
      // Ensure duration is finite (WebM files sometimes have Infinity duration initially)
      if (video.duration && Number.isFinite(video.duration)) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        
        animationFrameId = requestAnimationFrame(() => {
          if (!isSeeking) {
            isSeeking = true;
            video.currentTime = v * video.duration;
          }
        });
      }
    });

    return () => {
      unsubscribe();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      video.removeEventListener('loadedmetadata', setInitialFrame);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [smoothProgress]);

  // 4. Content Animations perfectly aligned to 5 snap points: 0, 0.25, 0.5, 0.75, 1.0

  // Section 1: Hero (Progress 0)
  const warehouseOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);
  const warehouseY = useTransform(smoothProgress, [0, 0.12], [0, -50]);

  // Section 2: How it Works (Progress 0.25)
  const howOpacity = useTransform(smoothProgress, [0.15, 0.25, 0.35], [0, 1, 0]);
  const howX = useTransform(smoothProgress, [0.15, 0.25, 0.35], [100, 0, -50]);

  // Section 3: App Features (Progress 0.5)
  const oceanOpacity = useTransform(smoothProgress, [0.4, 0.5, 0.6], [0, 1, 0]);
  const oceanX = useTransform(smoothProgress, [0.4, 0.5, 0.6], [-100, 0, 50]);

  // Section 4: Pacific Reach (Progress 0.75)
  const pacificOpacity = useTransform(smoothProgress, [0.65, 0.75, 0.85], [0, 1, 0]);
  const pacificX = useTransform(smoothProgress, [0.65, 0.75, 0.85], [100, 0, -50]);

  // Section 5: CTA (Progress 1.0)
  const finalOpacity = useTransform(smoothProgress, [0.9, 1], [0, 1]);
  const finalY = useTransform(smoothProgress, [0.9, 1], [50, 0]);

  return (
    <main
      ref={containerRef}
      className="bg-black text-white selection:bg-blue-500/30 h-[100dvh] w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth"
    >
      <Header />

      <div ref={sectionRef} className="relative h-[500dvh]">
        {/* Sticky Video Canvas & Content Layers */}
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
          <video
            ref={videoRef}
            src="/output.webm"
            className="absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            preload="auto"
            autoPlay
          />

          {/* Premium Dynamic Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-transparent to-blue-900/40 mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent pointer-events-none" />

          {/* Section 1: Hero */}
          <motion.div
            style={{ opacity: warehouseOpacity, y: warehouseY }}
            className="absolute inset-0 flex flex-col items-start justify-center p-8 md:p-16 lg:p-24 text-left z-10 pointer-events-none"
          >
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="pointer-events-auto mt-20 flex flex-col items-start max-w-2xl"
            >
              <div className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 text-xs font-medium tracking-widest text-zinc-300 uppercase">
                Coming Soon
              </div>
              <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500 mb-6 pb-2">
                The OVO App.
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 max-w-xl font-light leading-relaxed mb-10">
                Your ultimate logistics companion. Track packages, manage shipments, and stay updated from anywhere.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-start items-stretch sm:items-center w-full sm:w-auto">
                <a href="#cta" className="w-full sm:w-auto bg-white text-black px-8 py-3.5 rounded-full text-sm font-medium transition-transform hover:scale-105 active:scale-95 text-center inline-block">
                  Join Waitlist
                </a>

              </div>
            </motion.div>
          </motion.div>

          {/* Section 2: How it Works */}
          <motion.div
            style={{ opacity: howOpacity, x: howX }}
            className="absolute inset-0 flex flex-col items-end justify-center p-8 md:p-16 lg:p-24 z-10 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-xl text-left pl-8 border-l border-white/10">
              <div className="text-emerald-400 font-semibold text-sm tracking-widest uppercase mb-4">
                How it Works
              </div>
              <h2 className="text-4xl md:text-5xl font-medium text-white tracking-tight leading-tight mb-6">
                Simple, Fast, and <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Transparent</span>
              </h2>
              <p className="text-lg text-zinc-400 font-light leading-relaxed mb-12">
                We've streamlined the logistics process so you don't have to worry about a thing.
              </p>
              <div className="flex flex-col gap-8">
                <div className="flex items-start gap-6">
                  <div className="text-emerald-400/80 text-xl font-light shrink-0 pt-0.5">01</div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">Book Your Shipment</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">Enter your details in the OVO app and get an instant quote.</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="text-teal-400/80 text-xl font-light shrink-0 pt-0.5">02</div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">We Collect & Ship</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">Our team handles the pickup and secure transport across the Pacific.</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="text-blue-400/80 text-xl font-light shrink-0 pt-0.5">03</div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">You Receive</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">Track every step and receive your goods safely in Honiara.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 3: App Features Section */}
          <motion.div
            style={{ opacity: oceanOpacity, x: oceanX }}
            className="absolute inset-0 flex flex-col items-start justify-center p-8 md:p-16 lg:p-24 z-10 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-xl text-left border-l border-white/10 pl-8">
              <div className="text-emerald-400 font-semibold text-sm tracking-widest uppercase mb-4">
                App Features
              </div>
              <h2 className="text-4xl md:text-5xl font-medium text-white tracking-tight leading-tight mb-6">
                Logistics in the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Palm of your Hand</span>
              </h2>
              <p className="text-lg text-zinc-400 font-light leading-relaxed mb-12">
                Manage your entire shipping experience from our powerful new mobile application. Everything you need, right when you need it.
              </p>
              <div className="flex flex-col gap-8">
                <div className="flex items-start gap-6">
                  <div className="text-emerald-400/80 text-xl font-light shrink-0 pt-0.5">01</div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">Real-time Tracking</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">Watch your packages move in real-time with push notifications at every major milestone.</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="text-teal-400/80 text-xl font-light shrink-0 pt-0.5">02</div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">Easy Payments</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">Pay for your shipping securely and instantly right from within the OVO app.</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="text-blue-400/80 text-xl font-light shrink-0 pt-0.5">03</div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">Instant Support</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">Connect with our support team instantly through the app for any questions or assistance.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 4: Pacific Reach Section */}
          <motion.div
            style={{ opacity: pacificOpacity, x: pacificX }}
            className="absolute inset-0 flex flex-col items-end justify-center p-8 md:p-16 lg:p-24 z-10 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-xl text-left border-l border-white/10 pl-8">
              <div className="text-blue-400 font-semibold text-sm tracking-widest uppercase mb-4">
                Global Network
              </div>
              <h2 className="text-4xl md:text-5xl font-medium text-white tracking-tight leading-tight mb-6">
                Bridging the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Pacific Divide</span>
              </h2>
              <p className="text-lg text-zinc-400 font-light leading-relaxed mb-10">
                Seamlessly connect your business from Australia to Honiara. We handle the complexity so you can focus on what matters.
              </p>
              <div className="flex flex-col gap-6">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 w-full max-w-sm flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-medium">Direct Routes</div>
                    <div className="text-zinc-400 text-sm">Faster transit times</div>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 w-full max-w-sm flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-medium">Fully Secured</div>
                    <div className="text-zinc-400 text-sm">End-to-end protection</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 5: Call to Action Section */}
          <motion.div
            style={{ opacity: finalOpacity, y: finalY }}
            className="absolute inset-0 flex flex-col items-start justify-center p-8 md:p-16 lg:p-24 z-10 pointer-events-none"
          >
            <div className="pointer-events-auto max-w-2xl text-left">
              <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500 tracking-tight pb-2">Be the first to know.</h2>
              <p className="mt-6 text-xl text-zinc-300 max-w-lg font-light">
                Join our exclusive waitlist to be notified the moment the OVO app launches on <strong className="text-white">iOS and Android</strong>.
              </p>

              {status === "success" ? (
                <div className="mt-10 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl max-w-lg">
                  <h3 className="text-xl font-medium text-emerald-400 mb-2">You're on the list!</h3>
                  <p className="text-emerald-100/70">We'll let you know as soon as we're ready. Keep an eye on your inbox.</p>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSubmit} className="mt-10 flex flex-col sm:flex-row gap-4 max-w-lg">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email address"
                      className="flex-1 bg-black/40 border border-white/20 text-white placeholder-zinc-500 rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all focus:bg-black/60"
                      disabled={status === "submitting"}
                    />
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-zinc-200 transition-all shadow-lg whitespace-nowrap hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {status === "submitting" ? "Joining..." : "Get Early Access"}
                    </button>
                  </form>
                  <p className="mt-5 text-sm text-zinc-500 font-medium">No spam. Unsubscribe at any time.</p>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Snap Points Overlay */}
        <div className="absolute top-0 left-0 w-full h-full flex flex-col pointer-events-none z-0">
          <div id="hero" className="h-[100dvh] w-full snap-start snap-always" />
          <div id="how-it-works" className="h-[100dvh] w-full snap-start snap-always" />
          <div id="app-features" className="h-[100dvh] w-full snap-start snap-always" />
          <div id="pacific-reach" className="h-[100dvh] w-full snap-start snap-always" />
          <div id="cta" className="h-[100dvh] w-full snap-start snap-always" />
        </div>
      </div>

      <div className="snap-start w-full relative z-20">
        <Footer />
      </div>
    </main>
  );
}