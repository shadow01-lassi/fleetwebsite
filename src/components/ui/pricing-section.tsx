"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import NumberFlow from "@number-flow/react";
import { Briefcase, CheckCheck, Database, Server } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

const plans = [
  {
    name: "Starter",
    description:
      "Perfect for small logistics operators and independent delivery drivers starting fleet analytics.",
    price: 12,
    yearlyPrice: 99,
    buttonText: "Get started",
    buttonVariant: "outline" as const,
    features: [
      { text: "Up to 10 vehicles online", icon: <Briefcase size={20} /> },
      { text: "Up to 10GB telemetry logs", icon: <Database size={20} /> },
      { text: "Basic GPS sync and routing", icon: <Server size={20} /> },
    ],
    includes: [
      "Starter includes:",
      "Real-time GPS coordinates",
      "Interactive map overlays",
      "Manual vehicle locking keys",
    ],
  },
  {
    name: "Business",
    description:
      "Complete operational suite designed for scaling rental agencies and courier fleets.",
    price: 48,
    yearlyPrice: 399,
    buttonText: "Get started",
    buttonVariant: "default" as const,
    popular: true,
    features: [
      { text: "Unlimited vehicles online", icon: <Briefcase size={20} /> },
      { text: "Unlimited telemetry storage", icon: <Database size={20} /> },
      { text: "Advanced velocity audits", icon: <Server size={20} /> },
    ],
    includes: [
      "Everything in Starter, plus:",
      "Automated return checkouts",
      "Real-time battery alert thresholds",
      "Split-screen driver audit reviews",
    ],
  },
  {
    name: "Enterprise",
    description:
      "Bespoke configuration with high-frequency telemetry endpoints and robust SLA guarantees.",
    price: 96,
    yearlyPrice: 899,
    buttonText: "Get started",
    buttonVariant: "outline" as const,
    features: [
      { text: "Unlimited trackers & drivers", icon: <Briefcase size={20} /> },
      { text: "Custom database integration", icon: <Database size={20} /> },
      { text: "Dedicated support team", icon: <Server size={20} /> },
    ],
    includes: [
      "Everything in Business, plus:",
      "Custom tracking hardware APIs",
      "Advanced compliance workflows",
      "Complete analytics charts",
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
      <div className="relative z-50 mx-auto flex w-fit rounded-full bg-neutral-900 border border-neutral-800 p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={`relative z-10 w-fit sm:h-12 h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors ${
            selected === "0"
              ? "text-white"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          {selected === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-4 shadow-sm shadow-teal-500 border-teal-500 bg-gradient-to-t from-teal-500 via-teal-400 to-teal-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-20">Monthly</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={`relative z-10 w-fit sm:h-12 h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors ${
            selected === "1"
              ? "text-white"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          {selected === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-4 shadow-sm shadow-teal-500 border-teal-500 bg-gradient-to-t from-teal-500 via-teal-400 to-teal-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-20 flex items-center gap-2">
            Yearly
            <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-xs font-medium text-teal-400 border border-teal-500/30">
              Save 20%
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  return (
    <div className="px-4 pt-20 pb-32 min-h-screen mx-auto relative bg-[#070a13]/60 backdrop-blur-md rounded-[3rem] border border-white/5" ref={pricingRef}>
      <div
        className="absolute top-0 left-[10%] right-[10%] w-[80%] h-full z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at center, rgba(20, 184, 166, 0.15) 0%, transparent 70%)
          `,
          opacity: 0.6,
        }}
      />

      <div className="text-center mb-12 max-w-3xl mx-auto relative z-10">
        <TimelineContent
          as="h2"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="md:text-6xl sm:text-4xl text-3xl font-black text-white tracking-tight uppercase mb-4"
        >
          Plans that works best for your{" "}
          <TimelineContent
            as="span"
            animationNum={1}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="border border-dashed border-teal-500 px-3 py-1 rounded-2xl bg-teal-500/10 text-teal-400 capitalize inline-block"
          >
            fleet
          </TimelineContent>
        </TimelineContent>

        <TimelineContent
          as="p"
          animationNum={2}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="sm:text-base text-sm text-slate-400 sm:w-[70%] w-[80%] mx-auto font-medium"
        >
          Explore simple plans tailored to your rental volume. Secure operations with active telemetry.
        </TimelineContent>
      </div>

      <TimelineContent
        as="div"
        animationNum={3}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="relative z-10 mb-16"
      >
        <PricingSwitch onSwitch={togglePricingPeriod} />
      </TimelineContent>

      <div className="grid md:grid-cols-3 max-w-7xl gap-8 py-6 mx-auto relative z-10">
        {plans.map((plan, index) => (
          <TimelineContent
            key={plan.name}
            as="div"
            animationNum={4 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card
              className={`relative border-white/5 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] ${
                plan.popular 
                  ? "ring-2 ring-teal-500 bg-slate-900/90 shadow-[0_0_50px_rgba(20,184,166,0.15)] z-20" 
                  : "bg-slate-950/80 z-10"
              }`}
            >
              <CardHeader className="text-left">
                <div className="flex justify-between items-center">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <div className="">
                      <span className="bg-teal-500 text-black px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                        Popular
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-black text-white">
                    $
                    <NumberFlow
                      value={isYearly ? plan.yearlyPrice : plan.price}
                      className="text-4xl font-black text-white"
                    />
                  </span>
                  <span className="text-slate-400 font-bold text-sm">
                    /{isYearly ? "year" : "month"}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <button
                  className={`w-full mb-6 py-4 text-sm font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-t from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 shadow-lg shadow-teal-500/20 border border-teal-400 text-black cursor-pointer"
                      : plan.buttonVariant === "outline"
                        ? "bg-slate-900 hover:bg-slate-800 border border-white/10 text-white cursor-pointer"
                        : "bg-teal-500 text-black cursor-pointer"
                  }`}
                >
                  {plan.buttonText}
                </button>
                <ul className="space-y-3 font-semibold py-5 border-t border-white/5">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-slate-200">
                      <span className="text-teal-400 shrink-0">
                        {feature.icon}
                      </span>
                      <span className="text-sm font-semibold text-slate-300">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-3 pt-4 border-t border-white/5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-teal-400 mb-3">
                    {plan.includes[0]}
                  </h4>
                  <ul className="space-y-2.5">
                    {plan.includes.slice(1).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <span className="h-5 w-5 bg-teal-500/10 border border-teal-500/20 rounded-full flex items-center justify-center shrink-0">
                          <CheckCheck className="h-3 w-3 text-teal-400" />
                        </span>
                        <span className="text-xs font-semibold text-slate-400">{feature}</span>
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
