'use client'
import { MotionValue, useScroll, motion, useTransform } from "framer-motion";
import React, { useRef } from "react";

import { IconType } from "react-icons";
import {
  FiArrowRight,
  FiUser,
  FiSearch,
  FiCheckCircle,
  FiMessageCircle,
} from "react-icons/fi";

export const Steps = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  return (
    <>
      <div ref={ref} className="relative">
        {CARDS.map((c, idx) => (
          <Card
            key={c.id}
            card={c}
            scrollYProgress={scrollYProgress}
            position={idx + 1}
          />
        ))}
      </div>
    </>
  );
};

interface CardProps {
  position: number;
  card: CardType;
  scrollYProgress: MotionValue;
}

const Card = ({ position, card, scrollYProgress }: CardProps) => {
  const scaleFromPct = (position - 1) / CARDS.length;
  const y = useTransform(scrollYProgress, [scaleFromPct, 1], [0, -CARD_HEIGHT]);

  return (
    <motion.div
      style={{
        height: CARD_HEIGHT,
        y: position === CARDS.length ? undefined : y,
        background: card.bgColor,
        color: card.textColor,
      }}
      className="sticky top-0 flex w-full origin-top flex-col items-center justify-center px-4"
    >
      <card.Icon className="mb-4 text-4xl" />
      <h3 className="mb-6 text-center text-4xl font-semibold md:text-6xl">
        {card.title}
      </h3>
      <p className="mb-8 max-w-lg text-center text-sm md:text-base">
        {card.description}
      </p>
      <a
        href={card.routeTo}
        className={`flex items-center gap-2 rounded px-6 py-4 text-base font-medium uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 md:text-lg ${
          card.ctaClasses
        } shadow-[4px_4px_0px_${card.shadowColor}] hover:shadow-[8px_8px_0px_${card.shadowColor}]`}
      >
        <span>Learn more</span>
        <FiArrowRight />
      </a>
    </motion.div>
  );
};

const CARD_HEIGHT = 500;

type CardType = {
  id: number;
  Icon: IconType;
  title: string;
  description: string;
  ctaClasses: string;
  routeTo: string;
  bgColor: string;
  textColor: string;
  shadowColor: string;
};

const CARDS: CardType[] = [
  {
    id: 1,
    Icon: FiUser,
    title: "Enter Your Details",
    description:
      "Start by entering basic details about yourself, such as age, location, and employment status.",
    ctaClasses: "bg-cyan-800 text-white",
    routeTo: "#",
    bgColor: "white",
    textColor: "#0f172a",
    shadowColor: "#0f172a",
  },
  {
    id: 2,
    Icon: FiSearch,
    title: "Find Relevant Schemes",
    description:
      "Our system searches and quickly identifies government schemes that match your eligibility.",
    ctaClasses: "bg-white text-cyan-800",
    routeTo: "#",
    bgColor: "#155e75",
    textColor: "white",
    shadowColor: "white",
  },
  {
    id: 3,
    Icon: FiCheckCircle,
    title: "Select & Apply",
    description:
      "Choose the best-suited scheme from the curated list and easily apply through official channels.",
    ctaClasses: "bg-cyan-800 text-white",
    routeTo: "#",
    bgColor: "#fdba74",
    textColor: "#0f172a",
    shadowColor: "#0f172a",
  },
  {
    id: 4,
    Icon: FiMessageCircle,
    title: "Get AI Assistance",
    description:
      "Use our AI-powered chatbot to clarify doubts and get real-time guidance throughout the process.",
    ctaClasses: "bg-white text-cyan-800",
    routeTo: "#",
    bgColor: "#155e75",
    textColor: "white",
    shadowColor: "white",
  },
];