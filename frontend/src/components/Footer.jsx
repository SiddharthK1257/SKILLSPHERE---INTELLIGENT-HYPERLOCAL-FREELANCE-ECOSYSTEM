import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaGithub,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaPaperPlane,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative mt-24 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-gray-300">

      {/* Background Blur */}

      <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl"></div>

      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl"></div>

      <div className="relative">

        {/* ================= Stats ================= */}

        <div className="border-b border-white/10">

          <div className="grid w-full grid-cols-2 gap-6 px-10 py-10 md:grid-cols-4">

            <div className="text-center">

              <h2 className="text-4xl font-bold text-white">
                50K+
              </h2>

              <p className="mt-2 text-gray-400">
                Freelancers
              </p>

            </div>

            <div className="text-center">

              <h2 className="text-4xl font-bold text-cyan-400">
                25K+
              </h2>

              <p className="mt-2 text-gray-400">
                Clients
              </p>

            </div>

            <div className="text-center">

              <h2 className="text-4xl font-bold text-blue-400">
                120K+
              </h2>

              <p className="mt-2 text-gray-400">
                Projects
              </p>

            </div>

            <div className="text-center">

              <h2 className="text-4xl font-bold text-green-400">
                ₹10Cr+
              </h2>

              <p className="mt-2 text-gray-400">
                Paid to Freelancers
              </p>

            </div>

          </div>

        </div>

        {/* ================= Main Footer ================= */}

        <div className="grid w-full gap-14 px-10 py-16 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}

          <div>

            <h1 className="text-4xl font-extrabold text-white">

              Skill

              <span className="text-blue-500">
                Sphere
              </span>

            </h1>

            <p className="mt-6 leading-8 text-gray-400">

              SkillSphere is India's next-generation freelance marketplace,
              connecting talented professionals with businesses worldwide.

              Find work, hire experts, collaborate securely and grow together.

            </p>

            <div className="mt-8 flex gap-4">

              {[
                {
                  icon: <FaFacebookF />,
                  color: "hover:bg-blue-600",
                  link: "https://facebook.com",
                },
                {
                  icon: <FaTwitter />,
                  color: "hover:bg-sky-500",
                  link: "https://twitter.com",
                },
                {
                  icon: <FaInstagram />,
                  color: "hover:bg-pink-600",
                  link: "https://instagram.com",
                },
                {
                  icon: <FaLinkedinIn />,
                  color: "hover:bg-blue-700",
                  link: "https://linkedin.com",
                },
                {
                  icon: <FaGithub />,
                  color: "hover:bg-gray-700",
                  link: "https://github.com",
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noreferrer"
                  className={`rounded-full bg-white/10 p-3 text-xl transition-all duration-300 hover:scale-110 ${social.color}`}
                >
                  {social.icon}
                </a>
              ))}

            </div>

          </div>

          {/* Quick Links */}

          <div>

            <h2 className="mb-8 text-2xl font-bold text-white">
              Quick Links
            </h2>

            <div className="space-y-4">

              {[
                ["Home", "/"],
                ["Browse Gigs", "/browse-gigs"],
                ["Dashboard", "/dashboard"],
                ["My Gigs", "/my-gigs"],
                ["Profile", "/profile"],
                ["AI Match", "/ai-recommendations"],
                ["Chat", "/chat"],
                ["Payments", "/payments"],
              ].map(([title, link]) => (
                <Link
                  key={title}
                  to={link}
                  className="block transition hover:translate-x-2 hover:text-blue-400"
                >
                  {title}
                </Link>
              ))}

            </div>

          </div>

          {/* Categories */}

          <div>

            <h2 className="mb-8 text-2xl font-bold text-white">
              Categories
            </h2>

            <div className="space-y-4">

              {[
                "Web Development",
                "App Development",
                "Graphic Design",
                "UI / UX Design",
                "AI & Machine Learning",
                "Digital Marketing",
                "Content Writing",
                "Video Editing",
              ].map((category) => (
                <p
                  key={category}
                  className="cursor-pointer transition hover:text-cyan-400"
                >
                  {category}
                </p>
              ))}

            </div>

          </div>

          {/* Contact */}

          <div>

            <h2 className="mb-8 text-2xl font-bold text-white">
              Contact
            </h2>

            <div className="space-y-6">

              <div className="flex gap-4">

                <FaMapMarkerAlt className="mt-1 text-blue-400" />

                <p>
                  Bangalore,
                  <br />
                  Karnataka, India
                </p>

              </div>

              <div className="flex gap-4">

                <FaPhoneAlt className="text-blue-400" />

                <p>+91 9876543210</p>

              </div>

              <div className="flex gap-4">

                <FaEnvelope className="text-blue-400" />

                <p>support@skillsphere.com</p>

              </div>

            </div>

            {/* Newsletter */}

            <div className="mt-10">

              <h3 className="mb-4 font-semibold text-white">
                Subscribe Newsletter
              </h3>

              <div className="flex overflow-hidden rounded-xl bg-white">

                <input
                  type="email"
                  placeholder="Email Address"
                  className="flex-1 px-4 py-3 text-black outline-none"
                />

                <button className="bg-blue-600 px-5 text-white transition hover:bg-blue-700">

                  <FaPaperPlane />

                </button>

              </div>

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div className="border-t border-white/10">

          <div className="flex w-full flex-col items-center justify-between gap-5 px-10 py-8 text-sm md:flex-row">

            <p className="text-gray-400">

              © {new Date().getFullYear()}{" "}

              <span className="font-semibold text-white">
                SkillSphere
              </span>

              . All Rights Reserved.

            </p>

            <div className="flex flex-wrap items-center gap-8">

              <Link
                to="/privacy"
                className="hover:text-blue-400"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="hover:text-blue-400"
              >
                Terms & Conditions
              </Link>

              <Link
                to="/help"
                className="hover:text-blue-400"
              >
                Help Center
              </Link>

              <Link
                to="/contact"
                className="hover:text-blue-400"
              >
                Contact
              </Link>

            </div>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;