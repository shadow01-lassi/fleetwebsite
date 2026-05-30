'use client';

import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles as SparklesComp } from "@/components/ui/sparkles";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Rider Basic",
    description: "Ideal for individual drivers and freelancers seeking standard daily vehicle rentals.",
    price: 999,
    yearlyPrice: 24999,
    buttonText: "Lease a Node",
    buttonVariant: "outline" as const,
    includes: [
      "Lease privileges:",
      "Single active vehicle link",
      "Full digital speedometer",
      "Real-time battery sync logs",
      "2-factor auth keys",
    ],
  },
  {
    name: "Fleet Pro",
    description: "Optimized for transport agencies and commercial delivery teams with real-time operations.",
    price: 4999,
    yearlyPrice: 119999,
    buttonText: "Register Fleet",
    buttonVariant: "default" as const,
    popular: true,
    includes: [
      "Everything in Basic, plus:",
      "Multi-node active map tracking",
      "Emergency ignition locks",
      "Automated inspection checklist approvals",
      "Priority driver gate verification",
    ],
  },
  {
    name: "Logistics Max",
    description: "Enterprise tier with API telemetry hooks, complete lock overrides, and dedicated nodes.",
    price: 9999,
    yearlyPrice: 249999,
    buttonText: "Deploy Enterprise",
    buttonVariant: "outline" as const,
    includes: [
      "Everything in Fleet Pro, plus:",
      "Complete REST API webhooks",
      "Dedicated GPS tracking channels",
      "Unlimited custom vehicle uploads",
      "24/7 custom operations specialist support",
    ],
  },
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center">
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-slate-950 border border-slate-800 p-1.5 shadow-2xl backdrop-blur-md">
        <button
          onClick={() => handleSwitch("0")}
          className={cn(
            "relative z-10 w-fit h-10 rounded-full sm:px-6 px-4 py-2 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer",
            selected === "0" ? "text-white" : "text-slate-400 hover:text-white",
          )}
        >
          {selected === "0" && (
            <motion.span
              layoutId="pricing-switch"
              className="absolute inset-0 h-10 w-full rounded-full bg-gradient-to-r from-teal-500 to-indigo-600 shadow-md shadow-teal-500/20"
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
            />
          )}
          <span className="relative z-20">Monthly Plan</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={cn(
            "relative z-10 w-fit h-10 rounded-full sm:px-6 px-4 py-2 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer",
            selected === "1" ? "text-white" : "text-slate-400 hover:text-white",
          )}
        >
          {selected === "1" && (
            <motion.span
              layoutId="pricing-switch"
              className="absolute inset-0 h-10 w-full rounded-full bg-gradient-to-r from-teal-500 to-indigo-600 shadow-md shadow-teal-500/20"
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
            />
          )}
          <span className="relative z-20">Yearly Lease</span>
        </button>
      </div>
    </div>
  );
};

export default function PricingSection4() {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.25,
        duration: 0.5,
        ease: 'easeOut'
      },
    }),
    hidden: {
      filter: "blur(8px)",
      y: -20,
      opacity: 0,
    },
  };

  const togglePricingPeriod = (value: string) => {
    setIsYearly(Number.parseInt(value) === 1);
  };

  return (
    <div
      className="min-h-screen py-24 mx-auto relative bg-[#070a13] overflow-hidden border-t border-slate-900"
      ref={pricingRef}
    >
      <TimelineContent
        animationNum={4}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute top-0 left-0 right-0 h-96 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] pointer-events-none"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415515_1px,transparent_1px),linear-gradient(to_bottom,#33415515_1px,transparent_1px)] bg-[size:60px_60px] " />
        <SparklesComp
          density={1200}
          direction="bottom"
          speed={0.8}
          color="#0d9488"
          className="absolute inset-0 h-full w-full opacity-60"
        />
      </TimelineContent>

      <TimelineContent
        animationNum={5}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute left-0 top-[-100px] w-full h-[100vh] flex flex-col items-center justify-start overflow-hidden pointer-events-none z-0 opacity-40"
      >
        <div className="absolute left-[-20%] right-[-20%] top-0 h-[800px] rounded-full border-[120px] border-indigo-600/30 blur-[100px] pointer-events-none" />
      </TimelineContent>

      <article className="text-center mb-16 max-w-3xl mx-auto space-y-4 relative z-10 px-4">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none uppercase">
          <VerticalCutReveal
            splitBy="words"
            staggerDuration={0.1}
            staggerFrom="first"
            reverse={true}
            containerClassName="justify-center"
          >
            Flexible Subscription Fleet Plans
          </VerticalCutReveal>
        </h2>

        <TimelineContent
          as="p"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto font-medium"
        >
          Scale your remote node links instantly. Switch plans easily as you connect more active telemetry channels.
        </TimelineContent>

        <TimelineContent
          as="div"
          animationNum={1}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="pt-2"
        >
          <PricingSwitch onSwitch={togglePricingPeriod} />
        </TimelineContent>
      </article>

      {/* Plans display grid */}
      <div className="grid md:grid-cols-3 max-w-6xl gap-8 px-6 py-6 mx-auto relative z-10">
        {plans.map((plan, index) => (
          <TimelineContent
            key={plan.name}
            as="div"
            animationNum={2 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="flex h-full"
          >
            <Card
              className={cn(
                "relative text-white border-white/5 flex flex-col justify-between w-full rounded-2xl overflow-hidden glass-card shadow-2xl",
                plan.popular 
                  ? "bg-gradient-to-b from-slate-900/90 via-[#0a0f24]/90 to-slate-900/90 border-teal-500/30 shadow-indigo-900/20 scale-[1.03] md:-translate-y-1" 
                  : "bg-slate-950/40"
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-teal-400 to-indigo-500 text-black text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl shadow-lg">
                  Most Popular
                </div>
              )}

              <CardHeader className="text-left p-6 sm:p-8 flex-none">
                <h3 className="text-xl font-bold tracking-tight text-white mb-2 uppercase">{plan.name}</h3>
                
                <div className="flex items-baseline mb-3">
                  <span className="text-4xl font-extrabold tracking-tight text-white flex items-center">
                    ₹
                    <NumberFlow
                      format={{
                        style: 'decimal',
                      }}
                      value={isYearly ? plan.yearlyPrice : plan.price}
                      className="text-4xl font-black"
                    />
                  </span>
                  <span className="text-slate-400 text-xs ml-1 font-semibold">
                    /{isYearly ? "year" : "month"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-normal min-h-[32px] font-medium">{plan.description}</p>
              </CardHeader>

              <CardContent className="p-6 sm:p-8 pt-0 flex flex-col justify-between flex-1">
                <button
                  className={cn(
                    "w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg",
                    plan.popular
                      ? "bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white shadow-teal-500/10 hover:scale-[1.02]"
                      : "bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white hover:scale-[1.02]"
                  )}
                >
                  {plan.buttonText}
                </button>

                <div className="space-y-4 pt-6 mt-6 border-t border-white/5 flex-1">
                  <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                    {plan.includes[0]}
                  </h4>
                  
                  <ul className="space-y-2.5">
                    {plan.includes.slice(1).map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-2.5 text-xs text-slate-300 font-medium"
                      >
                        <span className="h-1.5 w-1.5 bg-teal-500 rounded-full shrink-0 shadow-glow shadow-teal-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TimelineContent>
        ))}
      </div>
    </div>
  );
}
