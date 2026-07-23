import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Navbar />

      <div className="dashboard">

        <h1>Welcome, {user?.name} 👋</h1>

        <p className="subtitle">
          Welcome back to SkillSphere
        </p>

        <div className="card-container">

          <div className="card">
            <h3>Name</h3>
            <p>{user?.name}</p>
          </div>

          <div className="card">
            <h3>Email</h3>
            <p>{user?.email}</p>
          </div>

          <div className="card">
            <h3>Role</h3>
            <p>{user?.role}</p>
          </div>

        </div>

        <div className="info-section">

          <div className="info-card">
            <h2>Profile Status</h2>

            <p>
              Your account is active and ready to
              start using SkillSphere.
            </p>
          </div>

          <div className="info-card">
  <h2>Quick Actions</h2>

  <div className="flex flex-col gap-3 mt-4">

    <Link to="/profile">
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700">
        View Profile
      </button>
    </Link>

    <Link to="/browse-gigs">
      <button className="bg-green-600 text-white px-4 py-2 rounded-lg w-full hover:bg-green-700">
        Browse Gigs
      </button>
    </Link>

    <Link to="/create-gig">
      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg w-full hover:bg-purple-700">
        Create Gig
      </button>
    </Link>
    <div className="dashboard-card">
  <Link to="/scheduler">
    <button>Open Scheduler</button>
  </Link>
</div>
<Link to="/projects">
  <button className="bg-red-500 text-white px-4 py-2 rounded-lg w-full hover:bg-red-600 transition duration-300">
    Project Tracker
  </button>
</Link>
<div className="info-card mt-6">

  <h2>📁 Project Tracker</h2>

  <p className="mt-2 text-gray-600">
    Track your project progress, deadlines, uploaded files,
    and milestone updates in one place.
  </p>

  <div className="grid grid-cols-2 gap-4 mt-5">

    <div className="bg-blue-50 rounded-lg p-4">
      <h3 className="text-2xl font-bold text-blue-600">5</h3>
      <p>Total Projects</p>
    </div>

    <div className="bg-green-50 rounded-lg p-4">
      <h3 className="text-2xl font-bold text-green-600">80%</h3>
      <p>Average Progress</p>
    </div>

    <div className="bg-yellow-50 rounded-lg p-4">
      <h3 className="text-2xl font-bold text-yellow-600">2</h3>
      <p>Pending Deadlines</p>
    </div>

    <div className="bg-red-50 rounded-lg p-4">
      <h3 className="text-2xl font-bold text-red-600">12</h3>
      <p>Files Uploaded</p>
    </div>

  </div>

  <Link to="/projects">
    <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition">
      Open Project Tracker
    </button>
  </Link>

</div>
  </div>
</div>

        </div>

      </div>
    </>
  );
};

export default Dashboard;