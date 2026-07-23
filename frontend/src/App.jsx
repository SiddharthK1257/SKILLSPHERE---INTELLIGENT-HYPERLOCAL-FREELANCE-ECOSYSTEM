import { Routes, Route } from "react-router-dom";

/* ===========================
   PUBLIC PAGES
=========================== */

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import NotFound from "./pages/NotFound";

/* ===========================
   USER PAGES
=========================== */

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import EditProfile from "./pages/EditProfile";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import SavedGigs from "./pages/SavedGigs";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import AdminGigs from "./pages/admin/AdminGigs";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminReports from "./pages/admin/AdminReports";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminProposals from "./pages/admin/AdminProposals";

/* ===========================
   GIG PAGES
=========================== */

import BrowseGigs from "./pages/BrowseGigs";
import GigDetails from "./pages/GigDetails";
import CreateGig from "./pages/CreateGig";
import MyGigs from "./pages/MyGigs";
import Search from "./pages/Search";
import Projects from "./pages/Projects";
import EditGig from "./pages/EditGig";

/* ===========================
   PROPOSAL PAGES
=========================== */

import SubmitProposal from "./pages/SubmitProposal";
import MyProposals from "./pages/MyProposals";
import GigProposals from "./pages/GigProposals";
import ProposalDetails from "./pages/ProposalDetails";
import ProposalRequests from "./pages/ProposalRequests";

/* ===========================
   PAYMENT PAGES
=========================== */

import Checkout from "./pages/payments/Checkout";
import PaymentHistory from "./pages/payments/PaymentHistory";
import PaymentDetails from "./pages/payments/PaymentDetails";
import Wallet from "./pages/payments/Wallet";
import Transactions from "./pages/payments/Transactions";

/* ===========================
   AI
=========================== */

import AIRecommendation from "./pages/AIRecommendation";

/* ===========================
   REVIEW PAGES
=========================== */

import ReviewList from "./components/reviews/ReviewList";
import CreateReview from "./pages/CreateReview";
import EditReview from "./pages/EditReview";
import ReviewDetails from "./pages/ReviewDetails";

/* ===========================
   COMPONENTS
=========================== */

import Scheduler from "./components/Scheduler";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* PUBLIC */}

      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/verify-email/:token"
        element={<VerifyEmail />}
      />

      {/* DASHBOARD */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* PROFILE */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
  path="/analytics"
  element={
    <ProtectedRoute>
      <Analytics />
    </ProtectedRoute>
  }
/>

      <Route
        path="/edit-profile"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />

      {/* CHAT */}

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />

      <Route
  path="/notifications"
  element={
    <ProtectedRoute>
      <Notifications />
    </ProtectedRoute>
  }
/>

      {/* ADMIN */}
      <Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute adminOnly>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/users"
  element={
    <ProtectedRoute adminOnly>
      <Users />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/gigs"
  element={
    <ProtectedRoute adminOnly>
      <AdminGigs />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/payments"
  element={
    <ProtectedRoute adminOnly>
      <AdminPayments />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/reports"
  element={
    <ProtectedRoute adminOnly>
      <AdminReports />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/reviews"
  element={
    <ProtectedRoute adminOnly>
      <AdminReviews />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/settings"
  element={
    <ProtectedRoute adminOnly>
      <AdminSettings />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/proposals"
  element={
    <ProtectedRoute adminOnly>
      <AdminProposals />
    </ProtectedRoute>
  }
/>

      {/* SETTINGS */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* SAVED */}
      <Route
        path="/saved"
        element={
          <ProtectedRoute>
            <SavedGigs />
          </ProtectedRoute>
        }
      />

      {/* GIGS */}

      <Route
        path="/browse-gigs"
        element={
          <ProtectedRoute>
            <BrowseGigs />
          </ProtectedRoute>
        }
      />

      <Route
  path="/search"
  element={
    <ProtectedRoute>
      <Search />
    </ProtectedRoute>
  }
/>

      <Route
        path="/gigs/:id"
        element={
          <ProtectedRoute>
            <GigDetails />
          </ProtectedRoute>
        }
      />

      <Route
  path="/create-gig"
  element={
    <ProtectedRoute freelancerOnly>
      <CreateGig />
    </ProtectedRoute>
  }
/>

<Route
  path="/edit-gig/:id"
  element={
    <ProtectedRoute freelancerOnly>
      <EditGig />
    </ProtectedRoute>
  }
/>

      <Route
  path="/my-gigs"
  element={
    <ProtectedRoute freelancerOnly>
      <MyGigs />
    </ProtectedRoute>
  }
/>

      <Route
  path="/projects"
  element={
    <ProtectedRoute>
      <Projects />
    </ProtectedRoute>
  }
/>

      {/* PROPOSALS */}

      <Route
  path="/submit-proposal/:gigId"
  element={
    <ProtectedRoute freelancerOnly>
      <SubmitProposal />
    </ProtectedRoute>
  }
/>

      <Route
  path="/my-proposals"
  element={
    <ProtectedRoute freelancerOnly>
      <MyProposals />
    </ProtectedRoute>
  }
/>

      <Route
        path="/proposal/:id"
        element={
          <ProtectedRoute>
            <ProposalDetails />
          </ProtectedRoute>
        }
      />

      <Route
  path="/proposal-requests"
  element={
    <ProtectedRoute >
      <ProposalRequests />
    </ProtectedRoute>
  }
/>

      <Route
  path="/gig/:gigId/proposals"
  element={
    <ProtectedRoute clientOnly>
      <GigProposals />
    </ProtectedRoute>
  }
/>

      {/* PAYMENTS */}

      <Route
  path="/checkout/:proposalId"
  element={
    <ProtectedRoute >
      <Checkout />
    </ProtectedRoute>
  }
/>

      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <PaymentHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment/:paymentId"
        element={
          <ProtectedRoute>
            <PaymentDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/wallet"
        element={
          <ProtectedRoute>
            <Wallet />
          </ProtectedRoute>
        }
      />

      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        }
      />

      {/* AI */}

      <Route
        path="/ai-recommendations"
        element={
          <ProtectedRoute>
            <AIRecommendation />
          </ProtectedRoute>
        }
      />

      {/* REVIEWS */}

      <Route
        path="/reviews"
        element={
          <ProtectedRoute>
            <ReviewList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reviews/create"
        element={
          <ProtectedRoute>
            <CreateReview />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reviews/:id"
        element={
          <ProtectedRoute>
            <ReviewDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reviews/edit/:id"
        element={
          <ProtectedRoute>
            <EditReview />
          </ProtectedRoute>
        }
      />

      <Route
  path="/scheduler"
  element={
    <ProtectedRoute>
      <Scheduler />
    </ProtectedRoute>
  }
/>

      {/* 404 */}

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default App;
