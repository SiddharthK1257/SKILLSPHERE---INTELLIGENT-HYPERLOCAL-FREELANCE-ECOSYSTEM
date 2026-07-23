import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

/* ============================================================
   INITIAL STATES
============================================================ */

const initialProfile = {
  name: "",
  headline: "",
  bio: "",
  phone: "",
  location: "",
  country: "",
  city: "",
  website: "",
  github: "",
  linkedin: "",
  portfolioWebsite: "",
  resume: "",
  profileImage: "",
  coverImage: "",

  jobTitle: "",
  preferredJob: "",
  preferredCategory: "",
  preferredJobType: "",
  experience: 0,
  education: "",
  expectedSalary: 0,
  availability: "",
  openToWork: true,
  timezone: "",

  skills: [],
  languages: [],
  softSkills: [],
  preferredTechnologies: [],
  interests: [],

  portfolio: [],
  workExperience: [],
  certifications: [],
  weeklyAvailability: [],

  pricing: {
    hourlyRate: 0,
    milestoneRate: 0,
    currency: "INR",
    negotiable: true,
  },

  verification: {},
  aiProfile: {},
};

const initialProject = {
  title: "",
  description: "",
  image: "",
  projectUrl: "",
  githubUrl: "",
  technologies: "",
  featured: false,
};

const initialExperience = {
  company: "",
  position: "",
  location: "",
  employmentType: "Full Time",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  description: "",
};

const initialCertificate = {
  title: "",
  issuer: "",
  issueDate: "",
  expiryDate: "",
  credentialId: "",
  credentialUrl: "",
};

/* ============================================================
   REUSABLE INPUT COMPONENT
============================================================ */

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  disabled = false,
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}

      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
      />
    </div>
  );
};

/* ============================================================
   SECTION COMPONENT
============================================================ */

