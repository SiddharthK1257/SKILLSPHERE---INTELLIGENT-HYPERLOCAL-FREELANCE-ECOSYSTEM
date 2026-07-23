import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

const EditProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    headline: "",
    bio: "",
    profileImage: "",
    phone: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",
    portfolio: "",

    // Professional Information
    jobTitle: "",
    preferredJob: "",
    preferredCategory: "",
preferredJobType: "",
    experience: 0,
    education: "",
    expectedSalary: 0,
    availability: "",
    hourlyRate: 0,

    // AI Recommendation
    skills: "",
    languages: "",
    certifications: "",
    softSkills: "",
    preferredTechnologies: "",
    interests: "",
    resume: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/users/profile");

        const user = data.user;

        setFormData({
          name: user.name || "",
          headline: user.headline || "",
          bio: user.bio || "",
          profileImage: user.profileImage || "",
          phone: user.phone || "",
          location: user.location || "",
          website: user.website || "",
          github: user.github || "",
          linkedin: user.linkedin || "",
          portfolio: user.portfolio || "",

          jobTitle: user.jobTitle || "",
          preferredJob: user.preferredJob || "",

preferredCategory:
  user.preferredCategory || "",

preferredJobType:
  user.preferredJobType || "",
          experience: user.experience || 0,
          education: user.education || "",
          expectedSalary: user.expectedSalary || 0,
          availability: user.availability || "",
          hourlyRate: user.hourlyRate || 0,

          skills: user.skills?.join(", ") || "",
          languages: user.languages?.join(", ") || "",
          certifications:
            user.certifications?.join(", ") || "",
          softSkills:
            user.softSkills?.join(", ") || "",
          preferredTechnologies:
            user.preferredTechnologies?.join(", ") || "",
          interests:
            user.interests?.join(", ") || "",
          resume: user.resume || "",
        });

      } catch (err) {

        setError(
          err.response?.data?.message ||
            "Failed to load profile."
        );

      } finally {

        setFetching(false);

      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

    const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const payload = {
        ...formData,

        experience: Number(formData.experience),
        expectedSalary: Number(formData.expectedSalary),
        hourlyRate: Number(formData.hourlyRate),

        skills: formData.skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        languages: formData.languages
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        certifications: formData.certifications
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        softSkills: formData.softSkills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        preferredTechnologies: formData.preferredTechnologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        interests: formData.interests
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const { data } = await API.put(
        "/users/profile",
        payload
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setMessage("✅ Profile updated successfully.");

      setTimeout(() => {
        navigate("/profile");
      }, 1200);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to update profile."
      );

    } finally {

      setLoading(false);

    }
  };

  if (fetching) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex justify-center items-center">

          <div className="text-center">

            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>

            <h2 className="text-2xl font-bold mt-6">
              Loading Profile...
            </h2>

          </div>

        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen w-full bg-gray-100 py-10 px-5">

        <div className="w-full max-w-[1400px] mx-auto bg-white shadow-xl rounded-xl p-8">

          <h1 className="text-4xl font-bold text-center mb-8">
            Edit AI Profile
          </h1>

          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded-lg mb-5">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form
            onSubmit={submitHandler}
            className="space-y-8"
          >
            {/* ===========================
    Basic Information
=========================== */}

<div className="grid md:grid-cols-2 gap-6">

  <div>
    <label className="font-semibold">
      Full Name
    </label>

    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
      className="w-full mt-2 border rounded-lg p-3"
      placeholder="John Doe"
    />
  </div>

  <div>
    <label className="font-semibold">
      Professional Headline
    </label>

    <input
      type="text"
      name="headline"
      value={formData.headline}
      onChange={handleChange}
      className="w-full mt-2 border rounded-lg p-3"
      placeholder="Full Stack MERN Developer"
    />
  </div>

</div>

<div>

  <label className="font-semibold">
    Bio
  </label>

  <textarea
    rows={5}
    name="bio"
    value={formData.bio}
    onChange={handleChange}
    className="w-full mt-2 border rounded-lg p-3"
    placeholder="Write something about yourself..."
  />

</div>

<hr />

<h2 className="text-2xl font-bold">
  Contact Information
</h2>

