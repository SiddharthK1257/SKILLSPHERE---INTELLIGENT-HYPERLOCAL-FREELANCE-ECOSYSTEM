import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  /* ==========================================================
     INITIAL STATE
  ========================================================== */

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser
        ? JSON.parse(storedUser)
        : null;
    } catch (error) {
      console.error(
        "Failed to parse stored user:",
        error
      );
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  /* ==========================================================
     LOCAL STORAGE SYNC
  ========================================================== */

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(
        "token",
        token
      );
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  /* ==========================================================
     LOGIN
  ========================================================== */

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
  };

  /* ==========================================================
     LOGOUT
  ========================================================== */

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  /* ==========================================================
     UPDATE USER
  ========================================================== */

  const updateUser = (updatedData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedData,
    }));
  };

  /* ==========================================================
     AUTH STATUS
  ========================================================== */

  const isAuthenticated =
    Boolean(token) && Boolean(user);

  /* ==========================================================
     ROLE HELPERS
  ========================================================== */

  const role = user?.role || null;

  const isAdmin =
    role === "admin";

  const isClient =
    role === "client";

  const isFreelancer =
    role === "freelancer";

  /* ==========================================================
     CONTEXT VALUE
  ========================================================== */

  const value = useMemo(
    () => ({
      user,
      token,

      role,

      isAuthenticated,

      isAdmin,
      isClient,
      isFreelancer,

      login,
      logout,

      setUser,
      setToken,

      updateUser,
    }),
    [
      user,
      token,
      role,
      isAuthenticated,
      isAdmin,
      isClient,
      isFreelancer,
    ]
  );

  /* ==========================================================
     PROVIDER
  ========================================================== */

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;