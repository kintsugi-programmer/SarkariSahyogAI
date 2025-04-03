import React from "react";

const Foot: React.FC = () => {
  const links = [
    { text: "About Us", link: "/" },
    { text: "Features", link: "features" },
    { text: "Guide", link: "steps" },
    { text: "Eligibility Checker", link: "/eligibility-checker" },
    { text: "Contribute Data", link: "/schemes/new" },
    { text: "AI Chatbot", link: "/chat" },
    { text: "Home", link: "/" },
    { text: "Opensource", link: "https://github.com/kintsugi-programmer/SarkariSahyogAI" },
    { text: "Contribution", link: "https://github.com/kintsugi-programmer/SarkariSahyogAI" },
  ];

  const splitLinks = [
    links.slice(0, 3),
    links.slice(3, 6),
    links.slice(6, 9),
  ];

  return (
    <footer className="w-full text-white">
      <div className="border-t border-[#155e75] bg-[#155e75] pb-12 pt-16 text-sm ">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
            <div>
              <a href="/">
                <h1 className="max-w-4xl sm:block hidden font-black text-white leading-[1.15] text-2xl">
                  SarkariSahyogAI
                </h1>
                <h1 className="max-w-4xl block sm:hidden font-black text-[#cffafe] leading-[1.15] text-2xl">
                  SSAI
                </h1>
              </a>
              <p className="mt-4 text-justify">
                Quickly find verified government schemes you're eligible for with our intuitive Eligibility Checker & Real-time Guiding Chatbot. Say goodbye to confusion and misinformation.
              </p>
            </div>

            <nav>
              <h3 className="mb-6 text-base font-medium text-white">Quick Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {splitLinks.map((group, idx) => (
                  <ul key={idx}>
                    {group.map((link) => (
                      <li key={link.text} className="mb-2 leading-6">
                        <a
                          href={link.link}
                          className="transition-colors duration-300 hover:text-emerald-100 focus:text-emerald-50"
                        >
                          {link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>

      <div className="border-t border-white bg-[#155e75] py-4 text-sm">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>© {new Date().getFullYear()} SarkariSahyogAI</div>
            <nav aria-label="Social media links">
              <ul className="flex items-center gap-4">
                {["Icon1", "Icon2", "Icon3"].map((icon) => (
                  <li key={icon}>
                    <a href="#" className="transition-colors duration-300 hover:text-emerald-100">
                      <span className="sr-only">{icon}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 48 48"
                        className="h-4 w-4"
                        aria-hidden="true"
                      >
                        <path d="..." />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Foot;