<div className="grid md:grid-cols-2 gap-6">

  <div>

    <label className="font-semibold">
      Phone
    </label>

    <input
      type="text"
      name="phone"
      value={formData.phone}
      onChange={handleChange}
      className="w-full mt-2 border rounded-lg p-3"
      placeholder="+91 9876543210"
    />

  </div>

  <div>

    <label className="font-semibold">
      Location
    </label>

    <input
      type="text"
      name="location"
      value={formData.location}
      onChange={handleChange}
      className="w-full mt-2 border rounded-lg p-3"
      placeholder="Delhi, India"
    />

  </div>

</div>

<div className="grid md:grid-cols-2 gap-6">

  <div>

    <label className="font-semibold">
      Website
    </label>

    <input
      type="text"
      name="website"
      value={formData.website}
      onChange={handleChange}
      className="w-full mt-2 border rounded-lg p-3"
      placeholder="https://mysite.com"
    />

  </div>

  <div>

    <label className="font-semibold">
      Portfolio
    </label>

    <input
      type="text"
      name="portfolio"
      value={formData.portfolio}
      onChange={handleChange}
      className="w-full mt-2 border rounded-lg p-3"
      placeholder="Portfolio URL"
    />

  </div>

</div>

<div className="grid md:grid-cols-2 gap-6">

  <div>

    <label className="font-semibold">
      GitHub
    </label>

    <input
      type="text"
      name="github"
      value={formData.github}
      onChange={handleChange}
      className="w-full mt-2 border rounded-lg p-3"
      placeholder="https://github.com/username"
    />

  </div>

  <div>

    <label className="font-semibold">
      LinkedIn
    </label>

    <input
      type="text"
      name="linkedin"
      value={formData.linkedin}
      onChange={handleChange}
      className="w-full mt-2 border rounded-lg p-3"
      placeholder="https://linkedin.com/in/username"
    />

  </div>

</div>

<div>

  <label className="font-semibold">
    Profile Image URL
  </label>

  <input
    type="text"
    name="profileImage"
    value={formData.profileImage}
    onChange={handleChange}
    className="w-full mt-2 border rounded-lg p-3"
    placeholder="https://image-url.com/photo.jpg"
  />

</div>

<hr />

<h2 className="text-2xl font-bold">
  Professional Information
</h2>

{/* ===========================
    Professional Information
=========================== */}

<div className="grid md:grid-cols-2 gap-6">

  <div>
    <label className="font-semibold">
      Job Title
    </label>

    <input
      type="text"
      name="jobTitle"
      value={formData.jobTitle}
      onChange={handleChange}
      className="w-full mt-2 border rounded-lg p-3"
      placeholder="Full Stack Developer"
    />
  </div>

  <div>
    <label className="font-semibold">
      Preferred Job
    </label>

    <input
      type="text"
      name="preferredJob"
      value={formData.preferredJob}
      onChange={handleChange}
      className="w-full mt-2 border rounded-lg p-3"
      placeholder="MERN Stack Developer"
    />
  </div>

</div>

<div className="grid md:grid-cols-2 gap-6">

  <div>
    <label className="font-semibold">
      Preferred Category
    </label>

    <select
      name="preferredCategory"
      value={formData.preferredCategory}
      onChange={handleChange}
      className="w-full mt-2 border rounded-lg p-3"
    >
      <option value="">Select Category</option>
      <option>Web Development</option>
      <option>App Development</option>
      <option>UI/UX Design</option>
      <option>Graphic Design</option>
      <option>Video Editing</option>
      <option>Content Writing</option>
      <option>Digital Marketing</option>
      <option>Data Science</option>
      <option>AI & Machine Learning</option>
      <option>Cyber Security</option>
      <option>Cloud Computing</option>
      <option>DevOps</option>
      <option>Other</option>
    </select>
  </div>

  <div>
    <label className="font-semibold">
      Preferred Job Type
    </label>

    <select
      name="preferredJobType"
      value={formData.preferredJobType}
      onChange={handleChange}
      className="w-full mt-2 border rounded-lg p-3"
    >
      <option value="">Select Job Type</option>
      <option>Remote</option>
      <option>Hybrid</option>
      <option>On-site</option>
    </select>
  </div>

</div>

