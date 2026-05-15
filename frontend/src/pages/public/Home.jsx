import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const departments = [
  { name: "Cardiology", img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80", desc: "Heart care with advanced cardiac facilities" },
  { name: "ENT", img: "https://images.unsplash.com/photo-1580281658629-5a79c0fbdc8b?w=400&q=80", desc: "Ear, nose and throat specialist care" },
  { name: "Orthopaedics", img: "https://images.unsplash.com/photo-1600959907703-125ba1374a12?w=400&q=80", desc: "Bone and joint treatment expertise" },
  { name: "Paediatrics", img: "https://images.unsplash.com/photo-1606813902767-d9cb3c7c0f28?w=400&q=80", desc: "Specialised care for children" },
  { name: "Neurology", img: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80", desc: "Brain and nervous system treatment" },
  { name: "General Surgery", img: "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=400&q=80", desc: "Expert surgical procedures" },
  { name: "Obstetrics & Gynecology", img: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&q=80", desc: "Women's health and maternity" },
  { name: "Vascular Surgery", img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80", desc: "Varicose veins and vascular care" },
  { name: "Nephrology", img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80", desc: "Kidney disease management" },
  { name: "Gastroenterology", img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80", desc: "Digestive system disorders" },
  { name: "Dermatology", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80", desc: "Skin, hair and nail treatments" },
  { name: "Psychiatry", img: "https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?w=400&q=80", desc: "Mental health and wellness" },
];

const advantages = [
  {
    title: "24x7 Emergency & Trauma Care",
    text: "Round-the-clock emergency and trauma care with advanced life support facilities and rapid response teams.",
    img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=80",
  },
  {
    title: "Cardiac Catheterization Lab",
    text: "Ultramodern cath lab operating 24x7 with expert interventional cardiologists on standby.",
    img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&q=80",
  },
  {
    title: "Mother & Child Care",
    text: "Advanced maternity unit with compassionate, personalised care for mothers and newborns.",
    img: "https://images.unsplash.com/photo-1606813902767-d9cb3c7c0f28?w=600&q=80",
  },
];

const news = [
  { date: "Oct 03, 2024", title: "Hospital hosts national medical symposium on advanced cardiac care", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80" },
  { date: "Sep 18, 2024", title: "New Cardiac ICU wing inaugurated with state-of-the-art monitoring", img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80" },
  { date: "Aug 25, 2024", title: "World Heart Day: Free cardiac screening camp for all patients", img: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80" },
  { date: "Jul 14, 2024", title: "Hospital receives national award for excellence in patient safety", img: "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=400&q=80" },
];

const testimonials = [
  { name: "Jijeesh P P", text: "Excellent experience. Good caring from Doctors, Nurses and Staff. I recommend this hospital and appreciate all the staff and management." },
  { name: "Aparna Mohan", text: "One of the famous hospitals in Kozhikode. Amazing services. Efficient doctors, nurses and other staff. Hygienic and well maintained." },
  { name: "Sangeetha Prathap", text: "Very good experience with the ENT department. Very prompt and helpful team. I refer this as the best hospital." },
  { name: "Prashob P", text: "The best hospital for maternity treatments. The staff are all very caring, professional and helpful." },
];

const slides = [
  { title: "Trusted Leadership... Proven Values", sub: "Excellence in healthcare — serving thousands of patients", img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1600&q=85" },
  { title: "Modular Operation Theaters", sub: "Advanced infrastructure with world-class surgical care", img: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1600&q=85" },
  { title: "Redefining Patient Care", sub: "Treatment and safety at international standards", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=85" },
];

const specialistLinks = [
  "Cardiology", "ENT", "Orthopaedics", "Neurology", "General Surgery",
  "Obstetrics & Gynecology", "Paediatrics", "Vascular Surgery",
  "Nephrology", "Gastroenterology", "Dermatology", "Psychiatry",
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [specialistOpen, setSpecialistOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlideIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial((i) => (i + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="font-sans text-gray-800 overflow-x-hidden">

      {/* ── Announcement Bar ─────────────────────────────────── */}
      <div className="bg-teal-700 text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
          <span className="font-medium">
            🏥 VenaSeal™ Glue Therapy for Varicose Veins now available —
            <a href="tel:+918606945541" className="underline ml-1 hover:text-teal-200">+91 8606945541</a>
          </span>
          <div className="flex gap-5">
            <a href="tel:04953069000" className="hover:text-teal-200 transition-colors">📞 0495 3069000</a>
            <a href="mailto:info@hospital.com" className="hover:text-teal-200 transition-colors hidden sm:block">✉ info@hospital.com</a>
          </div>
        </div>
      </div>

      {/* ── Navbar ──────────────────────────────────────────── */}
      <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? "shadow-lg" : "shadow-sm"}`}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

          {/* Logo */}
          <div>
            <div className="text-2xl font-bold text-teal-700 leading-none" style={{ fontFamily: "Georgia, serif" }}>
              Care Hospital
            </div>
            <div className="text-[10px] tracking-[3px] text-gray-400 uppercase mt-0.5">Multispeciality</div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center text-sm font-medium text-gray-700">
            <Link to="/" className="px-3 py-5 hover:text-teal-700 border-b-2 border-transparent hover:border-teal-700 transition-all">Home</Link>
            <a href="#" className="px-3 py-5 hover:text-teal-700 border-b-2 border-transparent hover:border-teal-700 transition-all">About Us</a>

            {/* Specialist dropdown */}
            <div className="relative" onMouseEnter={() => setSpecialistOpen(true)} onMouseLeave={() => setSpecialistOpen(false)}>
              <button className="px-3 py-5 hover:text-teal-700 border-b-2 border-transparent hover:border-teal-700 transition-all flex items-center gap-1">
                Specialist <span className="text-[10px]">▾</span>
              </button>
              {specialistOpen && (
                <div className="absolute top-full left-0 w-56 bg-white shadow-2xl border-t-4 border-teal-600 z-50 py-2">
                  {specialistLinks.map((s) => (
                    <a key={s} href="#" className="block px-5 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors">{s}</a>
                  ))}
                </div>
              )}
            </div>

            <a href="#" className="px-3 py-5 hover:text-teal-700 border-b-2 border-transparent hover:border-teal-700 transition-all">Health Packages</a>
            <a href="#" className="px-3 py-5 hover:text-teal-700 border-b-2 border-transparent hover:border-teal-700 transition-all">Contact us</a>
          </nav>

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <Link
            to="/login"
            className="border border-teal-600 text-teal-600 px-5 py-2 rounded hover:bg-teal-600 hover:text-white transition"
            >
              Login
              </Link>
              <Link to="/login">
              <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 text-sm font-bold rounded transition-all hover:shadow-lg">
                Make Appointment
                </button>
                </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Slider ──────────────────────────────────────── */}
      <section className="relative h-[88vh] overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === slideIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            style={{ backgroundImage: `url(${slide.img})`, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-teal-800/50" />
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-8 w-full">
                <div className="max-w-2xl">
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-5 leading-tight" style={{ fontFamily: "Georgia, serif" }}>
                    {slide.title}
                  </h1>
                  <p className="text-xl text-teal-100 mb-10 leading-relaxed">{slide.sub}</p>
                  <div className="flex gap-4">
                    <Link to="/login">
                      <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded font-bold text-sm transition-all hover:shadow-xl">
                        Book Appointment
                      </button>
                    </Link>
                    <button className="border-2 border-white/80 text-white px-8 py-3.5 rounded font-bold text-sm hover:bg-white hover:text-teal-800 transition-all">
                      Know More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Arrows */}
        <button
          onClick={() => setSlideIndex((i) => (i - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-teal-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors text-xl"
        >‹</button>
        <button
          onClick={() => setSlideIndex((i) => (i + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-teal-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors text-xl"
        >›</button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIndex(i)}
              className={`rounded-full transition-all duration-300 ${i === slideIndex ? "bg-red-500 w-7 h-2.5" : "bg-white/50 w-2.5 h-2.5 hover:bg-white"}`}
            />
          ))}
        </div>
      </section>

      {/* ── Welcome / About ──────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-red-600 font-bold text-xs uppercase tracking-[3px] mb-3">Welcome to Care Hospital</p>
            <h2 className="text-4xl font-bold text-teal-800 mb-6 leading-snug" style={{ fontFamily: "Georgia, serif" }}>
              Your Trusted Healthcare Partner
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-[15px]">
              Care Hospital is a leading multi-speciality hospital committed to delivering world-class healthcare. With a team of experienced doctors and state-of-the-art facilities, we provide compassionate care across 40+ specialities.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8 text-[15px]">
              We provide all types of diagnosis, internal medicine treatments and healthcare services including Cardiology, Orthopaedics, Neurology, Obstetrics & Gynecology, ENT, Vascular Surgery and more.
            </p>
            <a href="#" className="inline-flex items-center gap-2 text-teal-700 font-bold text-sm border-b-2 border-teal-700 pb-0.5 hover:text-red-600 hover:border-red-600 transition-colors">
              View More »
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-5">
            {[
              { value: "25+", label: "Years of Excellence", color: "bg-teal-600" },
              { value: "150+", label: "Expert Doctors", color: "bg-red-600" },
              { value: "50K+", label: "Patients Annually", color: "bg-teal-500" },
              { value: "40+", label: "Departments", color: "bg-red-500" },
            ].map((s) => (
              <div key={s.label} className={`${s.color} text-white rounded-xl p-8 text-center hover:scale-105 transition-transform`}>
                <div className="text-4xl font-bold mb-2" style={{ fontFamily: "Georgia, serif" }}>{s.value}</div>
                <div className="text-sm font-medium opacity-90">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Departments ──────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-red-600 font-bold text-xs uppercase tracking-[3px] mb-3">What We Treat</p>
            <h2 className="text-4xl font-bold text-teal-800" style={{ fontFamily: "Georgia, serif" }}>Our Departments</h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-0.5 w-12 bg-gray-300 rounded" />
              <div className="h-1 w-8 bg-red-600 rounded" />
              <div className="h-0.5 w-12 bg-gray-300 rounded" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {departments.map((dept, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group border border-gray-100">
                <div className="h-36 overflow-hidden relative">
                  <img src={dept.img} alt={dept.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-teal-900/0 group-hover:bg-teal-900/20 transition-colors duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1 group-hover:text-teal-700 transition-colors leading-snug">{dept.name}</h3>
                  <p className="text-xs text-gray-400 mb-2">{dept.desc}</p>
                  <span className="text-teal-600 text-xs font-bold">View More ⇝</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button className="border-2 border-teal-700 text-teal-700 hover:bg-teal-700 hover:text-white px-10 py-3 rounded font-bold text-sm transition-all">
              Know More ⇝
            </button>
          </div>
        </div>
      </section>

      {/* ── Advantages ───────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-red-600 font-bold text-xs uppercase tracking-[3px] mb-3">Why Choose Us</p>
            <h2 className="text-4xl font-bold text-teal-800" style={{ fontFamily: "Georgia, serif" }}>Hospital Advantages</h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-0.5 w-12 bg-gray-300 rounded" />
              <div className="h-1 w-8 bg-red-600 rounded" />
              <div className="h-0.5 w-12 bg-gray-300 rounded" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((item, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="overflow-hidden rounded-lg mb-5 h-56 relative">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-teal-900/20 group-hover:bg-teal-900/10 transition-colors" />
                </div>
                <h4 className="font-bold text-teal-800 text-lg mb-3 group-hover:text-teal-600 transition-colors">{item.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.text}</p>
                <a href="#" className="text-red-600 text-sm font-bold hover:text-red-700 transition-colors border-b border-red-600 pb-0.5">Read More →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── News & Events ────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-red-600 font-bold text-xs uppercase tracking-[3px] mb-3">Latest Updates</p>
            <h2 className="text-4xl font-bold text-teal-800" style={{ fontFamily: "Georgia, serif" }}>News & Events</h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-0.5 w-12 bg-gray-300 rounded" />
              <div className="h-1 w-8 bg-red-600 rounded" />
              <div className="h-0.5 w-12 bg-gray-300 rounded" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {news.map((item, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group border border-gray-100">
                <div className="h-44 overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-2 font-medium">{item.date}</p>
                  <h4 className="font-semibold text-gray-800 text-sm leading-snug mb-3 group-hover:text-teal-700 transition-colors">{item.title}</h4>
                  <a href="#" className="text-red-600 text-xs font-bold hover:text-red-700 transition-colors">View More →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="py-20 bg-teal-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-teal-300 font-bold text-xs uppercase tracking-[3px] mb-3">What Patients Say</p>
          <h2 className="text-4xl font-bold text-white mb-12" style={{ fontFamily: "Georgia, serif" }}>Patient Feedback</h2>

          <div className="relative" style={{ minHeight: "160px" }}>
            {testimonials.map((t, i) => (
              <div key={i} className={`transition-all duration-700 ${i === activeTestimonial ? "opacity-100 relative" : "opacity-0 absolute inset-0"}`}>
                <div className="text-6xl text-teal-500 leading-none mb-4 font-serif">"</div>
                <p className="text-lg text-teal-100 leading-relaxed italic mb-6 max-w-2xl mx-auto">{t.text}</p>
                <p className="font-bold text-white text-base">— {t.name}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`rounded-full transition-all duration-300 ${i === activeTestimonial ? "bg-red-500 w-8 h-3" : "bg-teal-500/50 hover:bg-teal-400 w-3 h-3"}`}
              />
            ))}
          </div>

          <a href="#" className="inline-block mt-10 border-2 border-white/80 text-white px-10 py-3 rounded font-bold text-sm hover:bg-white hover:text-teal-800 transition-all">
            View More ⇝
          </a>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="bg-teal-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">

          <div>
            <div className="text-2xl font-bold mb-0.5" style={{ fontFamily: "Georgia, serif" }}>Care Hospital</div>
            <div className="text-[10px] tracking-[3px] text-teal-400 uppercase mb-5">Multispeciality</div>
            <p className="text-sm text-teal-300 leading-relaxed mb-6">
              Committed to achieving the highest level of quality through professionalism, innovation and ethical practices in every aspect of patient care.
            </p>
            <div className="flex gap-2">
              {[
                { label: "f", color: "hover:bg-blue-600" },
                { label: "t", color: "hover:bg-sky-500" },
                { label: "in", color: "hover:bg-pink-600" },
                { label: "yt", color: "hover:bg-red-600" },
              ].map((s) => (
                <a key={s.label} href="#" className={`w-9 h-9 rounded-full bg-teal-700 ${s.color} flex items-center justify-center text-xs font-bold transition-colors border border-teal-600`}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-5 pb-3 border-b border-teal-700 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-1.5">
              {["Home", "About Us", "Gallery", "Blog", "News & Events", "Health Packages", "Careers"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-teal-300 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="text-red-500 group-hover:translate-x-0.5 transition-transform">›</span> {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-5 pb-3 border-b border-teal-700 text-sm uppercase tracking-wider">Departments</h4>
            <ul className="space-y-1.5">
              {["Cardiology", "ENT", "Orthopaedics", "Neurology", "General Surgery", "Obstetrics & Gynecology", "Vascular Surgery"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-teal-300 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="text-red-500 group-hover:translate-x-0.5 transition-transform">›</span> {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-5 pb-3 border-b border-teal-700 text-sm uppercase tracking-wider">Get in Touch</h4>
            <p className="font-bold text-white text-sm mb-3">Care Hospital</p>
            <p className="text-sm text-teal-300 leading-relaxed mb-5">
              NH Bypass Junction,<br />Near Thondayad, Kozhikode,<br />Kerala – 673 017, India.
            </p>
            <a href="tel:04953069000" className="flex items-center gap-2 text-sm text-teal-300 hover:text-white mb-2 transition-colors">📞 Tel: 0495 3069000</a>
            <a href="mailto:info@hospital.com" className="flex items-center gap-2 text-sm text-teal-300 hover:text-white transition-colors">✉ info@hospital.com</a>
            <Link to="/login">
              <button className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-bold text-sm transition-all hover:shadow-lg">
                📅 Make Appointment
              </button>
            </Link>
          </div>
        </div>

        <div className="border-t border-teal-800">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-teal-400">
            <span>Copyright 2026 Care Hospital Healthcare. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
