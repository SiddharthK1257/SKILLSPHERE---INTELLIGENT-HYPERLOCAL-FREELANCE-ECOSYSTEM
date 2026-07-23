import { Navigate, useLocation } from "react-router-dom";

/* ==========================================================
   PROTECTED ROUTE
   Supports:
   - Authentication
   - Admin-only routes
   - Freelancer-only routes
   - Client-only routes
   - Multiple roles
   - Safe user parsing
   - Suspended/deleted users
========================================================== */

const ProtectedRoute = ({
  children,

  adminOnly = false,
  freelancerOnly = false,
  clientOnly = false,

  roles = [],

  redirectTo = "/dashboard",
}) => {
  const location = useLocation();

  /* ========================================================
     GET AUTH DATA
  ======================================================== */

  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  /* ========================================================
     NOT AUTHENTICATED
  ======================================================== */

  if (!token || !userString) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname + location.search,
        }}
      />
    );
  }

  /* ========================================================
     PARSE USER
  ======================================================== */

  let user;

  try {
    user = JSON.parse(userString);
  } catch (error) {
    console.error("Invalid user data:", error);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  /* ========================================================
     NORMALIZE ROLE
  ======================================================== */

  const userRole = String(
    user?.role || ""
  ).toLowerCase();

  /* ========================================================
     CHECK USER STATUS
  ======================================================== */

  if (
    user?.suspended === true ||
    user?.active === false ||
    user?.deletedAt
  ) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return (
      <Navigate
        to="/login"
        replace
        state={{
          message:
            "Your account is currently unavailable.",
        }}
      />
    );
  }

  /* ========================================================
     ADMIN ONLY
  ======================================================== */

  if (adminOnly && userRole !== "admin") {
    return (
      <Navigate
        to={redirectTo}
        replace
      />
    );
  }

  /* ========================================================
     FREELANCER ONLY
  ======================================================== */

  if (
    freelancerOnly &&
    userRole !== "freelancer"
  ) {
    return (
      <Navigate
        to={redirectTo}
        replace
      />
    );
  }

  /* ========================================================
     CLIENT ONLY
  ======================================================== */

  if (
    clientOnly &&
    userRole !== "client"
  ) {
    return (
      <Navigate
        to={redirectTo}
        replace
      />
    );
  }

  /* ========================================================
     MULTIPLE ROLES
  ======================================================== */

  if (
    Array.isArray(roles) &&
    roles.length > 0 &&
    !roles
      .map((role) =>
        String(role).toLowerCase()
      )
      .includes(userRole)
  ) {
    return (
      <Navigate
        to={redirectTo}
        replace
      />
    );
  }

  /* ========================================================
     AUTHORIZED
  ======================================================== */

  return children;
};

export default ProtectedRoute;