<div className="grid md:grid-cols-2 gap-6">

  <div>
    <label className="font-semibold">
      Experience (Years)
    </label>

    <input
      type="number"
      name="experience"
      value={formData.experience}
      onChange={handleChange}
      className="w-full mt-2 border rounded-lg p-3"
      placeholder="2"
    />
  </div>

  <div>
    <label className="font-semibold">
      Education
    </label>

    <input
      type="text"
      name="education"
      value={formData.education}
      onChange={handleChange}
      className="w-full mt-2 border rounded-lg p-3"
      placeholder="Bachelor of Computer Applications"
    />
  </div>

</div>

<div className="grid md:grid-cols-2 gap-6">

  <div>
    <label className="font-semibold">
      Expected Salary (₹)
    </label>

    <input
      type="number"
      name="expectedSalary"
      value={formData.expectedSalary}
      onChange={handleChange}
      className="w-full mt-2 border rounded-lg p-3"
      placeholder="600000"
    />
  </div>

  <div>
    <label className="font-semibold">
      Hourly Rate (₹)
    </label>

    <input
      type="number"
      name="hourlyRate"
      value={formData.hourlyRate}
      onChange={handleChange}
      className="w-full mt-2 border rounded-lg p-3"
      placeholder="1000"
    />
  </div>

</div>

<div>

  <label className="font-semibold">
    Availability
  </label>

  <select
    name="availability"
    value={formData.availability}
    onChange={handleChange}
    className="w-full mt-2 border rounded-lg p-3"
  >
    <option value="">Select Availability</option>
    <option>Immediately</option>
    <option>Within 15 Days</option>
    <option>Within 1 Month</option>
    <option>Freelance Only</option>
  </select>

</div>

<hr />

<h2 className="text-2xl font-bold">
  Skills & AI Matching
</h2>

{/* ===========================
    Skills & AI Matching
=========================== */}

<div>

  <label className="font-semibold">
    Skills
  </label>

  <input
    type="text"
    name="skills"
    value={formData.skills}
    onChange={handleChange}
    className="w-full mt-2 border rounded-lg p-3"
    placeholder="React, Node.js, MongoDB, Express"
  />

  <p className="text-sm text-gray-500 mt-1">
    Separate skills using commas.
  </p>

</div>

<div>

  <label className="font-semibold">
    Languages
  </label>

  <input
    type="text"
    name="languages"
    value={formData.languages}
    onChange={handleChange}
    className="w-full mt-2 border rounded-lg p-3"
    placeholder="English, Hindi"
  />

</div>

<div>

  <label className="font-semibold">
    Certifications
  </label>

  <input
    type="text"
    name="certifications"
    value={formData.certifications}
    onChange={handleChange}
    className="w-full mt-2 border rounded-lg p-3"
    placeholder="AWS, Google Cloud, Meta React"
  />

</div>

<div>

  <label className="font-semibold">
    Soft Skills
  </label>

  <input
    type="text"
    name="softSkills"
    value={formData.softSkills}
    onChange={handleChange}
    className="w-full mt-2 border rounded-lg p-3"
    placeholder="Leadership, Communication, Teamwork"
  />

</div>

<div>

  <label className="font-semibold">
    Preferred Technologies
  </label>

  <input
    type="text"
    name="preferredTechnologies"
    value={formData.preferredTechnologies}
    onChange={handleChange}
    className="w-full mt-2 border rounded-lg p-3"
    placeholder="React, Next.js, Node.js"
  />

</div>

<div>

  <label className="font-semibold">
    Interests
  </label>

  <input
    type="text"
    name="interests"
    value={formData.interests}
    onChange={handleChange}
    className="w-full mt-2 border rounded-lg p-3"
    placeholder="AI, Open Source, Cyber Security"
  />

</div>

<div>

  <label className="font-semibold">
    Resume URL
  </label>

  <input
    type="text"
    name="resume"
    value={formData.resume}
    onChange={handleChange}
    className="w-full mt-2 border rounded-lg p-3"
    placeholder="https://drive.google.com/..."
  />

</div>

<div className="pt-6">

  <button
    type="submit"
    disabled={loading}
    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition duration-300"
  >
    {loading ? "Updating Profile..." : "Update Profile"}
  </button>

</div>

</form>

</div>

</div>

</>

);

};

export default EditProfile;