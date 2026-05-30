import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// FIX: Unified slug function used in both Home and DepartmentDetail
// Was using makeSlug (lowercase+hyphen) in Home but encodeURIComponent in DepartmentDetail
// — links from Home would never match DepartmentDetail routes.
// Now both use encodeURIComponent so the department name is passed intact.
const deptSlug = (name) => encodeURIComponent(name);

const departments = [
  { name: "Cardiology",               img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80", desc: "Heart care with advanced cardiac facilities" },
  { name: "ENT",                       img: "https://images.unsplash.com/photo-1580281658629-5a79c0fbdc8b?w=400&q=80", desc: "Ear, nose and throat specialist care" },
  { name: "Orthopaedics",              img: "https://images.unsplash.com/photo-1600959907703-125ba1374a12?w=400&q=80", desc: "Bone and joint treatment expertise" },
  { name: "Paediatrics",               img: "https://images.unsplash.com/photo-1606813902767-d9cb3c7c0f28?w=400&q=80", desc: "Specialised care for children" },
  { name: "Neurology",                 img: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80", desc: "Brain and nervous system treatment" },
  { name: "General Surgery",           img: "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=400&q=80", desc: "Expert surgical procedures" },
  { name: "Obstetrics & Gynecology",   img: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&q=80", desc: "Women's health and maternity" },
  { name: "Vascular Surgery",          img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80", desc: "Varicose veins and vascular care" },
  { name: "Nephrology",                img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80", desc: "Kidney disease management" },
  { name: "Gastroenterology",          img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80", desc: "Digestive system disorders" },
  { name: "Dermatology",               img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80", desc: "Skin, hair and nail treatments" },
  { name: "Psychiatry",                img: "https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?w=400&q=80", desc: "Mental health and wellness" },
];

const slides = [
  { title: "Trusted Leadership... Proven Values",    sub: "Excellence in healthcare — serving thousands of patients",          img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1600&q=85" },
  { title: "Modular Operation Theaters",              sub: "Advanced infrastructure with world-class surgical care",             img: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1600&q=85" },
  { title: "Redefining Patient Care",                 sub: "Treatment and safety at international standards",                   img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=85" },
];

const stats = [
  { value: "25+", label: "Years of Excellence" },
  { value: "50+", label: "Specialist Doctors" },
  { value: "1L+", label: "Patients Treated" },
  { value: "24/7", label: "Emergency Care" },
];

export default function Home() {
  const [scrolled, setScrolled]         = useState(false);
  const [slideIndex, setSlideIndex]     = useState(0);
  const [specialistOpen, setSpecialistOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlideIndex(i => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="font-sans text-gray-800 overflow-x-hidden">

      {/* ── Announcement bar ── */}
      <div className="bg-teal-700 text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span>Care Hospital — Advanced Multispeciality Healthcare</span>
          <div className="hidden sm:flex gap-5">
            <a href="tel:04953069000" className="hover:text-teal-200 transition-colors">📞 0495 3069000</a>
            <a href="mailto:info@hospital.com" className="hover:text-teal-200 transition-colors">✉ info@hospital.com</a>
          </div>
        </div>
      </div>

      {/* ── Navbar ── */}
      <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? "shadow-lg" : "shadow-sm"}`}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

          <Link to="/" className="flex flex-col">
            <span className="text-2xl font-bold text-teal-700" style={{ fontFamily: "Georgia, serif" }}>Care Hospital</span>
            <span className="text-[9px] tracking-[3px] text-gray-400 uppercase">Multispeciality</span>
          </Link>

          <nav className="hidden lg:flex items-center text-sm font-medium text-gray-700">
            <Link to="/" className="px-3 py-5 hover:text-teal-700 border-b-2 border-transparent hover:border-teal-700 transition-all">
              Home
            </Link>
            <Link to="/departments" className="px-3 py-5 hover:text-teal-700 border-b-2 border-transparent hover:border-teal-700 transition-all">
              Departments
            </Link>

            {/* Specialist dropdown */}
            <div className="relative" onMouseEnter={() => setSpecialistOpen(true)} onMouseLeave={() => setSpecialistOpen(false)}>
              <button className="px-3 py-5 hover:text-teal-700 border-b-2 border-transparent hover:border-teal-700 transition-all flex items-center gap-1">
                Specialist <span className="text-[10px]">▾</span>
              </button>
              {specialistOpen && (
                <div className="absolute top-full left-0 w-56 bg-white shadow-2xl border-t-4 border-teal-600 z-50 py-2 max-h-80 overflow-y-auto">
                  {departments.map(d => (
                    <Link
                      key={d.name}
                      to={`/departments/${deptSlug(d.name)}`}
                      className="block px-5 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                    >
                      {d.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <a href="#contact" className="px-3 py-5 hover:text-teal-700 border-b-2 border-transparent hover:border-teal-700 transition-all">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden md:block border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-5 py-2 rounded text-sm font-semibold transition-all"
            >
              Login
            </Link>
            <Link
              to="/login"
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 text-sm font-bold rounded transition-all"
            >
              Make Appointment
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero slider ── */}
      <section className="relative h-[88vh] overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === slideIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            style={{ backgroundImage: `url(${slide.img})`, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-teal-800/40" />
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-8 w-full">
                <div className="max-w-2xl">
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-5" style={{ fontFamily: "Georgia, serif" }}>
                    {slide.title}
                  </h1>
                  <p className="text-xl text-teal-100 mb-10">{slide.sub}</p>
                  <Link to="/login" className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded font-bold transition-all">
                    Book Appointment
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === slideIndex ? "bg-white scale-125" : "bg-white/40"}`}
            />
          ))}
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-teal-700 text-white py-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-3xl font-bold">{s.value}</div>
              <div className="text-teal-200 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Departments grid ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-teal-600 font-semibold mb-2">What We Offer</p>
            <h2 className="text-4xl font-bold text-teal-800" style={{ fontFamily: "Georgia, serif" }}>Our Departments</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {departments.map(dept => (
              <Link to={`/departments/${deptSlug(dept.name)}`} key={dept.name} className="group">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 h-full">
                  <div className="h-44 overflow-hidden">
                    <img
                      src={dept.img}
                      alt={dept.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-sm mb-2 group-hover:text-teal-700 transition-colors">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">{dept.desc}</p>
                    <span className="text-teal-600 text-xs font-bold">View More ⇝</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why choose us ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-teal-600 font-semibold mb-2">Why Us</p>
            <h2 className="text-4xl font-bold text-teal-800" style={{ fontFamily: "Georgia, serif" }}>Patient-First Care</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🏥", title: "Advanced Infrastructure", desc: "State-of-the-art operation theaters, ICUs, and diagnostic labs equipped with the latest medical technology." },
              { icon: "👨‍⚕️", title: "Expert Specialists", desc: "Our team of experienced doctors and specialists are committed to delivering the highest standards of care." },
              { icon: "❤️", title: "Compassionate Approach", desc: "We combine medical expertise with genuine compassion, treating every patient with dignity and respect." },
            ].map(item => (
              <div key={item.title} className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-all">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="bg-teal-700 py-16 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "Georgia, serif" }}>Ready to Book an Appointment?</h2>
          <p className="text-teal-200 mb-8">Our specialists are available Monday to Saturday. Emergency care is available 24/7.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded font-bold transition-all">
              Book Online
            </Link>
            <a href="tel:04953069000" className="border-2 border-white text-white hover:bg-white hover:text-teal-700 px-8 py-3.5 rounded font-bold transition-all">
              Call Us Now
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" className="bg-teal-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="text-2xl font-bold mb-1" style={{ fontFamily: "Georgia, serif" }}>Care Hospital</div>
            <div className="text-[10px] tracking-[3px] text-teal-400 uppercase mb-4">Multispeciality</div>
            <p className="text-sm text-teal-300 leading-relaxed">Advanced healthcare with compassionate treatment.</p>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-teal-700">Departments</h4>
            <ul className="space-y-1.5">
              {departments.map(d => (
                <li key={d.name}>
                  <Link to={`/departments/${deptSlug(d.name)}`} className="text-sm text-teal-300 hover:text-white transition-colors">
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-teal-700">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-teal-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/departments" className="text-sm text-teal-300 hover:text-white transition-colors">Departments</Link></li>
              <li><Link to="/login" className="text-sm text-teal-300 hover:text-white transition-colors">Patient Login</Link></li>
              <li><Link to="/login" className="text-sm text-teal-300 hover:text-white transition-colors">Book Appointment</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-teal-700">Contact</h4>
            <p className="text-sm text-teal-300">NH Bypass Junction,</p>
            <p className="text-sm text-teal-300">Kozhikode, Kerala – 673 017</p>
            <a href="tel:04953069000" className="block mt-3 text-sm text-teal-300 hover:text-white transition-colors">📞 0495 3069000</a>
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
