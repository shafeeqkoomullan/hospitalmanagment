export default function Footer() {
  return (
    <footer className="bg-teal-700 text-white mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <h3 className="text-2xl font-bold mb-4">Hospital</h3>
          <p className="text-sm leading-relaxed">
            Hospital is committed to achieving the highest level of quality
            through professionalism, innovation, and ethical practices.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>Home</li>
            <li>About Us</li>
            <li>Gallery</li>
            <li>Blog</li>
            <li>Careers</li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Departments</h4>
          <ul className="space-y-2 text-sm">
            <li>Cardiology</li>
            <li>ENT</li>
            <li>Orthopaedics</li>
            <li>Neurology</li>
            <li>General Surgery</li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Get in Touch</h4>
          <p className="text-sm">
            NH Bypass Junction<br />
            Kozhikode, Kerala<br />
            Tel: 0495 3069000
          </p>
        </div>
      </div>

      <div className="bg-red-600 text-center text-sm py-4">
        Copyright 2026 Hospital Healthcare. All rights reserved.
      </div>
    </footer>
  );
}
