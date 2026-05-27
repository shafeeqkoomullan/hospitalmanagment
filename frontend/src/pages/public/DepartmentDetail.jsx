import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

// ── Static department data (descriptions) ────────────────────────────────────
const DEPT_INFO = {
  "Cardiology": {
    short: "The Department of Cardiology at Care Hospital provides world-class cardiac care with advanced diagnostic and interventional facilities. Our team of expert cardiologists offers comprehensive treatment for all heart conditions.",
    full: `The Department of Cardiology at Care Hospital provides world-class cardiac care with advanced diagnostic and interventional facilities. Our team of expert cardiologists offers comprehensive treatment for all heart conditions.

Our cardiac unit is equipped with a state-of-the-art Catheterization Laboratory operating 24x7, staffed by experienced interventional cardiologists available round the clock for emergency cardiac procedures.

We offer a full spectrum of cardiac services including:
- Coronary Angiography and Angioplasty
- Echocardiography and Stress Testing
- Holter Monitoring and ECG
- Pacemaker Implantation
- Cardiac Rehabilitation Programs

Our preventive cardiology program focuses on lifestyle modification, risk factor management, and regular cardiac screenings to detect and address heart conditions early.`,
  },
  "ENT": {
    short: "The ENT Department at Care Hospital specialises in comprehensive diagnosis and treatment of disorders related to the ear, nose, throat, and related structures of the head and neck.",
    full: `The ENT Department at Care Hospital specialises in comprehensive diagnosis and treatment of disorders related to the ear, nose, throat, and related structures of the head and neck.

Our ENT specialists are trained in the latest minimally invasive surgical techniques including endoscopic sinus surgery, micro-laryngoscopy, and tympanoplasty.

Services offered:
- Hearing Assessment and Hearing Aid Fitting
- Sinusitis and Nasal Polyp Treatment
- Tonsillectomy and Adenoidectomy
- Voice and Swallowing Disorders
- Head and Neck Cancer Screening
- Vertigo and Balance Disorders Treatment`,
  },
  "Orthopaedics": {
    short: "The Department of Orthopaedics provides advanced surgical and non-surgical treatment for bone, joint, muscle, and ligament conditions using the latest techniques in orthopaedic care.",
    full: `The Department of Orthopaedics provides advanced surgical and non-surgical treatment for bone, joint, muscle, and ligament conditions using the latest techniques in orthopaedic care.

Our team of experienced orthopaedic surgeons specialises in joint replacement, arthroscopic surgery, spine surgery, and sports medicine.

Services offered:
- Total Hip and Knee Replacement
- Arthroscopic Knee and Shoulder Surgery
- Spine Disorders and Disc Surgeries
- Fracture Management and Trauma Care
- Sports Injuries Rehabilitation
- Paediatric Orthopaedics`,
  },
  "Neurology": {
    short: "The Neurology Department offers expert diagnosis and treatment for a wide range of brain and nervous system disorders, using cutting-edge neuroimaging and neurophysiology technology.",
    full: `The Neurology Department offers expert diagnosis and treatment for a wide range of brain and nervous system disorders, using cutting-edge neuroimaging and neurophysiology technology.

Our neurologists are trained in managing stroke, epilepsy, movement disorders, and neuromuscular conditions.

Services offered:
- Stroke Management and Rehabilitation
- Epilepsy Diagnosis and Treatment
- Parkinson's Disease Management
- Multiple Sclerosis Treatment
- EEG and Nerve Conduction Studies
- Headache and Migraine Management`,
  },
  "General Surgery": {
    short: "The Department of General Surgery at Care Hospital performs a wide range of surgical procedures using advanced laparoscopic and open techniques with excellent patient outcomes.",
    full: `The Department of General Surgery at Care Hospital performs a wide range of surgical procedures using advanced laparoscopic and open techniques with excellent patient outcomes.

Our surgeons are experienced in both emergency and elective procedures across the abdomen, breast, thyroid, and soft tissues.

Services offered:
- Laparoscopic Cholecystectomy (Gallbladder Removal)
- Appendectomy and Hernia Repair
- Thyroid and Parathyroid Surgery
- Breast Surgery and Biopsy
- Colorectal Surgery
- Emergency Abdominal Surgeries`,
  },
  "Paediatrics": {
    short: "Our Paediatrics Department provides comprehensive healthcare for children from birth through adolescence, with a compassionate and child-friendly approach to treatment.",
    full: `Our Paediatrics Department provides comprehensive healthcare for children from birth through adolescence, with a compassionate and child-friendly approach to treatment.

Our team of experienced paediatricians and neonatologists are dedicated to ensuring the health and wellbeing of every child.

Services offered:
- Neonatal Intensive Care Unit (NICU)
- Well-baby Checkups and Immunizations
- Paediatric Emergency Care
- Developmental Assessments
- Paediatric Respiratory Care
- Nutritional Counselling for Children`,
  },
  "Obstetrics & Gynecology": {
    short: "Our Obstetrics and Gynaecology Department is committed to providing the highest standard of care for women at all stages of life, from adolescence through menopause.",
    full: `Our Obstetrics and Gynaecology Department is committed to providing the highest standard of care for women at all stages of life, from adolescence through menopause.

Our team of skilled obstetricians and gynaecologists are supported by state-of-the-art infrastructure for safe deliveries and complex gynaecological procedures.

Services offered:
- Antenatal Care and Safe Deliveries
- High-Risk Pregnancy Management
- Laparoscopic Gynaecological Surgery
- Infertility Evaluation and Treatment
- Menopausal Management
- Cervical Cancer Screening`,
  },
  "Vascular Surgery": {
    short: "The Vascular Surgery Department specialises in the diagnosis and treatment of diseases affecting the arteries and veins, offering both surgical and minimally invasive treatments.",
    full: `The Vascular Surgery Department specialises in the diagnosis and treatment of diseases affecting the arteries and veins, offering both surgical and minimally invasive treatments.

We are one of the few hospitals in Kerala offering VenaSeal Glue Therapy for Varicose Veins — a virtually painless, walk-in walk-out procedure.

Services offered:
- Varicose Vein Treatment (VenaSeal, Laser, EVLT)
- Carotid Artery Surgery
- Peripheral Arterial Disease Treatment
- Aortic Aneurysm Repair
- Diabetic Foot Management
- Arteriovenous Fistula for Dialysis`,
  },
  "Nephrology": {
    short: "The Nephrology Department provides comprehensive care for kidney diseases, offering dialysis services, kidney transplant support, and chronic kidney disease management.",
    full: `The Nephrology Department provides comprehensive care for kidney diseases, offering dialysis services, kidney transplant support, and chronic kidney disease management.

Our nephrologists work closely with urologists and transplant surgeons to deliver the best outcomes for patients with kidney disorders.

Services offered:
- Haemodialysis and Peritoneal Dialysis
- Chronic Kidney Disease Management
- Kidney Biopsy
- Hypertension and Diabetes-related Kidney Care
- Post-Transplant Follow-up
- Electrolyte Disorder Management`,
  },
  "Gastroenterology": {
    short: "The Gastroenterology Department offers expert care for disorders of the digestive system including the oesophagus, stomach, intestines, liver, pancreas, and gallbladder.",
    full: `The Gastroenterology Department offers expert care for disorders of the digestive system including the oesophagus, stomach, intestines, liver, pancreas, and gallbladder.

Our gastroenterologists use advanced endoscopic techniques for accurate diagnosis and minimally invasive treatment.

Services offered:
- Upper and Lower GI Endoscopy
- Colonoscopy and Polypectomy
- ERCP for Bile Duct Disorders
- Liver Disease and Hepatitis Management
- Inflammatory Bowel Disease Treatment
- Nutritional Support and Counselling`,
  },
  "Dermatology": {
    short: "Our Dermatology Department offers comprehensive skin, hair, and nail care services using the latest technology including lasers, dermoscopy, and advanced cosmetic procedures.",
    full: `Our Dermatology Department offers comprehensive skin, hair, and nail care services using the latest technology including lasers, dermoscopy, and advanced cosmetic procedures.

Our dermatologists are experienced in treating medical, surgical, and cosmetic skin conditions for all age groups.

Services offered:
- Acne and Scar Treatment
- Psoriasis and Eczema Management
- Laser Hair Removal and Skin Rejuvenation
- Vitiligo Treatment
- Hair Loss (Alopecia) Treatment
- Skin Cancer Screening and Biopsy`,
  },
  "Psychiatry": {
    short: "The Psychiatry Department provides compassionate mental health care for a wide range of psychiatric conditions, offering both outpatient counselling and inpatient services.",
    full: `The Psychiatry Department provides compassionate mental health care for a wide range of psychiatric conditions, offering both outpatient counselling and inpatient services.

Our team of psychiatrists, psychologists, and counsellors work together to provide holistic mental health support.

Services offered:
- Depression and Anxiety Treatment
- Bipolar Disorder Management
- Schizophrenia and Psychosis Care
- Addiction and Substance Abuse Counselling
- Child and Adolescent Psychiatry
- Stress and Sleep Disorder Management`,
  },
};

