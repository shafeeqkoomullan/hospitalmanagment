import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const departments = [
  { name: "ENT", img: "https://images.unsplash.com/photo-1580281658629-5a79c0fbdc8b" },
  { name: "Paediatrics", img: "https://images.unsplash.com/photo-1606813902767-d9cb3c7c0f28" },
  { name: "Orthopaedics", img: "https://images.unsplash.com/photo-1600959907703-125ba1374a12" },
  { name: "Cardiology", img: "https://images.unsplash.com/photo-1579154204601-01588f351e67" },
  { name: "Neurology", img: "https://images.unsplash.com/photo-1581091870627-3f9cbb6b2c2b" },
  { name: "General Surgery", img: "https://images.unsplash.com/photo-1550831107-1553da8c8464" },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="font-sans">

      {/* HEADER */}
      <header className={`fixed w-full z-50 transition ${scrolled ? "bg-white shadow py-3" : "bg-transparent py-6"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-teal-600">Care Hospital</h1>

          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <a>Departments</a>
            <a>Doctors</a>
            <a>Contact</a>
          </nav>

          {/* LOGIN + APPOINTMENT */}
          <div className="flex gap-3">
            <Link
              to="/login"
              className="border border-teal-600 text-teal-600 px-5 py-2 rounded hover:bg-teal-600 hover:text-white transition"
            >
              Login
            </Link>

            <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded">
              Appointment
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="h-screen relative">
        <img
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef"
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-teal-600/40" />

        <div className="relative h-full flex items-center max-w-7xl mx-auto px-6">
          <div className="text-white max-w-2xl">
            <h1 className="text-6xl font-bold mb-6">
              Advanced Healthcare With Compassion
            </h1>
            <p className="mb-6 text-lg">
              World-class medical care with experienced doctors and modern facilities.
            </p>

            <div className="flex gap-4">
              <button className="bg-red-600 px-6 py-3 rounded">Book Now</button>
              <button className="bg-white text-teal-700 px-6 py-3 rounded">Explore</button>
            </div>
          </div>
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section className="py-24 bg-gray-50">
        <h2 className="text-center text-3xl font-bold text-teal-700 mb-12">
          Our Departments
        </h2>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          {departments.map((dept, i) => (
            <div key={i} className="bg-white rounded-xl shadow hover:shadow-2xl transition overflow-hidden">
              <img src={dept.img} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-teal-700">{dept.name}</h3>
                <button className="text-red-600 mt-2 text-sm">View Details →</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-teal-700 text-white py-16 text-center">
        <h3 className="text-xl font-bold mb-2">Care Hospital</h3>
        <p>Kochi, Kerala | +91 9876543210</p>
      </footer>

    </div>
  );
}