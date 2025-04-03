import React from "react";

const Foot: React.FC = () => {
  return (
    <footer className="w-full text-white bg-[#155e75] py-8">
      <div className="container mx-auto px-6">
        <nav>
          <ul className="flex flex-col md:flex-row justify-center gap-6">
            {[
              { text: "About Us", link: "/" },
              { text: "Features", link: "features" },
              { text: "Guide", link: "steps" },
              { text: "Eligibility Checker", link: "/eligibility-checker" },
              { text: "Contribute Data", link: "/schemes/new" },
              { text: "AI Chatbot", link: "/chat" },
              { text: "Home", link: "/" },
              { text: "Contribute Opensource", link: "https://github.com/kintsugi-programmer/SarkariSahyogAI" },

            ].map((item) => (
              <li key={item.text}>
                <a
                  href={item.link}
                  className="transition-colors duration-300 hover:text-emerald-100 focus:text-emerald-50"
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>


    </footer>
  );
};

export default Foot;