const ALL_DEPARTMENTS = Object.keys(DEPT_INFO);

export default function DepartmentDetail() {
  const { name } = useParams();           // e.g. /departments/Cardiology
  const navigate = useNavigate();

  const deptName = decodeURIComponent(name || "");
  const info = DEPT_INFO[deptName];

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [expanded, setExpanded] = useState(false);

  // Fetch doctors for this department
  useEffect(() => {
    setLoadingDoctors(true);
    // Try receptionist endpoint first (public-ish), fall back to admin
    api
  .get("/receptionist/doctors/")
  .then((response) => {

    const all = Array.isArray(response.data)
      ? response.data
      : [];

    const filtered = all.filter(
      (d) =>
        (d.department_name || d.department || "")
          .toLowerCase()
          .includes(deptName.toLowerCase()) ||

        (d.specialization || "")
          .toLowerCase()
          .includes(deptName.toLowerCase())
    );

    setDoctors(filtered);

    if (filtered.length > 0) {
      setSelectedDoctor(filtered[0]);
    }
  })
  .catch((error) => {
    console.error("Doctor fetch error:", error);
    setDoctors([]);
  })
  .finally(() => {
    setLoadingDoctors(false);
  });
  }, [deptName]);

  // If department not found in static data
  if (!info) {
    return (
      <div className="font-sans">
        <PublicNav />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-700">Department not found</h2>
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-teal-700 text-white px-6 py-3 rounded-lg"
          >
            Go Home
          </button>
        </div>
        <PublicFooter />
      </div>
    );
  }

  const displayText = expanded ? info.full : info.short;

  return (
    <div className="font-sans bg-white">
      <PublicNav />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ── Breadcrumb ─────────────────────────────────────── */}
        <div className="text-sm text-gray-400 mb-6">
          <Link to="/" className="hover:text-teal-700">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-teal-700 font-medium">{deptName}</span>
        </div>

        {/* ── Department selector ────────────────────────────── */}
        <div className="flex items-stretch mb-8 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <div className="bg-teal-700 text-white font-bold text-sm uppercase tracking-widest px-6 py-4 flex items-center">
            Select Department
          </div>
          <select
            value={deptName}
            onChange={(e) => navigate(`/departments/${encodeURIComponent(e.target.value)}`)}
            className="flex-1 px-5 py-4 text-sm text-gray-700 focus:outline-none bg-white border-0 appearance-none cursor-pointer"
          >
            <option value="">SELECT</option>
            <option value="all">ALL</option>
            {ALL_DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d.toUpperCase()}</option>
            ))}
          </select>
          <div className="flex items-center px-4 bg-white border-l border-gray-200 text-gray-400 pointer-events-none">
            ⇅
          </div>
        </div>

        {/* ── Main content + doctor sidebar ──────────────────── */}
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Left — description */}
          <div className="flex-1 min-w-0">
            <h1
              className="text-3xl font-bold text-gray-800 mb-5"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {deptName}
            </h1>

            <div className="text-gray-600 leading-relaxed text-[15px] space-y-3 whitespace-pre-line">
              {displayText}
            </div>

            {info.full !== info.short && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-4 text-red-600 font-semibold text-sm hover:text-red-700 transition-colors"
              >
                {expanded ? "Show less ↑" : "Read more →"}
              </button>
            )}

            {/* ── Doctor detail panel (desktop only) ── */}
            {selectedDoctor && (
              <div className="mt-10 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  {/* Avatar */}
                  <div className="w-32 h-32 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200 text-gray-400 text-sm font-medium">
                    {selectedDoctor.image ? (
                      <img
                        src={`http://127.0.0.1:8000${selectedDoctor.image}`}
                        alt={selectedDoctor.username}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      "NO IMAGE"
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3
                      className="text-2xl font-bold text-gray-800 mb-1"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Dr. {selectedDoctor.username}
                    </h3>

                    {selectedDoctor.qualification && (
                      <p className="text-gray-500 text-sm mb-1">
                        {selectedDoctor.qualification}
                      </p>
                    )}

                    {selectedDoctor.specialization && (
                      <p className="text-gray-500 text-sm mb-3">
                        {selectedDoctor.specialization}
                      </p>
                    )}

                    <Link
                      to="/login"
                      className="inline-block bg-teal-700 hover:bg-teal-800 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all mb-4"
                    >
                      Consult a Doctor
                    </Link>

                    {selectedDoctor.years_of_experience > 0 && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Experienced specialist with {selectedDoctor.years_of_experience}+ years
                        in {selectedDoctor.specialization || deptName} at Care Hospital,
                        dedicated to delivering exceptional patient care.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right — doctor sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {loadingDoctors ? (
                <div className="p-6 text-gray-400 text-sm text-center">
                  Loading doctors...
                </div>
              ) : doctors.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="text-3xl mb-2">👨‍⚕️</div>
                  <p className="text-gray-400 text-sm">No doctors listed yet</p>
                  <Link
                    to="/login"
                    className="mt-4 inline-block bg-teal-700 text-white px-5 py-2 rounded-lg text-sm font-medium"
                  >
                    Book Appointment
                  </Link>
                </div>
              ) : (
                <>
                  {doctors.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDoctor(doc)}
                      className={`w-full text-left px-5 py-4 border-b border-gray-100 last:border-0 transition-all flex items-center justify-between ${
                        selectedDoctor?.id === doc.id
                          ? "bg-teal-700 text-white"
                          : "hover:bg-gray-50 text-gray-800"
                      }`}
                    >
                      <span className="font-medium text-sm">
                        Dr. {doc.username}
                      </span>
                      {selectedDoctor?.id === doc.id && (
                        <span className="text-white text-xs">▶</span>
                      )}
                    </button>
                  ))}
                </>
              )}
            </div>

            {/* Book appointment card */}
            <div className="mt-5 bg-teal-700 rounded-xl p-5 text-white text-center">
              <div className="text-3xl mb-2">📅</div>
              <p className="font-semibold mb-1 text-sm">Need an Appointment?</p>
              <p className="text-teal-200 text-xs mb-4">
                Book online or call us anytime
              </p>
              <Link
                to="/login"
                className="block bg-white text-teal-700 font-semibold text-sm py-2.5 rounded-lg hover:bg-teal-50 transition-all"
              >
                Make Appointment
              </Link>
              <a
                href="tel:04953069000"
                className="block mt-2 border border-white/40 text-white text-sm py-2.5 rounded-lg hover:bg-white/10 transition-all"
              >
                📞 0495 3069000
              </a>
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}


