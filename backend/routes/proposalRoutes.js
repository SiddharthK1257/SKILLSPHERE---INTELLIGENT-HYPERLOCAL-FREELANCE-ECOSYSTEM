import express from "express";

import {
  submitProposal,
  getMyProposals,
  getReceivedProposals,
  getGigProposals,
  getProposal,
  getProposalStatistics,

  acceptProposal,
  rejectProposal,
  negotiateProposal,

  updateProposal,
  withdrawProposal,
  deleteProposal,
} from "../controllers/proposalController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==========================================================
   AUTHENTICATION
   All proposal routes require login
========================================================== */

router.use(protect);

/* ==========================================================
   TEST ROUTE
========================================================== */

router.get("/test", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Proposal routes are working successfully.",
  });
});

/* ==========================================================
   CREATE PROPOSAL
========================================================== */

/*
  Client submits proposal to a freelancer's gig

  POST /api/proposals

  Body:

  {
    "gigId": "gig_id",
    "proposalDescription": "I can complete this project...",
    "bidAmount": 15000,
    "estimatedCompletionTime": 7
  }
*/

router.post("/", submitProposal);

/* ==========================================================
   GET PROPOSALS
========================================================== */

/*
  Get proposals submitted by logged-in client

  GET /api/proposals/my
*/

router.get("/my", getMyProposals);


/*
  Get proposals received by logged-in freelancer

  GET /api/proposals/received
*/

router.get(
  "/received",
  getReceivedProposals
);


/*
  Get all proposals for one gig

  GET /api/proposals/gig/:gigId
*/

router.get(
  "/gig/:gigId",
  getGigProposals
);


/*
  Get proposal statistics

  GET /api/proposals/statistics
*/

router.get(
  "/statistics",
  getProposalStatistics
);

/* ==========================================================
   UPDATE PROPOSAL
========================================================== */

/*
  Client updates proposal before acceptance

  PUT /api/proposals/:id
*/

router.put(
  "/:id",
  updateProposal
);

/* ==========================================================
   NEGOTIATION
========================================================== */

/*
  Client and freelancer can negotiate

  PUT /api/proposals/:id/negotiate

  Body:

  {
    "message": "Can you reduce the price?",
    "offerAmount": 12000
  }
*/

router.put(
  "/:id/negotiate",
  negotiateProposal
);

/* ==========================================================
   FREELANCER ACTIONS
========================================================== */

/*
  Freelancer accepts proposal

  PUT /api/proposals/:id/accept
*/

router.put(
  "/:id/accept",
  acceptProposal
);


/*
  Freelancer rejects proposal

  PUT /api/proposals/:id/reject
*/

router.put(
  "/:id/reject",
  rejectProposal
);

/* ==========================================================
   CLIENT ACTIONS
========================================================== */

/*
  Client withdraws proposal

  DELETE /api/proposals/:id/withdraw
*/

router.delete(
  "/:id/withdraw",
  withdrawProposal
);


/*
  Client deletes proposal

  DELETE /api/proposals/:id
*/

router.delete(
  "/:id",
  deleteProposal
);

/* ==========================================================
   GET SINGLE PROPOSAL
========================================================== */

/*
  Both client and freelancer can view proposal

  GET /api/proposals/:id
*/

router.get(
  "/:id",
  getProposal
);

/* ==========================================================
   EXPORT
========================================================== */

export default router;