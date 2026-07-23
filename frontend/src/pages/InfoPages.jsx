import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const PrivacyPolicy = () => (
  <>
    <Navbar />
    <div className="min-h-screen bg-slate-50 py-16 px-6 lg:px-20 max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Privacy Policy</h1>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-6 text-slate-700 leading-relaxed">
        <p>At SkillSphere, we prioritize the protection and confidentiality of your personal information.</p>
        <h2 className="text-2xl font-bold text-slate-900">1. Information We Collect</h2>
        <p>We collect information you provide directly to us when creating an account, posting gigs, submitting proposals, or communicating with users.</p>
        <h2 className="text-2xl font-bold text-slate-900">2. How We Use Information</h2>
        <p>Your data is used to facilitate marketplace transactions, power our AI matching algorithm, process payments, and improve platform security.</p>
        <h2 className="text-2xl font-bold text-slate-900">3. Data Protection & Escrow Security</h2>
        <p>All sensitive transactions and communications are encrypted to ensure financial and data integrity.</p>
      </div>
    </div>
    <Footer />
  </>
);

export const TermsConditions = () => (
  <>
    <Navbar />
    <div className="min-h-screen bg-slate-50 py-16 px-6 lg:px-20 max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Terms & Conditions</h1>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 space-y-6 text-slate-700 leading-relaxed">
        <p>Welcome to SkillSphere. By using our platform, you agree to comply with the following terms and conditions.</p>
        <h2 className="text-2xl font-bold text-slate-900">1. User Accounts</h2>
        <p>Users must provide accurate account information and maintain security over their credentials.</p>
        <h2 className="text-2xl font-bold text-slate-900">2. Freelance Contracts & Payments</h2>
        <p>Clients and freelancers agree to fulfill contract obligations. Funds held in escrow are released upon milestone completion.</p>
        <h2 className="text-2xl font-bold text-slate-900">3. Conduct & Safety</h2>
        <p>Harassment, fraudulent activity, or off-platform payment attempts are strictly prohibited and subject to suspension.</p>
      </div>
    </div>
    <Footer />
  </>
);

export const HelpCenter = () => (
  <>
    <Navbar />
    <div className="min-h-screen bg-slate-50 py-16 px-6 lg:px-20 max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Help Center & FAQ</h1>
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">How does AI matching work?</h2>
          <p className="mt-2 text-slate-600">Our AI analyzes job requirements, freelancer skills, and ratings to connect clients with ideal candidates instantly.</p>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">How are payments protected?</h2>
          <p className="mt-2 text-slate-600">Payments are safely stored in escrow until the client reviews and approves the completed project work.</p>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">How do I get started as a freelancer?</h2>
          <p className="mt-2 text-slate-600">Register as a freelancer, complete your profile, publish your first gig, or submit proposals directly to active projects.</p>
        </div>
      </div>
    </div>
    <Footer />
  </>
);

export const ContactUs = () => (
  <>
    <Navbar />
    <div className="min-h-screen bg-slate-50 py-16 px-6 lg:px-20 max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Contact Us</h1>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 max-w-2xl">
        <p className="text-slate-600 mb-6">Have questions or need assistance? Reach out to our support team.</p>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Thank you! Your message has been sent."); }}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
            <input type="text" required className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:border-blue-500" placeholder="Your Full Name" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input type="email" required className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:border-blue-500" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Message</label>
            <textarea rows="4" required className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:border-blue-500" placeholder="How can we help you?"></textarea>
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition">Send Message</button>
        </form>
      </div>
    </div>
    <Footer />
  </>
);
