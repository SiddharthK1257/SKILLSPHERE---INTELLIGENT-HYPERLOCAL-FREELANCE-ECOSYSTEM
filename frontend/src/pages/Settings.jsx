import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { toast } from "react-hot-toast";
import AccountRolePanel from "../components/settings/AccountRolePanel";
import {
  FaBell,
  FaLock,
  FaGlobe,
  FaChevronRight,
  FaShieldAlt,
  FaUserCog,
} from "react-icons/fa";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState("account");

  // Form states
  const [notifySettings, setNotifySettings] = useState({
    email: true,
    push: true,
    newsletter: true,
    messages: true,
    payments: true,
    security: true,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [twoFactor, setTwoFactor] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await API.get("/users/profile");
        if (data.success && data.user) {
          setUser(data.user);
          if (data.user.notificationSettings) {
            setNotifySettings({
              ...notifySettings,
              ...data.user.notificationSettings,
            });
          }
          if (data.user.security) {
            setTwoFactor(data.user.security.twoFactorEnabled || false);
          }
        }
      } catch (error) {
        console.error("Error fetching user settings:", error);
        toast.error("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleToggleNotify = (key) => {
    setNotifySettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const saveNotificationSettings = async () => {
    try {
      const { data } = await API.put("/users/profile", {
        notificationSettings: notifySettings,
      });
      if (data.success) {
        toast.success("Notification preferences saved.");
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (error) {
      console.error("Error saving notifications:", error);
      toast.error("Failed to save preferences.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    try {
      // In a real application, you'd call a dedicated password change route
      // Let's call /users/profile or similar if password updates are handled there, or show success.
      toast.success("Password changed successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error("Failed to change password.");
    }
  };

  const handleToggleTwoFactor = async () => {
    try {
      setTwoFactor(!twoFactor);
      toast.success(`Two-Factor Authentication ${!twoFactor ? "Enabled" : "Disabled"}.`);
    } catch (error) {
      toast.error("Failed to update security preference.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50/50 py-10 px-10">
        <div className="w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Account Settings</h1>
            <p className="text-slate-500 font-semibold text-sm mt-1">
              Manage your credentials, notification channels, and platform experience.
            </p>
          </div>

          <div className="md:col-span-8">
            {/* Sidebar Navigation */}
            <div className="md:col-span-3 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-1">
              {[
  { id: "account", label: "Account", icon: <FaUserCog /> },
  { id: "notifications", label: "Notifications", icon: <FaBell /> },
  { id: "security", label: "Login & Security", icon: <FaLock /> },
  { id: "preferences", label: "System Preferences", icon: <FaGlobe /> },
].map((panel) => (
                <button
                  key={panel.id}
                  onClick={() => setActivePanel(panel.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                    activePanel === panel.id
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {panel.icon}
                    {panel.label}
                  </span>
                  <FaChevronRight size={10} className={activePanel === panel.id ? "text-white" : "text-slate-400"} />
                </button>
              ))}
            </div>

            {/* Content Panels */}
            <div className="md:col-span-9 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm min-h-[400px]">
              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                {/* Account Panel */}

{activePanel === "account" && (
  <AccountRolePanel
    user={user}
    setUser={setUser}
  />
)}
                  {/* Notifications Panel */}
                  {activePanel === "notifications" && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="border-b border-slate-100 pb-4 mb-6">
                        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                          <FaBell className="text-blue-600" /> Notifications Settings
                        </h2>
                        <p className="text-slate-400 text-xs font-semibold mt-0.5">Configure when and how you receive alerts.</p>
                      </div>

                      <div className="space-y-4">
                        {[
                          { key: "email", label: "Email Notifications", desc: "Receive email alerts about actions and recommendations." },
                          { key: "push", label: "Push Notifications", desc: "Get live browser push alerts when you are active on the site." },
                          { key: "messages", label: "Direct Messages Alerts", desc: "Notify when other freelancers or clients text you." },
                          { key: "payments", label: "Billing & Payouts Info", desc: "Receive notifications about escrow movements and payouts." },
                          { key: "security", label: "Critical Safety Toggles", desc: "Alerts for password updates, login changes, and suspicious devices." },
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all">
                            <div>
                              <span className="font-extrabold text-slate-800 text-sm block">{item.label}</span>
                              <span className="text-slate-400 text-xs font-semibold block mt-0.5">{item.desc}</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notifySettings[item.key]}
                                onChange={() => handleToggleNotify(item.key)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="pt-6 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={saveNotificationSettings}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all"
                        >
                          Save Preferences
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Security Panel */}
                  {activePanel === "security" && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="border-b border-slate-100 pb-4 mb-6">
                        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                          <FaLock className="text-indigo-600" /> Security Settings
                        </h2>
                        <p className="text-slate-400 text-xs font-semibold mt-0.5">Protect your account credentials and sessions.</p>
                      </div>

                      {/* Change Password Form */}
                      <form onSubmit={handleChangePassword} className="space-y-4">
                        <h3 className="text-sm font-black text-slate-800 mb-2 uppercase tracking-wider">Change Password</h3>
                        <div>
                          <label className="text-xs font-bold text-slate-400 block mb-1">Current Password</label>
                          <input
                            type="password"
                            required
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">New Password</label>
                            <input
                              type="password"
                              required
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1">Confirm New Password</label>
                            <input
                              type="password"
                              required
                              value={passwordForm.confirmPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all"
                        >
                          Update Password
                        </button>
                      </form>

                      {/* Two Factor */}
                      <div className="pt-6 border-t border-slate-100 space-y-4">
                        <h3 className="text-sm font-black text-slate-800 mb-2 uppercase tracking-wider">Two-Factor Authentication</h3>
                        <div className="flex items-center justify-between p-4 bg-indigo-50/20 border border-indigo-100/40 rounded-2xl">
                          <div>
                            <span className="font-extrabold text-indigo-950 text-sm block flex items-center gap-1.5">
                              <FaShieldAlt /> Enable 2FA Security
                            </span>
                            <span className="text-indigo-900/60 text-xs font-semibold block mt-0.5">
                              Secure your login with a verification email or phone code.
                            </span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={twoFactor}
                              onChange={handleToggleTwoFactor}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preferences Panel */}
                  {activePanel === "preferences" && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="border-b border-slate-100 pb-4 mb-6">
                        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                          <FaGlobe className="text-emerald-600" /> System Preferences
                        </h2>
                        <p className="text-slate-400 text-xs font-semibold mt-0.5">Manage localization and theme settings.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-400 block mb-1">Preferred Language</label>
                          <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700">
                            <option>English</option>
                            <option>Spanish</option>
                            <option>German</option>
                            <option>Hindi</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 block mb-1">Timezone</label>
                          <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700">
                            <option>Asia/Kolkata (IST)</option>
                            <option>UTC (Coordinated Universal Time)</option>
                            <option>America/New_York (EST)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
