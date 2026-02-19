"use client";

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import gsap from 'gsap';
import clsx from 'clsx';

const partners = [
  { name: 'Disney', logo: '/assets/licencias/disney/disney logo.png' },
  { name: 'Universal', logo: '/assets/licencias/universal/ChatGPT Image Feb 19, 2026, 01_23_05 PM.png' },
  { name: 'DreamWorks', logo: '/assets/Logos/dreamworks-animation-logo-black-and-white.png' },
  { name: 'Illumination', logo: '/assets/Logos/illumination logo.png' },
  { name: 'Lucasfilm', logo: '/assets/Logos/lucasfilm-logo-black-and-white.png' },
  { name: 'Marvel', logo: '/assets/Logos/marvel-logo.png' },
  { name: 'Nickelodeon', logo: '/assets/Logos/Nickelodeon_Splat_2023_Sin_Fondo.webp' },
  { name: 'Paramount', logo: '/assets/Logos/Paramount_Pictures_Corporation_logo.png' },
  { name: 'Patagonik', logo: '/assets/Logos/Patagonik_Film_Group_Logo.webp' },
  { name: 'AUF', logo: '/assets/licencias/AUF/uruguayan-football-association-auf-logo-transparent-background-free-png.webp' },
  { name: 'Me! Humanity', logo: '/assets/licencias/meHumanity/ChatGPT Image Feb 19, 2026, 03_58_30 PM.png' }
];

export function PartnerMarquee() {
  const { theme } = useTheme();
  const marqueeRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!marqueeRef.current) return;

    const marquee = marqueeRef.current;
    const content = marquee.firstChild as HTMLElement;
    const contentWidth = content.offsetWidth;
    
    // Create infinite animation
    gsap.to(content, {
      x: `-${contentWidth / 2}px`,
      duration: 30,
      ease: "none",
      repeat: -1,
    });
  }, []);

  return (
    <section className="py-24 overflow-hidden bg-black border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col items-center justify-center text-center">
        <h2 className="text-sm font-black uppercase tracking-[0.5em] text-white/20 mb-4"> NUESTRAS LICENCIAS Y CINE </h2>
        <div className="h-[2px] w-24" style={{ backgroundColor: theme.primary }} />
      </div>
      
      <div className="relative flex whitespace-nowrap" ref={marqueeRef}>
        <div className="flex items-center gap-16 md:gap-32 pr-16 md:pr-32">
            {/* Double the array for seamless loop */}
            {[...partners, ...partners].map((partner, index) => {
              let logoSizeClass = "w-32 h-16 md:w-48 md:h-24";
              
              if (['Universal', 'Lucasfilm', 'Marvel'].includes(partner.name)) {
                logoSizeClass = "w-56 h-28 md:w-80 md:h-40 translate-y-2 md:translate-y-4";
              } else if (['Paramount', 'AUF'].includes(partner.name)) {
                logoSizeClass = "w-64 h-32 md:w-[28rem] md:h-56 translate-y-1 md:translate-y-2";
              } else if (partner.name === 'Nickelodeon') {
                logoSizeClass = "w-48 h-24 md:w-64 md:h-32";
              }

              return (
                <div 
                  key={`${partner.name}-${index}`} 
                  className={clsx(
                    "relative grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer flex-shrink-0",
                    logoSizeClass
                  )}
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain"
                  />
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
