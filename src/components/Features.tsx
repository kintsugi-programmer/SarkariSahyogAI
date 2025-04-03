'use client'
import { cn } from "@/lib/utils";
import { AnimatePresence, motion as momo } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
  }[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <Link
          href={item?.link}
          key={item?.link}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <momo.span
                className="absolute inset-0 h-full w-full bg-orange-300/30 dark:bg-cyan-800/60 block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full overflow-hidden bg-white dark:bg-cyan-800 border border-transparent dark:border-cyan-700 group-hover:border-orange-300 relative z-20 shadow-md",
        className
      )}
    >
      <div className="relative z-50 p-4">{children}</div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-cyan-800 dark:text-white font-bold tracking-wide mt-2", className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-4 text-cyan-800/80 dark:text-zinc-200 tracking-wide leading-relaxed ",
        className
      )}
    >
      {children}
    </p>
  );
};

export function Features() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <div className="mb-2 text-center text-4xl font-semibold md:text-6xl pt-8">
        Why Choose Us
      </div>
      <HoverEffect items={featuresList} />
    </div>
  );
}

export const featuresList = [
  {
    title: "Intuitive Eligibility Checker",
    description:
      "Quickly identify which government schemes you're eligible for with simple, easy-to-answer questions.",
    link: "#",
  },
  {
    title: "AI-Powered Assistance",
    description:
      "Get real-time help and clear your doubts instantly using our advanced multilingual chatbot.",
    link: "#",
  },
  {
    title: "Multilingual Support",
    description:
      "Accessible in multiple regional languages, ensuring inclusive usage for everyone.",
    link: "#",
  },
  {
    title: "Transparent & Verified Info",
    description:
      "All scheme details are verified, transparent, and regularly updated to keep you informed and secure.",
    link: "#",
  },
  {
    title: "Mobile & Web Responsive",
    description:
      "Use seamlessly on mobile phones, tablets, or desktops, ensuring smooth access anywhere, anytime.",
    link: "#",
  },
  {
    title: "Open-Source Community",
    description:
      "Join our open-source community on GitHub to contribute, improve, and extend the platform.",
    link: "https://github.com/your-repository",
  },
];
