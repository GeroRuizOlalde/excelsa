"use client";

import { motion } from 'framer-motion';
import ContourBg from './ContourBg';
import { fadeUp, stagger } from '@/lib/motion';

export default function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="texture-grain relative overflow-hidden bg-excelsa-cream pb-16 pt-32 lg:pb-20 lg:pt-40">
      <ContourBg tone="cream" />
      <div className="pointer-events-none absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full bg-excelsa-claysoft/35 blur-[120px]" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl space-y-5">
          <motion.span variants={fadeUp} className="text-[11px] font-bold uppercase tracking-[0.28em] text-excelsa-clay">
            {eyebrow}
          </motion.span>
          <motion.h1
            variants={fadeUp}
            className="font-display text-[2.7rem] font-medium leading-[1.02] tracking-[-0.02em] text-excelsa-navy sm:text-6xl lg:text-[4.2rem]"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p variants={fadeUp} className="max-w-xl text-lg leading-relaxed text-excelsa-ink/65">
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
