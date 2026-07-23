import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";
import Footer from "../components/Footer";

import webDevelopment from "../assets/web-development.jpg";
import graphicDesign from "../assets/graphic-design.jpg";
import digitalMarketing from "../assets/digital-marketing.jpg";
import writing from "../assets/writing.jpg";
import videoEditing from "../assets/video-editing.jpg";
import appDevelopment from "../assets/app-development.jpg";

const categories = [
  {
    title: "Web Development",
    description:
      "Build modern websites and full-stack applications.",
    image: webDevelopment,
    gigs: 1520,
    color: "from-blue-600 to-cyan-500",
  },
  {
    title: "Graphic Design",
    description:
      "Creative logo, branding and UI/UX design services.",
    image: graphicDesign,
    gigs: 940,
    color: "from-pink-600 to-rose-500",
  },
  {
    title: "Digital Marketing",
    description:
      "Grow your business with SEO and social media marketing.",
    image: digitalMarketing,
    gigs: 760,
    color: "from-green-600 to-emerald-500",
  },
  {
    title: "Content Writing",
    description:
      "Professional blogs, articles and copywriting.",
    image: writing,
    gigs: 620,
    color: "from-orange-500 to-yellow-500",
  },
  {
    title: "Video Editing",
    description:
      "Professional editing for YouTube and social media.",
    image: videoEditing,
    gigs: 510,
    color: "from-purple-600 to-indigo-500",
  },
  {
    title: "App Development",
    description:
      "Android, iOS and cross-platform mobile apps.",
    image: appDevelopment,
    gigs: 880,
    color: "from-sky-600 to-blue-700",
  },
];

const Home = () => {
  return (
    <>
      <Navbar />

      <Hero />

      {/* Featured Categories */}

      <section className="bg-gray-50 py-20">
        <div className="w-full px-10">

          <div className="text-center">

            <h2 className="text-4xl font-bold text-gray-900">
              Explore Popular Categories
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Discover thousands of professional services from talented
              freelancers around the world.
            </p>

          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                title={category.title}
                description={category.description}
                image={category.image}
                gigs={category.gigs}
                color={category.color}
              />
            ))}

          </div>

        </div>
      </section>

      {/* Why Choose Us */}

      <section className="bg-white py-20">

        <div className="w-full px-10">

          <div className="grid gap-10 md:grid-cols-3">

            <div className="rounded-3xl bg-blue-50 p-8 shadow-sm">

              <h3 className="text-2xl font-bold text-blue-700">
                Verified Freelancers
              </h3>

              <p className="mt-4 text-gray-600">
                Hire trusted professionals with verified profiles,
                ratings and reviews.
              </p>

            </div>

            <div className="rounded-3xl bg-green-50 p-8 shadow-sm">

              <h3 className="text-2xl font-bold text-green-700">
                Secure Payments
              </h3>

              <p className="mt-4 text-gray-600">
                Every payment is encrypted and protected for both
                buyers and sellers.
              </p>

            </div>

            <div className="rounded-3xl bg-purple-50 p-8 shadow-sm">

              <h3 className="text-2xl font-bold text-purple-700">
                24/7 Support
              </h3>

              <p className="mt-4 text-gray-600">
                Our support team is available anytime to help you.
              </p>

            </div>

          </div>

        </div>

      </section>

      <Footer />
    </>
  );
};

export default Home;