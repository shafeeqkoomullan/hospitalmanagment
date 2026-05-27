import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const departments = [
  {
    name: "Cardiology",
    img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80",
    desc: "Heart care with advanced cardiac facilities",
  },
  {
    name: "ENT",
    img: "https://images.unsplash.com/photo-1580281658629-5a79c0fbdc8b?w=400&q=80",
    desc: "Ear, nose and throat specialist care",
  },
  {
    name: "Orthopaedics",
    img: "https://images.unsplash.com/photo-1600959907703-125ba1374a12?w=400&q=80",
    desc: "Bone and joint treatment expertise",
  },
  {
    name: "Paediatrics",
    img: "https://images.unsplash.com/photo-1606813902767-d9cb3c7c0f28?w=400&q=80",
    desc: "Specialised care for children",
  },
  {
    name: "Neurology",
    img: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80",
    desc: "Brain and nervous system treatment",
  },
  {
    name: "General Surgery",
    img: "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=400&q=80",
    desc: "Expert surgical procedures",
  },
  {
    name: "Obstetrics & Gynecology",
    img: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&q=80",
    desc: "Women's health and maternity",
  },
  {
    name: "Vascular Surgery",
    img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80",
    desc: "Varicose veins and vascular care",
  },
  {
    name: "Nephrology",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80",
    desc: "Kidney disease management",
  },
  {
    name: "Gastroenterology",
    img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80",
    desc: "Digestive system disorders",
  },
  {
    name: "Dermatology",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
    desc: "Skin, hair and nail treatments",
  },
  {
    name: "Psychiatry",
    img: "https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?w=400&q=80",
    desc: "Mental health and wellness",
  },
];

const slides = [
  {
    title: "Trusted Leadership... Proven Values",
    sub: "Excellence in healthcare — serving thousands of patients",
    img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1600&q=85",
  },
  {
    title: "Modular Operation Theaters",
    sub: "Advanced infrastructure with world-class surgical care",
    img: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1600&q=85",
  },
  {
    title: "Redefining Patient Care",
    sub: "Treatment and safety at international standards",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=85",
  },
];

const specialistLinks = [
  "Cardiology",
  "ENT",
  "Orthopaedics",
  "Neurology",
  "General Surgery",
  "Obstetrics & Gynecology",
  "Paediatrics",
  "Vascular Surgery",
  "Nephrology",
  "Gastroenterology",
  "Dermatology",
  "Psychiatry",
];

