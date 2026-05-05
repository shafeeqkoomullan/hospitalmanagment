import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow py-3" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/home" className="text-2xl font-bold text-teal-600">
          Hospital
        </Link>

        <nav className="hidden md:flex space-x-8 text-sm font-medium">
          <Link to="/about" className="hover:text-teal-600">
            About Us
          </Link>
          <span className="hover:text-teal-600 cursor-pointer">Specialist</span>
          <span className="hover:text-teal-600 cursor-pointer">Health Insurance</span>
          <span className="hover:text-teal-600 cursor-pointer">Health Packages</span>
          <span className="hover:text-teal-600 cursor-pointer">DNB Courses</span>
          <span className="hover:text-teal-600 cursor-pointer">Contact</span>
        </nav>

        <button className="bg-red-600 text-white px-5 py-2 rounded">
          Make Appointment
        </button>
      </div>
    </header>
  );
}
