'use client'
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import { FiMenu, FiArrowRight } from "react-icons/fi";

const Nav = () => {
  return (
    <div className="bg-[#155e75] z-999">
      <FlipNav />
      
    </div>
  );
};

const FlipNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="bg-white p-4 border-b-[1px] border-gray-200 flex items-center justify-between relative">
      <NavLeft setIsOpen={setIsOpen} />
      <NavRight />
      <NavMenu isOpen={isOpen} />
    </nav>
  );
};

const Logo = () => {
  // Temp logo from https://logoipsum.com/
  return (
    <svg
      width="50"
      height="39"
      viewBox="0 0 50 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="fill-[#155e75]"
    >
      <path
        d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
        stopColor="#000000"
      ></path>
      <path
        d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
        stopColor="#000000"
      ></path>
    </svg>
  );
};

const NavLeft = ({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex items-center gap-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="block lg:hidden text-[#155e75] text-2xl"
        onClick={() => setIsOpen((pv) => !pv)}
      >
        <FiMenu />
      </motion.button>
      {/* <Logo />  */}
      <a href="/">
      <h1 className="max-w-4xl sm:block hidden text-center font-black text-[#155e75] leading-[1.15] text-2xl md:leading-[1.15]">
      SarkariSahyogAI
      </h1>      <h1 className="max-w-4xl block sm:hidden text-center font-black text-[#155e75] leading-[1.15] text-2xl md:leading-[1.15]">
      SSAI
      </h1></a>
 
      <NavLink text="About Us" link="/" />
      <NavLink text="Features" link="#features"/>
      <NavLink text="Guide" link="#steps"/>
      <NavLink text="Eligibility Checker" link="/eligibility-checker" />
      <NavLink text="Contribute Data" link="/schemes/new" />
      <NavLink text="AI Chatbot" link="/chat" />
    </div>
  );
};

const NavLink = ({ text,link }: { text: string,link: string }) => {
  return (
    <a
      href={link}
      rel="nofollow"
      className="hidden lg:block h-[30px] overflow-hidden font-medium"
    >
      <motion.div whileHover={{ y: -30 }}>
        <span className="flex items-center h-[30px] text-gray-500">{text}</span>
        <span className="flex items-center h-[30px] text-[#155e75]">
          {text}
        </span>
      </motion.div>
    </a>
  );
};

const NavRight = () => {
  return (
    <div className="flex items-center gap-4">
      <a href="#foot">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 bg-[#155e75] bg-clip-text text-transparent font-medium rounded-md whitespace-nowrap"
      >
        Reach Out
      </motion.button></a>
      <a href="/chat">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 bg-[#155e75] text-white font-medium rounded-md whitespace-nowrap"
      >
        GET STARTED
      </motion.button></a>
    </div>
  );
};

const NavMenu = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <motion.div
      variants={menuVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      className="absolute p-4 bg-white z-20 shadow-lg left-0 right-0 top-full origin-top flex flex-col gap-4"
    >
            <MenuLink text="About Us" link="/" />
      <MenuLink text="Features" link="#features"/>
      <MenuLink text="Guide" link="#steps"/>
      <MenuLink text="Eligibility Checker" link="/eligibility-checker" />
      <MenuLink text="Contribute Data" link="/schemes/new" />
      <MenuLink text="AI Chatbot" link="/chat" />

    </motion.div>
  );
};

const MenuLink = ({ text,link }: { text: string,link : string }) => {
  return (
    <motion.a
      variants={menuLinkVariants}
      rel="nofollow"
      href={link}
      className="h-[30px] overflow-hidden font-medium text-lg flex items-start gap-2"
    >
      <motion.span variants={menuLinkArrowVariants}>
        <FiArrowRight className="h-[30px] text-gray-950" />
      </motion.span>
      <motion.div whileHover={{ y: -30 }}>
        <span className="flex items-center h-[30px] text-gray-500">{text}</span>
        <span className="flex items-center h-[30px] text-indigo-600">
          {text}
        </span>
      </motion.div>
    </motion.a>
  );
};

export default Nav;

const menuVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const menuLinkVariants = {
  open: {
    y: 0,
    opacity: 1,
  },
  closed: {
    y: -10,
    opacity: 0,
  },
};

const menuLinkArrowVariants = {
  open: {
    x: 0,
  },
  closed: {
    x: -4,
  },
};