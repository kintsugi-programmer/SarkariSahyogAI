import React from 'react';
import { FiCpu } from 'react-icons/fi';


export default function FloatingAIButton() {
  return (
    <button
      className="fixed bottom-6 right-6 flex items-center justify-center w-14 h-14 rounded-full bg-[#155e75] text-white shadow-lg hover:bg-orange-300 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-orang-300 focus:ring-opacity-50"
      aria-label="AI Button"
      
    >
        <a href="/chat">
      <FiCpu size={24} /></a>
    </button>
  );
}