const makeSlug = (text) =>
  text.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [specialistOpen, setSpecialistOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setSlideIndex((i) => (i + 1) % slides.length);
    }, 5000);

    return () => clearInterval(t);
  }, []);

  return (
    <div className="font-sans text-gray-800 overflow-x-hidden">

      {/* Announcement */}
      <div className="bg-teal-700 text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span>
            Care Hospital — Advanced Multispeciality Healthcare
          </span>

          <div className="flex gap-5">
            <a href="tel:04953069000">
              0495 3069000
            </a>

            <a href="mailto:info@hospital.com">
              info@hospital.com
            </a>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-lg" : "shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

          {/* Logo */}
          <div>
            <div
              className="text-2xl font-bold text-teal-700"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Care Hospital
            </div>

            <div className="text-[10px] tracking-[3px] text-gray-400 uppercase">
              Multispeciality
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden lg:flex items-center text-sm font-medium text-gray-700">

            <Link
              to="/"
              className="px-3 py-5 hover:text-teal-700"
            >
              Home
            </Link>

            <Link
              to="/departments"
              className="px-3 py-5 hover:text-teal-700"
            >
              Departments
            </Link>

            {/* Specialist Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setSpecialistOpen(true)}
              onMouseLeave={() => setSpecialistOpen(false)}
            >
              <button className="px-3 py-5 hover:text-teal-700 flex items-center gap-1">
                Specialist
                <span className="text-[10px]">▾</span>
              </button>

              {specialistOpen && (
                <div className="absolute top-full left-0 w-56 bg-white shadow-2xl border-t-4 border-teal-600 z-50 py-2">

                  {specialistLinks.map((s) => (

                    <Link
                      key={s}
                      to={`/departments/${makeSlug(s)}`}
                      className="
                        block
                        px-5
                        py-2
                        text-sm
                        text-gray-700
                        hover:bg-teal-50
                        hover:text-teal-700
                        transition-colors
                      "
                    >
                      {s}
                    </Link>

                  ))}

                </div>
              )}
            </div>

            <a
              href="#"
              className="px-3 py-5 hover:text-teal-700"
            >
              Contact
            </a>

          </nav>

          {/* Buttons */}
          <div className="flex items-center gap-3">

            <Link
              to="/login"
              className="
                border
                border-teal-600
                text-teal-600
                px-5
                py-2
                rounded
                hover:bg-teal-600
                hover:text-white
                transition
              "
            >
              Login
            </Link>

            <Link to="/login">

              <button
                className="
                  bg-red-600
                  hover:bg-red-700
                  text-white
                  px-5
                  py-2.5
                  text-sm
                  font-bold
                  rounded
                "
              >
                Make Appointment
              </button>

            </Link>

          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[88vh] overflow-hidden">

        {slides.map((slide, i) => (

          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === slideIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            style={{
              backgroundImage: `url(${slide.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >

            <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-teal-800/50" />

            <div className="relative z-10 h-full flex items-center">

              <div className="max-w-7xl mx-auto px-8 w-full">

                <div className="max-w-2xl">

                  <h1
                    className="text-5xl md:text-6xl font-bold text-white mb-5"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {slide.title}
                  </h1>

                  <p className="text-xl text-teal-100 mb-10">
                    {slide.sub}
                  </p>

                  <Link to="/login">

                    <button
                      className="
                        bg-red-600
                        hover:bg-red-700
                        text-white
                        px-8
                        py-3.5
                        rounded
                        font-bold
                      "
                    >
                      Book Appointment
                    </button>

                  </Link>

                </div>

              </div>

            </div>

          </div>

        ))}

      </section>

      {/* Departments */}
      <section className="py-20 bg-gray-50">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">

            <h2
              className="text-4xl font-bold text-teal-800"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Our Departments
            </h2>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {departments.map((dept, i) => (

              <Link
                to={`/departments/${makeSlug(dept.name)}`}
                key={i}
                className="group"
              >

                <div
                  className="
                    bg-white
                    rounded-xl
                    overflow-hidden
                    shadow-sm
                    hover:shadow-xl
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    border
                    border-gray-100
                    h-full
                  "
                >

                  <div className="h-44 overflow-hidden">

                    <img
                      src={dept.img}
                      alt={dept.name}
                      className="
                        w-full
                        h-full
                        object-cover
                        group-hover:scale-110
                        transition-transform
                        duration-500
                      "
                    />

                  </div>

                  <div className="p-4">

                    <h3
                      className="
                        font-semibold
                        text-gray-800
                        text-sm
                        mb-2
                        group-hover:text-teal-700
                        transition-colors
                      "
                    >
                      {dept.name}
                    </h3>

                    <p className="text-xs text-gray-500 mb-3">
                      {dept.desc}
                    </p>

                    <span className="text-teal-600 text-xs font-bold">
                      View More ⇝
                    </span>

                  </div>

                </div>

              </Link>

            ))}

          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="bg-teal-900 text-white">

        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">

          <div>

            <div
              className="text-2xl font-bold"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Care Hospital
            </div>

            <p className="text-sm text-teal-300 mt-4">
              Advanced healthcare with compassionate treatment.
            </p>

          </div>

          <div>

            <h4 className="font-bold mb-5">
              Departments
            </h4>

            <ul className="space-y-2">

              {specialistLinks.map((l) => (

                <li key={l}>

                  <Link
                    to={`/departments/${makeSlug(l)}`}
                    className="text-teal-300 hover:text-white"
                  >
                    {l}
                  </Link>

                </li>

              ))}

            </ul>

          </div>

          <div>

            <h4 className="font-bold mb-5">
              Quick Links
            </h4>

            <ul className="space-y-2">

              <li>
                <Link to="/">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/departments">
                  Departments
                </Link>
              </li>

              <li>
                <Link to="/login">
                  Login
                </Link>
              </li>

            </ul>

          </div>

          <div>

            <h4 className="font-bold mb-5">
              Contact
            </h4>

            <p className="text-sm text-teal-300">
              Kozhikode, Kerala
            </p>

            <p className="text-sm text-teal-300 mt-2">
              0495 3069000
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}