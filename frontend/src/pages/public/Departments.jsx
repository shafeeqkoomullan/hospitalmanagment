import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// FIX: Departments.jsx was a placeholder ("Departments Page" text only).
// Now a fully functional listing page consistent with Home.jsx routing.

const deptSlug = (name) => encodeURIComponent(name);

const departments = [
  { name: "Cardiology",               img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&q=80", desc: "Heart care with advanced cardiac facilities", icon: "🫀" },
  { name: "ENT",                       img: "https://images.unsplash.com/photo-1580281658629-5a79c0fbdc8b?w=600&q=80", desc: "Ear, nose and throat specialist care",          icon: "👂" },
  { name: "Orthopaedics",              img: "https://images.unsplash.com/photo-1600959907703-125ba1374a12?w=600&q=80", desc: "Bone and joint treatment expertise",           icon: "🦴" },
  { name: "Paediatrics",               img: "https://images.unsplash.com/photo-1606813902767-d9cb3c7c0f28?w=600&q=80", desc: "Specialised care for children",               icon: "👶" },
  { name: "Neurology",                 img: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80", desc: "Brain and nervous system treatment",          icon: "🧠" },
  { name: "General Surgery",           img: "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=600&q=80", desc: "Expert surgical procedures",                  icon: "🔬" },
  { name: "Obstetrics & Gynecology",   img: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80", desc: "Women's health and maternity",               icon: "🌸" },
  { name: "Vascular Surgery",          img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80", desc: "Varicose veins and vascular care",            icon: "🩸" },
  { name: "Nephrology",                img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80", desc: "Kidney disease management",                  icon: "🫘" },
  { name: "Gastroenterology",          img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&q=80", desc: "Digestive system disorders",                 icon: "🔵" },
  { name: "Dermatology",               img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80", desc: "Skin, hair and nail treatments",             icon: "✨" },
  { name: "Psychiatry",                img: "https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?w=600&q=80", desc: "Mental health and wellness",                 icon: "🧘" },
];

export default function Departments() {
  const navigate          = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="font-sans text-gray-800 min-h-screen">

      {/* ── Announcement ── */}
      <div className="bg-teal-700 text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span>Care Hospital — Advanced Multispeciality Healthcare</span>
          <div className="hidden sm:flex gap-5">
            <a href="tel:04953069000" className="hover:text-teal-200 transition-colors">📞 0495 3069000</a>
          </div>
        </div>
      </div>

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex flex-col">
            <span className="text-2xl font-bold text-teal-700" style={{ fontFamily: "Georgia, serif" }}>Care Hospital</span>
            <span className="text-[9px] tracking-[3px] text-gray-400 uppercase">Multispeciality</span>
          </Link>
          <nav className="hidden lg:flex items-center text-sm font-medium text-gray-700">
            <Link to="/" className="px-3 py-5 hover:text-teal-700 transition-colors">Home</Link>
            <Link to="/departments" className="px-3 py-5 text-teal-700 border-b-2 border-teal-700 font-semibold">Departments</Link>
            <a href="#contact" className="px-3 py-5 hover:text-teal-700 transition-colors">Contact</a>
          </nav>
          <div className="flex gap-3">
            <Link to="/login" className="hidden md:block border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-5 py-2 rounded text-sm font-semibold transition-all">
              Login
            </Link>
            <Link to="/login" className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 text-sm font-bold rounded transition-all">
              Make Appointment
            </Link>
          </div>
        </div>
      </header>

      {/* ── Page Hero ── */}
      <section className="bg-gradient-to-r from-teal-800 to-teal-700 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-teal-300 mb-3">Care Hospital</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "Georgia, serif" }}>
            Our Departments
          </h1>
          <p className="text-teal-200 text-base mb-8 max-w-xl mx-auto">
            Comprehensive specialist care across 12 departments, delivered by experienced physicians with advanced infrastructure.
          </p>
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search departments…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-5 py-3.5 pr-12 rounded-xl text-gray-800 text-sm outline-none focus:ring-2 focus:ring-teal-300 shadow-lg"
            />
            {search ? (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            ) : (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm">🔍</span>
            )}
          </div>
        </div>
      </section>

      {/* ── Departments grid ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg">No departments match "{search}"</p>
              <button onClick={() => setSearch("")} className="mt-4 text-teal-600 underline text-sm">
                Clear search
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-400 mb-6 uppercase tracking-wider">
                {filtered.length} department{filtered.length !== 1 ? "s" : ""}
                {search ? ` matching "${search}"` : ""}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filtered.map(dept => (
                  <Link
                    to={`/departments/${deptSlug(dept.name)}`}
                    key={dept.name}
                    className="group"
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 h-full flex flex-col">
                      <div className="h-44 overflow-hidden relative">
                        <img
                          src={dept.img}
                          alt={dept.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 rounded-lg px-2 py-1 text-lg leading-none">
                          {dept.icon}
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-semibold text-gray-800 text-sm mb-1.5 group-hover:text-teal-700 transition-colors">
                          {dept.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-4 flex-1 leading-relaxed">{dept.desc}</p>
                        <span className="text-teal-600 text-xs font-bold group-hover:gap-2 flex items-center gap-1 transition-all">
                          View Department ⇝
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-teal-700 py-14 text-white text-center px-6">
        <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "Georgia, serif" }}>
          Need to See a Specialist?
        </h2>
        <p className="text-teal-200 mb-8 max-w-md mx-auto text-sm">
          Book an appointment online or call us. Our team is available Monday to Saturday.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded font-bold transition-all">
            Book Online
          </Link>
          <a href="tel:04953069000" className="border-2 border-white text-white hover:bg-white hover:text-teal-700 px-8 py-3.5 rounded font-bold transition-all">
            Call 0495 3069000
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" className="bg-teal-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="text-xl font-bold mb-1" style={{ fontFamily: "Georgia, serif" }}>Care Hospital</div>
            <div className="text-[10px] tracking-[3px] text-teal-400 uppercase mb-3">Multispeciality</div>
            <p className="text-sm text-teal-300 max-w-xs leading-relaxed">
              Committed to delivering world-class healthcare with compassion and excellence.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-teal-700">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-teal-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/departments" className="text-sm text-teal-300 hover:text-white transition-colors">All Departments</Link></li>
              <li><Link to="/login" className="text-sm text-teal-300 hover:text-white transition-colors">Book Appointment</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-teal-700">Contact</h4>
            <p className="text-sm text-teal-300">NH Bypass Junction, Kozhikode, Kerala</p>
            <a href="tel:04953069000" className="block mt-2 text-sm text-teal-300 hover:text-white transition-colors">📞 0495 3069000</a>
            <a href="mailto:info@hospital.com" className="block mt-1 text-sm text-teal-300 hover:text-white transition-colors">✉ info@hospital.com</a>
          </div>
        </div>
        <div className="border-t border-teal-800 text-center text-xs text-teal-500 py-4">
          © 2026 Care Hospital Healthcare. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
