"use client";

import Image from "next/image";
import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  useTime,
} from "framer-motion";

interface SwingingLogoProps {
  showIcon?: boolean;
  className?: string;
}

export function SwingingLogo({
  showIcon = true,
  className,
}: SwingingLogoProps) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const time = useTime();

  // Smoothing the velocity to get a cleaner "intensity" value
  const smoothVelocity = useSpring(scrollVelocity, {
    stiffness: 100,
    damping: 30,
  });

  // Calculate "amplitude" based on absolute velocity
  // We want it to build up with movement and decay naturally
  const amplitude = useTransform(smoothVelocity, (v) => {
    return Math.min(Math.abs(v) / 75, 45); // Max 45 degrees swing, more sensitive (/75)
  });

  // Smooth the amplitude for natural decay
  const smoothAmplitude = useSpring(amplitude, {
    stiffness: 40,
    damping: 15,
    mass: 0.5,
  });

  // Create the oscillation using a sine wave
  const rotation = useTransform(time, (t: number) => {
    return Math.sin(t / 250) * (smoothAmplitude.get() as number);
  });

  return (
    <div className={`relative flex flex-col items-center group ${className}`}>
      {/* Text Logo */}
      <span className="font-display text-2xl font-bold bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent relative z-10 transition-transform duration-300 group-hover:scale-105">
        Imagify
      </span>

      {/* Swinging Hanger Icon (Absolute Positioning to overflow) */}
      {showIcon && (
        <div className="flex absolute top-[20%] left-1/2 -translate-x-1/2 w-24 h-24 origin-top justify-center z-0 pointer-events-none">
          <motion.div
            style={{ rotate: rotation }}
            className="relative w-full h-full flex items-center justify-center"
          >
            <Image
              src="/down_logo.png"
              alt="Hanger"
              width={66}
              height={66}
              className="object-contain drop-shadow-[0_0_15px_rgba(124,58,237,0.3)]"
              priority
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
