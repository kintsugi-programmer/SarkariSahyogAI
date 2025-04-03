"use client";

import React from "react";
import { FiArrowUpRight } from "react-icons/fi";
import {
  FiBell,
  FiCheck,
  FiChevronDown,
  FiList,
  FiMessageCircle,
  FiUser,
} from "react-icons/fi";
import { motion as momo } from "framer-motion";
import Image from "next/image";
import {
  FaLeaf,
  FaUniversity,
  FaBriefcase,
  FaGraduationCap,
  FaHeartbeat,
  FaHome,
  FaGavel,
  FaLaptopCode,
  FaTools,
  FaHandsHelping,
  FaFutbol,
  FaBus,
  FaPlane,
  FaWater,
  FaFemale,
} from "react-icons/fa";
import { IconType } from "react-icons";
import Link from "next/link";
export const Hero = () => {
  return (
    <section className="pb-5 bg-white">
      {/* overflow-hidden */}
      <div className="relative flex flex-col items-center justify-center px-12 sm:pb-90 pb-58 pt-15">
        <Copy />
        <MockupScreen />
      </div>
      <Logos />
    </section>
  );
};

const Copy = () => {
  return (
    <><div className="flex sm:flex-row flex-col sm:space-x-4 space-x-0 space-y-4 sm:space-y-0">
      <div className="mb-1.5 rounded-full bg-zinc-600">
        <a
          href="https://github.com/kintsugi-programmer/SarkariSahyogAI"
          target="_blank"
          rel="nofollow"
          className="flex origin-top-left items-center rounded-full border border-zinc-900 bg-white p-0.5 text-sm transition-transform hover:-rotate-2"
        >
          <span className="rounded-full bg-[#FF6154] px-2 py-0.5 font-medium text-white">
            HEY!
          </span>
          <span className="ml-1.5 mr-1 inline-block">
            We're live on Product Hunt!
          </span>
          <FiArrowUpRight className="mr-2 inline-block" />
        </a>
        
      </div>
      <div className="mb-1.5 rounded-full bg-zinc-600">
        <a
          href="https://github.com/kintsugi-programmer/SarkariSahyogAI"
          target="_blank"
          rel="nofollow"
          className="flex origin-top-left items-center rounded-full border border-zinc-900 bg-white p-0.5 text-sm transition-transform hover:-rotate-2"
        >
          <span className="rounded-full bg-orange-300 px-2 py-0.5 font-medium text-white">
            AND!
          </span>
          <span className="ml-1.5 mr-1 inline-block">
            We're are Opensource!
          </span>
          <FiArrowUpRight className="mr-2 inline-block" />
        </a>
        
      </div></div>
      <h1 className="max-w-4xl text-center text-4xl font-black leading-[1.15] md:text-6xl md:leading-[1.15]">
      Discover Government Schemes Tailored Just For You
      </h1>
      <p className="mx-auto my-4 max-w-3xl text-center text-base leading-relaxed md:my-6 md:text-xl md:leading-relaxed">
      Quickly find verified government schemes you're eligible for with our intuitive Eligibility Checker & Real-time Guiding Chatbot. Say goodbye to confusion and misinformation.
      </p>
      <Link href='/schemes/new'>
      <button className="rounded-lg bg-[#155e75] p-3 uppercase text-white transition-colors hover:bg-cyan-950">
        <span className="font-bold">Get started - </span> NO SIGN-UP REQUIRED
      </button></Link>
    </>
  );
};

const MockupScreen = () => {
  return (
    <div className="absolute bottom-0 left-1/2 sm:h-80 h-50 w-[calc(100vw_-_56px)] max-w-[1100px] -translate-x-1/2 overflow-hidden rounded-t-xl bg-zinc-900 p-0.5">
      <div className="flex items-center justify-between px-2 py-1">
        <div className="flex items-center gap-0.5">
          <span className="size-2 rounded-full bg-red-400" />
          <span className="size-2 rounded-full bg-yellow-400" />
          <span className="size-2 rounded-full bg-green-400" />
        </div>
        <span className="rounded bg-zinc-600 px-2 py-0.5 text-xs text-zinc-100">
        https://sarkarisahyogai.vercel.app/
        </span>
        <FiChevronDown className="text-white" />
      </div>
      <div className="relative z-0 grid h-full w-full grid-cols-[100px,_1fr] overflow-hidden rounded-t-lg bg-white md:grid-cols-[150px,_1fr]">
        <Image src='/image.png'  alt='screen' width='1200' height='1080'></Image>
        {/* <div className="h-full border-r border-zinc-300 p-2"></div> */}



        <div className="absolute bottom-0 left-0 right-0 top-0 z-10 bg-gradient-to-b from-white/0 to-white" />
      </div>
    </div>
  );
};

