import { Routes, Route } from "react-router-dom";

// Public Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";

// Main Pages
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import CreateGig from "../pages/CreateGig";
import BrowseGigs from "../pages/BrowseGigs";
import GigDetails from "../pages/GigDetails";

// Proposal Pages
import MyProposals from "../pages/MyProposals";
import ProposalDetails from "../pages/ProposalDetails";
import ProposalRequests from "../pages/ProposalRequests";

// Payment Pages
import Checkout from "../pages/payments/Checkout";
import PaymentDetails from "../pages/payments/PaymentDetails";
import PaymentHistory from "../pages/payments/PaymentHistory";
import Wallet from "../pages/payments/Wallet";
import Transactions from "../pages/payments/Transactions";

// AI Page (if available)
// import AIRecommendations from "../pages/AIRecommendation";

// Chat Page (if available)
// import Chat from "../pages/Chat";

// My Gigs Page (if available)
// import MyGigs from "../pages/MyGigs";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ======================
          PUBLIC
      ======================= */}

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* ======================
          USER
      ======================= */}

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="/create-gig" element={<CreateGig />} />

      {/* Navbar uses browse-gigs */}
      <Route path="/browse-gigs" element={<BrowseGigs />} />

      {/* Optional old route */}
      <Route path="/browse" element={<BrowseGigs />} />

      <Route path="/gig/:id" element={<GigDetails />} />

      {/* Uncomment when pages exist */}

      {/*
      <Route path="/my-gigs" element={<MyGigs />} />

      <Route path="/chat" element={<Chat />} />

      <Route
        path="/ai-recommendations"
        element={<AIRecommendations />}
      />
      */}

      {/* ======================
          PROPOSALS
      ======================= */}

      <Route
        path="/my-proposals"
        element={<MyProposals />}
      />

      <Route
        path="/proposal/:id"
        element={<ProposalDetails />}
      />

      <Route
        path="/proposal-requests"
        element={<ProposalRequests />}
      />

      {/* ======================
          PAYMENTS
      ======================= */}

      <Route
        path="/checkout/:proposalId"
        element={<Checkout />}
      />

      <Route
        path="/payment/:paymentId"
        element={<PaymentDetails />}
      />

      <Route
        path="/payments"
        element={<PaymentHistory />}
      />

      <Route
        path="/wallet"
        element={<Wallet />}
      />

      <Route
        path="/transactions"
        element={<Transactions />}
      />

      {/* ======================
          404
      ======================= */}

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AppRoutes;