// ── Shared public nav ─────────────────────────────────────────────────────────
function PublicNav() {
  const navigate = useNavigate();
  const [deptOpen, setDeptOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow ${scrolled ? "shadow-lg" : "shadow-sm"}`}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex flex-col">
          <span className="text-2xl font-bold text-teal-700" style={{ fontFamily: "Georgia, serif" }}>
            Care Hospital
          </span>
          <span className="text-[9px] tracking-[3px] text-gray-400 uppercase">Multispeciality</span>
        </Link>

        <nav className="hidden lg:flex items-center text-sm font-medium text-gray-700">
          <Link to="/" className="px-3 py-5 hover:text-teal-700 border-b-2 border-transparent hover:border-teal-700 transition-all">Home</Link>
          <a href="#" className="px-3 py-5 hover:text-teal-700 border-b-2 border-transparent hover:border-teal-700 transition-all">About Us</a>

          <div className="relative" onMouseEnter={() => setDeptOpen(true)} onMouseLeave={() => setDeptOpen(false)}>
            <button className="px-3 py-5 hover:text-teal-700 border-b-2 border-transparent hover:border-teal-700 transition-all flex items-center gap-1">
              Specialist <span className="text-[10px]">▾</span>
            </button>
            {deptOpen && (
              <div className="absolute top-full left-0 w-56 bg-white shadow-2xl border-t-4 border-teal-600 z-50 py-2 max-h-80 overflow-y-auto">
                {Object.keys(DEPT_INFO).map((d) => (
                  <Link
                    key={d}
                    to={`/departments/${encodeURIComponent(d)}`}
                    className="block px-5 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                  >
                    {d}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <a href="#" className="px-3 py-5 hover:text-teal-700 border-b-2 border-transparent hover:border-teal-700 transition-all">Contact us</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden md:block border-2 border-teal-700 text-teal-700 hover:bg-teal-700 hover:text-white px-5 py-2 rounded text-sm font-semibold transition-all"
          >
            Login
          </Link>
          <Link to="/login">
            <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 text-sm font-bold rounded transition-all">
              Make Appointment
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}


// ── Shared public footer ──────────────────────────────────────────────────────
function PublicFooter() {
  return (
    <footer className="bg-teal-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between gap-8">
        <div>
          <div className="text-xl font-bold mb-1" style={{ fontFamily: "Georgia, serif" }}>Care Hospital</div>
          <div className="text-[10px] tracking-[3px] text-teal-400 uppercase mb-4">Multispeciality</div>
          <p className="text-sm text-teal-300 leading-relaxed max-w-xs">
            Committed to delivering world-class healthcare with compassion and excellence.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-teal-700">Departments</h4>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1">
            {Object.keys(DEPT_INFO).map((d) => (
              <Link key={d} to={`/departments/${encodeURIComponent(d)}`} className="text-sm text-teal-300 hover:text-white transition-colors">
                {d}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-teal-700">Contact</h4>
          <p className="text-sm text-teal-300">NH Bypass Junction,</p>
          <p className="text-sm text-teal-300">Kozhikode, Kerala – 673 017</p>
          <a href="tel:04953069000" className="block mt-2 text-sm text-teal-300 hover:text-white">📞 0495 3069000</a>
          <a href="mailto:info@hospital.com" className="block mt-1 text-sm text-teal-300 hover:text-white">✉ info@hospital.com</a>
        </div>
      </div>
      <div className="border-t border-teal-800 text-center text-xs text-teal-500 py-4">
        © 2026 Care Hospital Healthcare. All rights reserved.
      </div>
    </footer>
  );
}