const Section = ({ title, description, children }) => {
  return (
    <section className="mb-12">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {title}
        </h2>

        {description && (
          <p className="text-gray-500 mt-1">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
};

/* ============================================================
   TAG INPUT
============================================================ */

const TagInput = ({
  label,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>

      <input
        type="text"
        value={Array.isArray(value) ? value.join(", ") : value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
      />

      {Array.isArray(value) && value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {value.map((item, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

/* ============================================================
   MAIN PROFILE COMPONENT
============================================================ */

const Profile = () => {
  const [profile, setProfile] = useState(initialProfile);

  const [project, setProject] =
    useState(initialProject);

  const [experienceForm, setExperienceForm] =
    useState(initialExperience);

  const [certificate, setCertificate] =
    useState(initialCertificate);

  const [fetchLoading, setFetchLoading] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [aiLoading, setAiLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [aiRecommendation, setAiRecommendation] =
    useState("");

  /* ============================================================
     HELPERS
  ============================================================ */

  const showMessage = (text) => {
    setMessage(text);
    setError("");

    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const showError = (err, fallback) => {
    console.error(err);

    setError(
      err.response?.data?.message ||
        fallback
    );

    setMessage("");
  };

  const convertToArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (!value) {
    return [];
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

  /* ============================================================
     FETCH PROFILE
  ============================================================ */

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setFetchLoading(true);

      const { data } =
        await API.get("/users/profile");

      const user = data.user;

      setProfile({
        ...initialProfile,
        ...user,

        skills: user.skills || [],
        languages: user.languages || [],
        softSkills: user.softSkills || [],
        preferredTechnologies:
          user.preferredTechnologies || [],
        interests: user.interests || [],

        portfolio: user.portfolio || [],
        workExperience:
          user.workExperience || [],
        certifications:
          user.certifications || [],
        weeklyAvailability:
          user.weeklyAvailability || [],

        pricing: {
          ...initialProfile.pricing,
          ...(user.pricing || {}),
        },
      });
    } catch (err) {
      showError(
        err,
        "Unable to fetch profile."
      );
    } finally {
      setFetchLoading(false);
    }
  };

  /* ============================================================
     PROFILE CHANGE
  ============================================================ */

  const handleChange = (e) => {
    const {
      name,
      value,
      checked,
      type,
    } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* ============================================================
     UPDATE PROFILE
  ============================================================ */

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const payload = {
        ...profile,

        experience: Number(
          profile.experience || 0
        ),

        expectedSalary: Number(
          profile.expectedSalary || 0
        ),

        skills: convertToArray(
          profile.skills
        ),

        languages: convertToArray(
          profile.languages
        ),

        softSkills: convertToArray(
          profile.softSkills
        ),

        preferredTechnologies:
          convertToArray(
            profile.preferredTechnologies
          ),

        interests: convertToArray(
          profile.interests
        ),

        weeklyAvailability:
          convertToArray(
            profile.weeklyAvailability
          ),
      };

      const { data } =
        await API.put(
          "/users/profile",
          payload
        );

      setProfile((prev) => ({
        ...prev,
        ...data.user,
      }));

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      showMessage(
        data.message ||
          "Profile updated successfully."
      );
    } catch (err) {
      showError(
        err,
        "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     NESTED PRICING CHANGE
  ============================================================ */

  const handlePricingChange = (e) => {
    const {
      name,
      value,
      checked,
      type,
    } = e.target;

    setProfile((prev) => ({
      ...prev,

      pricing: {
        ...prev.pricing,

        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
            ? Number(value)
            : value,
      },
    }));
  };

  /* ============================================================
     PORTFOLIO
  ============================================================ */

  const handleProjectChange = (e) => {
    const {
      name,
      value,
      checked,
      type,
    } = e.target;

    setProject((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const addPortfolioProject = async (e) => {
    e.preventDefault();

    try {
      setActionLoading(true);

      await API.post(
        "/users/portfolio",
        {
          ...project,

          technologies:
            convertToArray(
              project.technologies
            ),
        }
      );

      setProject(initialProject);

      await fetchProfile();

      showMessage(
        "Portfolio project added successfully."
      );
    } catch (err) {
      showError(
        err,
        "Unable to add portfolio project."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const deletePortfolioProject = async (
    index
  ) => {
    try {
      setActionLoading(true);

      await API.delete(
        `/users/portfolio/${index}`
      );

      await fetchProfile();

      showMessage(
        "Portfolio project deleted."
      );
    } catch (err) {
      showError(
        err,
        "Unable to delete project."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* ============================================================
     EXPERIENCE
  ============================================================ */

  const handleExperienceChange = (e) => {
    const {
      name,
      value,
      checked,
      type,
    } = e.target;

    setExperienceForm((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const addExperience = async (e) => {
    e.preventDefault();

    try {
      setActionLoading(true);

      await API.post(
        "/users/experience",
        experienceForm
      );

      setExperienceForm(
        initialExperience
      );

      await fetchProfile();

      showMessage(
        "Work experience added successfully."
      );
    } catch (err) {
      showError(
        err,
        "Unable to add experience."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const deleteExperience = async (
    index
  ) => {
    try {
      setActionLoading(true);

      await API.delete(
        `/users/experience/${index}`
      );

      await fetchProfile();

      showMessage(
        "Work experience deleted."
      );
    } catch (err) {
      showError(
        err,
        "Unable to delete experience."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* ============================================================
     CERTIFICATIONS
  ============================================================ */

  const handleCertificateChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setCertificate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addCertificate = async (e) => {
    e.preventDefault();

    try {
      setActionLoading(true);

      await API.post(
        "/users/certifications",
        certificate
      );

      setCertificate(
        initialCertificate
      );

      await fetchProfile();

      showMessage(
        "Certification added successfully."
      );
    } catch (err) {
      showError(
        err,
        "Unable to add certification."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const deleteCertificate = async (
    index
  ) => {
    try {
      setActionLoading(true);

      await API.delete(
        `/users/certifications/${index}`
      );

      await fetchProfile();

      showMessage(
        "Certification deleted."
      );
    } catch (err) {
      showError(
        err,
        "Unable to delete certification."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* ============================================================
     AI PROFILE INSIGHT
  ============================================================ */

  const generateAIInsight = async () => {
    try {
      setAiLoading(true);
      setAiRecommendation("");

      const { data } =
        await API.get(
          "/ai/profile-summary"
        );

      setAiRecommendation(
        data.summary
      );
    } catch (err) {
      setAiRecommendation(
        "AI recommendation service is currently unavailable."
      );
    } finally {
      setAiLoading(false);
    }
  };

  /* ============================================================
     LOADING
  ============================================================ */

  if (fetchLoading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  /* ============================================================
     UI
  ============================================================ */

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-[1600px] mx-auto">

          {/* HEADER */}

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              My Profile
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your professional profile,
              skills, portfolio and career information.
            </p>
          </div>

          {/* ALERTS */}

          {message && (
            <div className="mb-6 bg-green-100 border border-green-300 text-green-800 px-5 py-4 rounded-xl">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-100 border border-red-300 text-red-800 px-5 py-4 rounded-xl">
              {error}
            </div>
          )}

          {/* MAIN PROFILE FORM */}

          <form
            onSubmit={updateProfile}
            className="bg-white rounded-2xl shadow-lg p-8"
          >

            {/* ====================================================
                BASIC INFORMATION
            ==================================================== */}

            <Section
              title="Basic Information"
              description="Tell clients and recruiters about yourself."
            >
              <div className="grid md:grid-cols-2 gap-6">

                <Input
                  label="Full Name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Professional Headline"
                  name="headline"
                  value={profile.headline}
                  onChange={handleChange}
                  placeholder="Full Stack Developer"
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bio
                  </label>

                  <textarea
                    name="bio"
                    value={profile.bio || ""}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell people about yourself..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <Input
                  label="Phone"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                />

                <Input
                  label="Location"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  placeholder="Bangalore, India"
                />

                <Input
                  label="Country"
                  name="country"
                  value={profile.country}
                  onChange={handleChange}
                />

                <Input
                  label="City"
                  name="city"
                  value={profile.city}
                  onChange={handleChange}
                />

                <Input
                  label="Timezone"
                  name="timezone"
                  value={profile.timezone}
                  onChange={handleChange}
                  placeholder="Asia/Kolkata"
                />
              </div>
            </Section>

            {/* ====================================================
                PROFESSIONAL INFORMATION
            ==================================================== */}

            <Section
              title="Professional Information"
              description="Improve your professional profile visibility."
            >
              <div className="grid md:grid-cols-2 gap-6">

                <Input
                  label="Job Title"
                  name="jobTitle"
                  value={profile.jobTitle}
                  onChange={handleChange}
                  placeholder="Frontend Developer"
                />

                <Input
                  label="Preferred Job"
                  name="preferredJob"
                  value={profile.preferredJob}
                  onChange={handleChange}
                  placeholder="Remote React Developer"
                />

                <Input
                  label="Preferred Category"
                  name="preferredCategory"
                  value={profile.preferredCategory}
                  onChange={handleChange}
                  placeholder="Web Development"
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Job Type
                  </label>

                  <select
                    name="preferredJobType"
                    value={
                      profile.preferredJobType ||
                      ""
                    }
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  >
                    <option value="">
                      Select Job Type
                    </option>
                    <option value="Remote">
                      Remote
                    </option>
                    <option value="Hybrid">
                      Hybrid
                    </option>
                    <option value="On-site">
                      On-site
                    </option>
                  </select>
                </div>

                <Input
                  label="Experience (Years)"
                  name="experience"
                  type="number"
                  value={profile.experience}
                  onChange={handleChange}
                  min="0"
                />

                <Input
                  label="Expected Salary"
                  name="expectedSalary"
                  type="number"
                  value={profile.expectedSalary}
                  onChange={handleChange}
                  min="0"
                />

                <Input
                  label="Availability"
                  name="availability"
                  value={profile.availability}
                  onChange={handleChange}
                  placeholder="Available immediately"
                />

                <div className="flex items-center gap-3 mt-8">
                  <input
                    type="checkbox"
                    name="openToWork"
                    checked={
                      profile.openToWork || false
                    }
                    onChange={handleChange}
                    className="w-5 h-5"
                  />

                  <label className="font-medium">
                    Open to Work
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Education
                  </label>

                  <textarea
                    name="education"
                    value={
                      profile.education || ""
                    }
                    onChange={handleChange}
                    rows={4}
                    placeholder="BCA in Artificial Intelligence and Deep Learning"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>
              </div>
            </Section>

            {/* ====================================================
                SOCIAL LINKS
            ==================================================== */}

            <Section title="Social & Online Presence">
              <div className="grid md:grid-cols-2 gap-6">

                <Input
                  label="Website"
                  name="website"
                  type="url"
                  value={profile.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />

                <Input
                  label="GitHub"
                  name="github"
                  type="url"
                  value={profile.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                />

                <Input
                  label="LinkedIn"
                  name="linkedin"
                  type="url"
                  value={profile.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                />

                <Input
                  label="Portfolio Website"
                  name="portfolioWebsite"
                  type="url"
                  value={profile.portfolioWebsite}
                  onChange={handleChange}
                />

                <Input
                  label="Resume URL"
                  name="resume"
                  type="url"
                  value={profile.resume}
                  onChange={handleChange}
                />
              </div>
            </Section>

            {/* ====================================================
                SKILLS
            ==================================================== */}

            <Section
              title="Skills & Interests"
              description="Use commas to separate multiple values."
            >
              <div className="grid md:grid-cols-2 gap-6">

                <TagInput
                  label="Technical Skills"
                  value={profile.skills}
                  onChange={(value) =>
                    setProfile((prev) => ({
                      ...prev,
                      skills: value,
                    }))
                  }
                  placeholder="React, Node.js, MongoDB"
                />

                <TagInput
                  label="Languages"
                  value={profile.languages}
                  onChange={(value) =>
                    setProfile((prev) => ({
                      ...prev,
                      languages: value,
                    }))
                  }
                  placeholder="English, Hindi"
                />

                <TagInput
                  label="Soft Skills"
                  value={profile.softSkills}
                  onChange={(value) =>
                    setProfile((prev) => ({
                      ...prev,
                      softSkills: value,
                    }))
                  }
                  placeholder="Communication, Leadership"
                />

                <TagInput
                  label="Preferred Technologies"
                  value={
                    profile.preferredTechnologies
                  }
                  onChange={(value) =>
                    setProfile((prev) => ({
                      ...prev,
                      preferredTechnologies:
                        value,
                    }))
                  }
                  placeholder="React, Next.js, Node.js"
                />

                <div className="md:col-span-2">
                  <TagInput
                    label="Interests"
                    value={profile.interests}
                    onChange={(value) =>
                      setProfile((prev) => ({
                        ...prev,
                        interests: value,
                      }))
                    }
                    placeholder="AI, Open Source, Web Development"
                  />
                </div>
              </div>
            </Section>

            {/* ====================================================
                WEEKLY AVAILABILITY
            ==================================================== */}

            <Section title="Weekly Availability">
              <TagInput
                label="Availability"
                value={
                  profile.weeklyAvailability
                }
                onChange={(value) =>
                  setProfile((prev) => ({
                    ...prev,
                    weeklyAvailability:
                      value,
                  }))
                }
                placeholder="Monday: 9AM-5PM, Tuesday: 10AM-4PM"
              />
            </Section>

            {/* ====================================================
                PRICING
            ==================================================== */}

            <Section
              title="Pricing"
              description="Set your preferred freelance rates."
            >
              <div className="grid md:grid-cols-2 gap-6">

                <Input
                  label="Hourly Rate"
                  name="hourlyRate"
                  type="number"
                  value={
                    profile.pricing?.hourlyRate ||
                    0
                  }
                  onChange={handlePricingChange}
                />

                <Input
                  label="Milestone Rate"
                  name="milestoneRate"
                  type="number"
                  value={
                    profile.pricing?.milestoneRate ||
                    0
                  }
                  onChange={handlePricingChange}
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Currency
                  </label>

                  <select
                    name="currency"
                    value={
                      profile.pricing?.currency ||
                      "INR"
                    }
                    onChange={handlePricingChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  >
                    <option value="INR">
                      INR
                    </option>

                    <option value="USD">
                      USD
                    </option>

                    <option value="EUR">
                      EUR
                    </option>

                    <option value="GBP">
                      GBP
                    </option>
                  </select>
                </div>

                <div className="flex items-center gap-3 mt-8">
                  <input
                    type="checkbox"
                    name="negotiable"
                    checked={
                      profile.pricing?.negotiable ||
                      false
                    }
                    onChange={handlePricingChange}
                    className="w-5 h-5"
                  />

                  <label className="font-medium">
                    Pricing is Negotiable
                  </label>
                </div>
              </div>
            </Section>

            {/* ====================================================
                SAVE PROFILE
            ==================================================== */}

            <div className="border-t pt-8 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                {loading
                  ? "Saving Profile..."
                  : "Save Profile"}
              </button>
            </div>
          </form>

          {/* ======================================================
              PORTFOLIO
          ====================================================== */}

          <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

            <Section
              title="Portfolio Projects"
              description="Showcase your best work."
            >
              <form
                onSubmit={addPortfolioProject}
                className="grid md:grid-cols-2 gap-6"
              >

                <Input
                  label="Project Title"
                  name="title"
                  value={project.title}
                  onChange={handleProjectChange}
                  required
                />

                <Input
                  label="Project Image URL"
                  name="image"
                  value={project.image}
                  onChange={handleProjectChange}
                />

                <Input
                  label="GitHub URL"
                  name="githubUrl"
                  type="url"
                  value={project.githubUrl}
                  onChange={handleProjectChange}
                />

                <Input
                  label="Live Demo URL"
                  name="projectUrl"
                  type="url"
                  value={project.projectUrl}
                  onChange={handleProjectChange}
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={
                      project.description
                    }
                    onChange={handleProjectChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>

                <Input
                  label="Technologies"
                  name="technologies"
                  value={
                    project.technologies
                  }
                  onChange={handleProjectChange}
                  placeholder="React, Node.js, MongoDB"
                />

                <div className="flex items-center gap-3 mt-8">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={
                      project.featured
                    }
                    onChange={handleProjectChange}
                    className="w-5 h-5"
                  />

                  <label>
                    Featured Project
                  </label>
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-6 py-3 rounded-lg font-semibold"
                  >
                    {actionLoading
                      ? "Adding..."
                      : "Add Project"}
                  </button>
                </div>
              </form>
            </Section>

            {profile.portfolio?.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {profile.portfolio.map(
                  (item, index) => (
                    <div
                      key={item._id || index}
                      className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
                    >

                      <img
                        src={
                          item.image ||
                          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800"
                        }
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />

                      <div className="p-5">

                        <div className="flex justify-between gap-3">
                          <h3 className="text-xl font-bold">
                            {item.title}
                          </h3>

                          {item.featured && (
                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs h-fit">
                              Featured
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 mt-3">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-4">
                          {item.technologies?.map(
                            (tech, i) => (
                              <span
                                key={i}
                                className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                              >
                                {tech}
                              </span>
                            )
                          )}
                        </div>

                        <div className="flex gap-3 mt-5">
                          {item.githubUrl && (
                            <a
                              href={item.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-gray-900 text-white px-3 py-2 rounded"
                            >
                              GitHub
                            </a>
                          )}

                          {item.projectUrl && (
                            <a
                              href={item.projectUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-blue-600 text-white px-3 py-2 rounded"
                            >
                              Live Demo
                            </a>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            deletePortfolioProject(
                              index
                            )
                          }
                          className="w-full mt-5 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                        >
                          Delete Project
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* ======================================================
              WORK EXPERIENCE
          ====================================================== */}

          <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

            <Section
              title="Work Experience"
              description="Add your professional experience."
            >
              <form
                onSubmit={addExperience}
                className="grid md:grid-cols-2 gap-6"
              >

                <Input
                  label="Company"
                  name="company"
                  value={
                    experienceForm.company
                  }
                  onChange={
                    handleExperienceChange
                  }
                  required
                />

                <Input
                  label="Position"
                  name="position"
                  value={
                    experienceForm.position
                  }
                  onChange={
                    handleExperienceChange
                  }
                  required
                />

                <Input
                  label="Location"
                  name="location"
                  value={
                    experienceForm.location
                  }
                  onChange={
                    handleExperienceChange
                  }
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Employment Type
                  </label>

                  <select
                    name="employmentType"
                    value={
                      experienceForm.employmentType
                    }
                    onChange={
                      handleExperienceChange
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  >
                    <option>
                      Full Time
                    </option>
                    <option>
                      Part Time
                    </option>
                    <option>
                      Internship
                    </option>
                    <option>
                      Freelance
                    </option>
                    <option>
                      Contract
                    </option>
                  </select>
                </div>

                <Input
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={
                    experienceForm.startDate
                  }
                  onChange={
                    handleExperienceChange
                  }
                />

                <Input
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={
                    experienceForm.endDate
                  }
                  onChange={
                    handleExperienceChange
                  }
                  disabled={
                    experienceForm.currentlyWorking
                  }
                />

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="currentlyWorking"
                    checked={
                      experienceForm.currentlyWorking
                    }
                    onChange={
                      handleExperienceChange
                    }
                    className="w-5 h-5"
                  />

                  <label>
                    I currently work here
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={
                      experienceForm.description
                    }
                    onChange={
                      handleExperienceChange
                    }
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
                  >
                    Add Experience
                  </button>
                </div>
              </form>
            </Section>

            <div className="space-y-5">
              {profile.workExperience?.map(
                (exp, index) => (
                  <div
                    key={exp._id || index}
                    className="border rounded-xl p-6"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-xl font-bold">
                          {exp.position}
                        </h3>

                        <p className="text-blue-600 font-semibold">
                          {exp.company}
                        </p>

                        <p className="text-gray-500">
                          {exp.location}
                        </p>
                      </div>

                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full h-fit text-sm">
                        {exp.employmentType}
                      </span>
                    </div>

                    <p className="mt-4 text-gray-600">
                      {exp.startDate
                        ? new Date(
                            exp.startDate
                          ).toLocaleDateString()
                        : "N/A"}

                      {" - "}

                      {exp.currentlyWorking
                        ? "Present"
                        : exp.endDate
                        ? new Date(
                            exp.endDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>

                    <p className="mt-4 text-gray-700">
                      {exp.description}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        deleteExperience(
                          index
                        )
                      }
                      className="mt-5 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                    >
                      Delete Experience
                    </button>
                  </div>
                )
              )}
            </div>
          </div>

          {/* ======================================================
              CERTIFICATIONS
          ====================================================== */}

          <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

            <Section
              title="Certifications"
              description="Add your professional certifications."
            >
              <form
                onSubmit={addCertificate}
                className="grid md:grid-cols-2 gap-6"
              >

                <Input
                  label="Certificate Title"
                  name="title"
                  value={certificate.title}
                  onChange={
                    handleCertificateChange
                  }
                  required
                />

                <Input
                  label="Issuing Organization"
                  name="issuer"
                  value={certificate.issuer}
                  onChange={
                    handleCertificateChange
                  }
                  required
                />

                <Input
                  label="Issue Date"
                  name="issueDate"
                  type="date"
                  value={
                    certificate.issueDate
                  }
                  onChange={
                    handleCertificateChange
                  }
                />

                <Input
                  label="Expiry Date"
                  name="expiryDate"
                  type="date"
                  value={
                    certificate.expiryDate
                  }
                  onChange={
                    handleCertificateChange
                  }
                />

                <Input
                  label="Credential ID"
                  name="credentialId"
                  value={
                    certificate.credentialId
                  }
                  onChange={
                    handleCertificateChange
                  }
                />

                <Input
                  label="Credential URL"
                  name="credentialUrl"
                  type="url"
                  value={
                    certificate.credentialUrl
                  }
                  onChange={
                    handleCertificateChange
                  }
                />

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
                  >
                    Add Certification
                  </button>
                </div>
              </form>
            </Section>

            <div className="space-y-5">
              {profile.certifications?.map(
                (cert, index) => (
                  <div
                    key={cert._id || index}
                    className="border rounded-xl p-6"
                  >
                    <h3 className="text-xl font-bold">
                      {cert.title}
                    </h3>

                    <p className="text-blue-600 mt-1">
                      {cert.issuer}
                    </p>

                    <p className="text-gray-500 mt-3">
                      Issued:{" "}
                      {cert.issueDate
                        ? new Date(
                            cert.issueDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>

                    {cert.credentialId && (
                      <p className="mt-2">
                        <strong>
                          Credential ID:
                        </strong>{" "}
                        {cert.credentialId}
                      </p>
                    )}

                    {cert.credentialUrl && (
                      <a
                        href={
                          cert.credentialUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline block mt-3"
                      >
                        View Certificate
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        deleteCertificate(
                          index
                        )
                      }
                      className="mt-5 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                    >
                      Delete Certification
                    </button>
                  </div>
                )
              )}
            </div>
          </div>

          {/* ======================================================
              AI ASSISTANT
          ====================================================== */}

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl shadow-lg p-8 mt-8">

            <div className="flex flex-col md:flex-row justify-between gap-5 items-start md:items-center">

              <div>
                <h2 className="text-2xl font-bold">
                  🤖 AI Career Assistant
                </h2>

                <p className="text-gray-600 mt-2">
                  Get personalized career recommendations based on your profile.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  generateAIInsight
                }
                disabled={aiLoading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-6 py-3 rounded-lg"
              >
                {aiLoading
                  ? "Generating..."
                  : "Generate AI Insight"}
              </button>
            </div>

            {aiRecommendation && (
              <div className="bg-white rounded-xl shadow mt-6 p-6">
                <h3 className="font-bold text-lg mb-3">
                  AI Recommendation
                </h3>

                <p className="whitespace-pre-line text-gray-700 leading-7">
                  {aiRecommendation}
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </>
  );
};

export default Profile;