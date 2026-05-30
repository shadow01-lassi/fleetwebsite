'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TimelineContentProps {
  children?: React.ReactNode;
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLElement | null>;
  customVariants?: any;
  className?: string;
  as?: string;
  [key: string]: any;
}

export const TimelineContent: React.FC<TimelineContentProps> = ({
  children,
  animationNum = 0,
  timelineRef,
  customVariants,
  className,
  as = 'div',
  ...props
}) => {
  // Use dynamically selected element from motion dictionary
  const MotionComponent = (motion as any)[as] || motion.div;

  const defaultVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  const activeVariants = customVariants || defaultVariants;

  return (
    <MotionComponent
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={activeVariants}
      custom={animationNum}
      className={cn('', className)}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};
