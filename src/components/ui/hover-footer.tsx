'use client';

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Mail, Phone, MapPin, Globe, Heart } from "lucide-react";

// Robust SVG fallbacks for brand icons to guarantee compilation success
const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);

const TwitterIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const LinkedinIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
);

export const TextHoverEffect = ({
  text,
  duration,
  className,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn("select-none uppercase cursor-pointer w-full", className)}
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#0d9488" />
              <stop offset="25%" stopColor="#14b8a6" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="75%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#06b6d4" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-slate-800 font-[helvetica] text-[40px] font-black"
        style={{ opacity: hovered ? 0.7 : 0.15 }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-teal-500 font-[helvetica] text-[40px] font-black"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.3"
        mask="url(#textMask)"
        className="fill-transparent font-[helvetica] text-[40px] font-black"
      >
        {text}
      </text>
    </svg>
  );
};

export const FooterBackgroundGradient = () => {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 100%, rgba(13, 148, 136, 0.08) 0%, rgba(7, 10, 19, 0.95) 80%)",
      }}
    />
  );
};

export default function HoverFooter() {
  // Footer link data aligned with Fleetly
  const footerLinks = [
    {
      title: "Solutions",
      links: [
        { label: "Live Coordinates", href: "#" },
        { label: "Hardware Signals", href: "#" },
        { label: "Ignition Locks", href: "#" },
        { label: "Audit Pipelines", href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Telemetry Docs", href: "#" },
        { label: "Driver Helpdesk", href: "#" },
        {
          label: "Simulator Status",
          href: "#",
          pulse: true,
        },
      ],
    },
  ];

  // Contact info data
  const contactInfo = [
    {
      icon: <Mail size={16} className="text-teal-400" />,
      text: "support@fleetly.com",
      href: "mailto:support@fleetly.com",
    },
    {
      icon: <Phone size={16} className="text-teal-400" />,
      text: "+91 99999 99999",
      href: "tel:+919999999999",
    },
    {
      icon: <MapPin size={16} className="text-teal-400" />,
      text: "Delhi NCR, India",
    },
  ];

  // Social media icons
  const socialLinks = [
    { icon: <FacebookIcon size={18} />, label: "Facebook", href: "#" },
    { icon: <InstagramIcon size={18} />, label: "Instagram", href: "#" },
    { icon: <TwitterIcon size={18} />, label: "Twitter", href: "#" },
    { icon: <LinkedinIcon size={18} />, label: "Linkedin", href: "#" },
    { icon: <Globe size={18} />, label: "Globe", href: "#" },
  ];

  return (
    <footer className="relative bg-[#040712] border-t border-slate-900 overflow-hidden py-16 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12">
          {/* Brand section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-teal-400 text-2xl font-black">
                ▲
              </span>
              <span className="text-white text-2xl font-bold uppercase tracking-wider">Fleetly</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Modern vehicle rental and high-fidelity real-time GPS telemetry hardware tracking console.
            </p>
          </div>

          {/* Footer link sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">
                {section.title}
              </h4>
              <ul className="space-y-3.5 text-xs font-semibold text-slate-400">
                {section.links.map((link) => (
                  <li key={link.label} className="relative w-fit">
                    <a
                      href={link.href}
                      className="hover:text-teal-400 transition-colors"
                    >
                      {link.label}
                    </a>
                    {link.pulse && (
                      <span className="absolute top-1 -right-3 w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact section */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">
              Contact Operations
            </h4>
            <ul className="space-y-4 text-xs font-semibold text-slate-400">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center space-x-3">
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="hover:text-teal-400 transition-colors"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="hover:text-teal-400 transition-colors">
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-t border-slate-900 my-8" />

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-semibold space-y-4 md:space-y-0">
          {/* Social icons */}
          <div className="flex space-x-6 text-slate-500">
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="hover:text-teal-400 transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-center md:text-left flex items-center gap-1">
            <span>&copy; {new Date().getFullYear()} Fleetly Inc. Made with</span>
            <Heart size={10} className="text-red-500 animate-pulse fill-red-500" />
            <span>for logistics operators.</span>
          </p>
        </div>
      </div>

      {/* Large SVG Text Hover effect at bottom */}
      <div className="lg:flex hidden h-[22rem] -mt-24 -mb-28 justify-center select-none pointer-events-auto">
        <TextHoverEffect text="Fleetly" className="z-10" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}