const Logo = () => {
  // Temp logo from https://logoipsum.com/
  return (
    <svg
      width="32"
      height="auto"
      viewBox="0 0 50 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-fit fill-zinc-950"
    >
      <path
        d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
        stopColor="#09090B"
      ></path>
      <path
        d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
        stopColor="#09090B"
      ></path>
    </svg>
  );
};

const Logos = () => {
  return (
    <div className="relative -mt-2 -rotate-1 scale-[1.01] border-y-2 border-zinc-900 bg-white">
      <div className="relative z-0 flex overflow-hidden border-b-2 border-zinc-900">
        <TranslateWrapper>
          <LogoItemsTop />
        </TranslateWrapper>
        <TranslateWrapper>
          <LogoItemsTop />
        </TranslateWrapper>
        <TranslateWrapper>
          <LogoItemsTop />
        </TranslateWrapper>
      </div>
      <div className="relative z-0 flex overflow-hidden">
        <TranslateWrapper reverse>
          <LogoItemsBottom />
        </TranslateWrapper>
        <TranslateWrapper reverse>
          <LogoItemsBottom />
        </TranslateWrapper>
        <TranslateWrapper reverse>
          <LogoItemsBottom />
        </TranslateWrapper>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-32 bg-gradient-to-r from-white to-white/0" />
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-32 bg-gradient-to-l from-white to-white/0" />
    </div>
  );
};

type TranslateWrapperProps = {
    children: React.ReactNode;
    reverse?: boolean;
  };
  
  export const TranslateWrapper = ({ children, reverse = false }: TranslateWrapperProps) => {
    return (
      <momo.div
        initial={{ translateX: reverse ? '-100%' : '0%' }}
        animate={{ translateX: reverse ? '0%' : '-100%' }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        className="flex px-2"
      >
        {children}
      </momo.div>
    );
  };
const LogoItem = ({ Icon, name }: { Icon: IconType; name: string }) => {
  return (
    <span className="flex items-center justify-center gap-4 px-4 py-2 md:py-4">
      <Icon className="text-2xl text-[#155e75] md:text-3xl" />
      <span className="whitespace-nowrap text-xl font-semibold uppercase md:text-2xl">
        {name}
      </span>
    </span>
  );
};

const LogoItemsTop = () => (
  <>
    <LogoItem Icon={FaLeaf} name="Agriculture, Rural & Environment" />
    <LogoItem Icon={FaUniversity} name="Banking, Financial Services and Insurance" />
    <LogoItem Icon={FaBriefcase} name="Business & Entrepreneurship" />
    <LogoItem Icon={FaGraduationCap} name="Education & Learning" />
    <LogoItem Icon={FaHeartbeat} name="Health & Wellness" />
    <LogoItem Icon={FaHome} name="Housing & Shelter" />
    <LogoItem Icon={FaGavel} name="Public Safety, Law & Justice" />
    <LogoItem Icon={FaLaptopCode} name="Science, IT & Communications" />
  </>
);

const LogoItemsBottom = () => (
  <>
    <LogoItem Icon={FaTools} name="Skills & Employment" />
    <LogoItem Icon={FaHandsHelping} name="Social welfare & Empowerment" />
    <LogoItem Icon={FaFutbol} name="Sports & Culture" />
    <LogoItem Icon={FaBus} name="Transport & Infrastructure" />
    <LogoItem Icon={FaPlane} name="Travel & Tourism" />
    <LogoItem Icon={FaWater} name="Utility & Sanitation" />
    <LogoItem Icon={FaFemale} name="Women and Child" />
  </>
);
