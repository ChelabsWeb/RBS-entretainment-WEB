"use client";

import React from 'react';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const partners = [
  { 
    id: 'disney',
    name: 'The Walt Disney Company', 
    logo: '/assets/licencias/disney/disney logo.png',
    description: 'Representación exclusiva para cine, televisión y productos de consumo.',
    photos: [
      '/assets/licencias/disney/mickey.jpg',
      '/assets/licencias/disney/avengers.jpg',
      '/assets/licencias/disney/star wars.jpg',
      '/assets/licencias/disney/spider-man.jpg',
      '/assets/licencias/disney/toy-story.jpg',
      '/assets/licencias/disney/princesses.jpg',
      '/assets/licencias/disney/cars.jpg',
      '/assets/licencias/disney/minnie.jpg',
      '/assets/licencias/disney/lion-king.jpg'
    ]
  },
  { 
    id: 'universal',
    name: 'Universal Studios', 
    logo: '/assets/licencias/universal/ChatGPT Image Feb 19, 2026, 01_23_05 PM.png',
    description: 'Distribución de los estudios más innovadores del mundo.',
    photos: [
      '/assets/licencias/universal/MN.jpg',
      '/assets/licencias/universal/JW.jpg',
      '/assets/licencias/universal/sing.jpg',
      '/assets/licencias/universal/pets.jpg',
      '/assets/licencias/universal/CE.jpg'
    ]
  },
  { 
    id: 'auf',
    name: 'Asociación Uruguaya de Fútbol', 
    logo: '/assets/licencias/AUF/AUF logo.jpg',
    description: 'Licenciamiento oficial de marcas relacionadas con la selección uruguaya.',
    photos: [
      '/assets/licencias/AUF/auf1.jpg',
      '/assets/licencias/AUF/auf2.jpg',
      '/assets/licencias/AUF/auf3.jpg'
    ]
  },
  { 
    id: 'me-humanity',
    name: 'Me! Humanity', 
    logo: '/assets/licencias/meHumanity/meHumanity logo.jpg',
    description: 'Construcción de marcas con valores y humanidad para todo el mundo.',
    photos: [
      '/assets/licencias/meHumanity/MH1.jpg',
      '/assets/licencias/meHumanity/MH2.jpg',
      '/assets/licencias/meHumanity/MH3.jpg',
      '/assets/licencias/meHumanity/MH4.jpg',
      '/assets/licencias/meHumanity/MH5.jpg'
    ]
  }
];

const LicenseSection = ({ partner, themeColor }: { partner: any, themeColor: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="space-y-12 py-16 scroll-mt-32"
    >
      {/* Header with Logo and Description */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="partner-header flex flex-col md:flex-row items-center md:items-end justify-between gap-8 pb-12 border-b border-white/5"
      >
        <div className="flex flex-col md:flex-row items-center md:items-center gap-8">
          <div className="relative w-48 h-24 md:w-56 md:h-28 overflow-hidden rounded-2xl flex items-center justify-center transition-all duration-500 hover:scale-105 group">
            <Image
              src={partner.logo}
              alt={partner.name}
              fill
              className="object-contain transition-all duration-500"
            />
          </div>
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter" style={{ color: themeColor }}>
              {partner.name}
            </h2>
            <p className="text-white/40 text-sm md:text-md uppercase tracking-widest font-bold">
              {partner.description}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Grid of Photos */}
      {partner.photos.length > 0 && (
        <div className="photos-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {partner.photos.map((src: string, index: number) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="photo-item group relative aspect-square overflow-hidden rounded-2xl bg-white/[0.02] border border-white/5 transition-all duration-500 hover:border-theme-primary hover:shadow-[0_0_25px_rgba(var(--theme-primary-rgb),0.4)]"
            >
              <Image
                src={src}
                alt={`${partner.name} image ${index}`}
                fill
                className="object-cover transition-all duration-1000 scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div 
                className="absolute inset-x-0 bottom-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${themeColor}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export const LicensesSection = () => {
  const { theme } = useTheme();

  return (
    <section className="space-y-32">
      {partners.map((partner) => (
        <LicenseSection 
          key={partner.id} 
          partner={partner} 
          themeColor={theme.primary} 
        />
      ))}
    </section>
  );
};

