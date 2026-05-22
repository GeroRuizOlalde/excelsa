// Variantes de animación compartidas para el sitio público (framer-motion)
import type { Variants } from 'framer-motion';

export const EASE = [0.22, 0.61, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

export const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export const staggerFast: Variants = {
  visible: { transition: { staggerChildren: 0.06 } },
};
