'use client';

import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextProps {
  children: React.ReactNode;
  reverse?: boolean;
  transition?: any;
  splitBy?: 'words' | 'characters' | 'lines';
  staggerDuration?: number;
  staggerFrom?: 'first' | 'last' | 'center';
  containerClassName?: string;
  wordLevelClassName?: string;
  elementLevelClassName?: string;
}

export interface VerticalCutRevealRef {
  startAnimation: () => void;
  reset: () => void;
}

export const VerticalCutReveal = forwardRef<VerticalCutRevealRef, TextProps>(
  (
    {
      children,
      reverse = false,
      transition = {
        type: 'spring',
        stiffness: 200,
        damping: 30,
      },
      splitBy = 'words',
      staggerDuration = 0.05,
      staggerFrom = 'first',
      containerClassName,
      wordLevelClassName,
      elementLevelClassName,
    },
    ref
  ) => {
    const text = typeof children === 'string' ? children : children?.toString() || '';
    const [isAnimating, setIsAnimating] = useState(true);

    useImperativeHandle(ref, () => ({
      startAnimation: () => setIsAnimating(true),
      reset: () => setIsAnimating(false),
    }));

    const elements = useMemo(() => {
      if (splitBy === 'characters') {
        return Array.from(text);
      }
      if (splitBy === 'lines') {
        return text.split('\n');
      }
      return text.split(' ');
    }, [text, splitBy]);

    const getDelay = (index: number) => {
      if (staggerFrom === 'last') {
        return (elements.length - 1 - index) * staggerDuration;
      }
      if (staggerFrom === 'center') {
        const center = Math.floor(elements.length / 2);
        return Math.abs(center - index) * staggerDuration;
      }
      return index * staggerDuration;
    };

    const variants = {
      hidden: { y: reverse ? '-105%' : '105%' },
      visible: (i: number) => ({
        y: 0,
        transition: {
          ...transition,
          delay: getDelay(i),
        },
      }),
    };

    return (
      <span className={cn('flex flex-wrap overflow-hidden', containerClassName)}>
        <span className="sr-only">{text}</span>
        {elements.map((el, i) => (
          <span
            key={i}
            className={cn(
              'inline-block overflow-hidden relative',
              splitBy === 'words' ? 'mr-[0.25em]' : '',
              wordLevelClassName
            )}
          >
            <motion.span
              custom={i}
              initial="hidden"
              animate={isAnimating ? 'visible' : 'hidden'}
              variants={variants}
              className={cn('inline-block', elementLevelClassName)}
            >
              {el === ' ' ? '\u00A0' : el}
            </motion.span>
          </span>
        ))}
      </span>
    );
  }
);

VerticalCutReveal.displayName = 'VerticalCutReveal';
