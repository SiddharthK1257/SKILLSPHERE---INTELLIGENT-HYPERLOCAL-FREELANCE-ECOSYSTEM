import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  FaSave,
  FaCog,
  FaBell,
  FaShieldAlt,
} from "react-icons/fa";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    platformName: "SkillSphere",
    maintenanceMode: false,
    registrationEnabled: true,
    platformEmail: "",
    supportEmail: "",
    contactNumber: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        `${API}/admin/settings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setSettings({
          platformName:
            data.settings.platformName || "SkillSphere",

          maintenanceMode:
            data.settings.maintenanceMode,

          registrationEnabled:
            data.settings.registrationEnabled,

          platformEmail:
            data.settings.platformEmail || "",

          supportEmail:
            data.settings.supportEmail || "",

          contactNumber:
            data.settings.contactNumber || "",
        });
      }
    } catch (error) {
      console.error(error);
      alert("Unable to load settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const { data } = await axios.put(
        `${API}/admin/settings`,
        settings,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        alert("Settings updated successfully.");
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />

        <div className="flex flex-1 items-center justify-center">
          <h2 className="text-xl font-semibold">
            Loading Settings...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Platform Settings
        </h1>

        <p className="mt-2 text-gray-500">
          Configure your SkillSphere platform.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-8 shadow-lg">

          {/* Platform Name */}

          <div className="mb-6">

            <label className="mb-2 flex items-center gap-2 font-semibold">
              <FaCog />
              Platform Name
            </label>

            <input
              type="text"
              name="platformName"
              value={settings.platformName}
              onChange={handleChange}
              className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
            />

          </div>

          {/* Platform Email */}

          <div className="mb-6">

            <label className="mb-2 font-semibold block">
              Platform Email
            </label>

            <input
              type="email"
              name="platformEmail"
              value={settings.platformEmail}
              onChange={handleChange}
              className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
            />

          </div>

          {/* Support Email */}

          <div className="mb-6">

            <label className="mb-2 font-semibold block">
              Support Email
            </label>

            <input
              type="email"
              name="supportEmail"
              value={settings.supportEmail}
              onChange={handleChange}
              className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
            />

          </div>

          {/* Contact Number */}

          <div className="mb-8">

            <label className="mb-2 font-semibold block">
              Contact Number
            </label>

            <input
              type="text"
              name="contactNumber"
              value={settings.contactNumber}
              onChange={handleChange}
              className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
            />

          </div>

          {/* Maintenance */}

          <div className="mb-6 flex items-center justify-between rounded-xl border p-4">

            <div>

              <h3 className="flex items-center gap-2 font-semibold">
                <FaShieldAlt />
                Maintenance Mode
              </h3>

              <p className="text-sm text-gray-500">
                Disable the platform temporarily.
              </p>

            </div>

            <input
              type="checkbox"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
              className="h-5 w-5"
            />

          </div>

          {/* Registration */}

          <div className="mb-6 flex items-center justify-between rounded-xl border p-4">

            <div>

              <h3 className="font-semibold">
                User Registration
              </h3>

              <p className="text-sm text-gray-500">
                Allow new users to register.
              </p>

            </div>

            <input
              type="checkbox"
              name="registrationEnabled"
              checked={settings.registrationEnabled}
              onChange={handleChange}
              className="h-5 w-5"
            />

          </div>

          {/* Notification */}

          <div className="mb-8 rounded-xl border p-4">

            <h3 className="mb-2 flex items-center gap-2 font-semibold">
              <FaBell />
              Notifications
            </h3>

            <p className="text-sm text-gray-500">
              Email notification settings can be configured
              later.
            </p>

          </div>

          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-500"
          >
            <FaSave />

            {saving ? "Saving..." : "Save Settings"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default AdminSettings;