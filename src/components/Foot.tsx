import React from "react";

const Foot: React.FC = () => {
  return (
    <footer className="w-full text-emerald-200">
      <div className="border-t border-emerald-600 bg-emerald-500 pb-12 pt-16 text-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-4 gap-6 md:grid-cols-8 lg:grid-cols-12">
            <nav className="col-span-2 md:col-span-4 lg:col-span-3">
              <h3 className="mb-6 text-base font-medium text-white">Product</h3>
              <ul>
                {["Features", "Customers", "Why us?", "Pricing"].map((item) => (
                  <li key={item} className="mb-2 leading-6">
                    <a
                      href="#"
                      className="transition-colors duration-300 hover:text-emerald-100 focus:text-emerald-50"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="col-span-2 md:col-span-4 lg:col-span-3">
              <h3 className="mb-6 text-base font-medium text-white">Docs & Help</h3>
              <ul>
                {["Documentation", "Training", "System status", "FAQs", "Help Center"].map((item) => (
                  <li key={item} className="mb-2 leading-6">
                    <a
                      href="#"
                      className="transition-colors duration-300 hover:text-emerald-100 focus:text-emerald-50"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="col-span-2 md:col-span-4 lg:col-span-3">
              <h3 className="mb-6 text-base font-medium text-white">About us</h3>
              <ul>
                {["About us", "Careers", "Leadership", "Blog", "Events"].map((item) => (
                  <li key={item} className="mb-2 leading-6">
                    <a
                      href="#"
                      className="transition-colors duration-300 hover:text-emerald-100 focus:text-emerald-50"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="col-span-2 md:col-span-4 lg:col-span-3">
              <h3 className="mb-6 text-base font-medium text-white">Get in touch</h3>
              <ul>
                {["Contact", "Support", "Partners", "Join research"].map((item) => (
                  <li key={item} className="mb-2 leading-6">
                    <a
                      href="#"
                      className="transition-colors duration-300 hover:text-emerald-100 focus:text-emerald-50"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <div className="border-t border-emerald-700 bg-emerald-600 py-4 text-sm">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>© {new Date().getFullYear()} Brand</div>
            <nav aria-label="Social media links">
              <ul className="flex items-center gap-4">
                {['Icon1', 'Icon2', 'Icon3'].map((icon, index) => (
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
