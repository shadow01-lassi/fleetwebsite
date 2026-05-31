"use client";
import React from 'react';

export function MenuToggleIcon({ open, className, duration = 300 }: { open: boolean; className?: string; duration?: number }) {
  return (
    <div className={`relative flex flex-col justify-between w-5 h-4 cursor-pointer overflow-hidden ${className}`}>
      <span
        style={{ transitionDuration: `${duration}ms` }}
        className={`w-full h-0.5 bg-current rounded-full transition-all origin-left ${
          open ? "rotate-[38deg] translate-x-[2px] translate-y-[1px]" : ""
        }`}
      />
      <span
        style={{ transitionDuration: `${duration}ms` }}
        className={`w-full h-0.5 bg-current rounded-full transition-all ${
          open ? "opacity-0 -translate-x-4" : ""
        }`}
      />
      <span
        style={{ transitionDuration: `${duration}ms` }}
        className={`w-full h-0.5 bg-current rounded-full transition-all origin-left ${
          open ? "-rotate-[38deg] translate-x-[2px] -translate-y-[1px]" : ""
        }`}
      />
    </div>
  );
}
