import mongoose from "mongoose";
import Proposal from "../models/Proposal.js";
import Gig from "../models/Gig.js";

/* ==========================================================
   HELPERS
========================================================== */

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const isSameUser = (a, b) => {
  return String(a) === String(b);
};

const sendError = (
  res,
  status = 500,
  message = "Something went wrong."
) => {
  return res.status(status).json({
    success: false,
    message,
  });
};

const getUserId = (req) => {
  return req.user?._id;
};

/* ==========================================================
   POPULATE PROPOSAL
========================================================== */

const populateProposal = (query) => {
  return query
    .populate(
      "gig",
      `
        title
        shortDescription
        description
        category
        coverImage
        startingPrice
        freelancer
      `
    )
    .populate(
      "client",
      `
        name
        email
        profileImage
      `
    )
    .populate(
      "freelancer",
      `
        name
        email
        profileImage
        skills
      `
    );
};

/* ==========================================================
   VALIDATE PROPOSAL ID
========================================================== */

const validateProposalId = (id, res) => {
  if (!id) {
    sendError(res, 400, "Proposal ID is required.");
    return false;
  }

  if (!isValidObjectId(id)) {
    sendError(res, 400, "Invalid proposal ID.");
    return false;
  }

  return true;
};

/* ==========================================================
   FIND PROPOSAL
========================================================== */

const findProposal = async (id) => {
  return Proposal.findById(id);
};

/* ==========================================================
   GET POPULATED PROPOSAL
========================================================== */

const getPopulatedProposal = async (id) => {
  return populateProposal(
    Proposal.findById(id)
  );
};

/* ==========================================================
   SUBMIT PROPOSAL
   CLIENT ONLY

   pending
========================================================== */

export const submitProposal = async (req, res) => {
  try {
    const userId = getUserId(req);

    const {
      gigId,
      proposalDescription,
      bidAmount,
      estimatedCompletionTime,
    } = req.body;

    /* ------------------------------------------------------
       BASIC VALIDATION
    ------------------------------------------------------ */

    if (!gigId) {
      return sendError(
        res,
        400,
        "Gig ID is required."
      );
    }

    if (!isValidObjectId(gigId)) {
      return sendError(
        res,
        400,
        "Invalid gig ID."
      );
    }

    const description =
      String(proposalDescription || "").trim();

    if (!description) {
      return sendError(
        res,
        400,
        "Proposal description is required."
      );
    }

    if (description.length < 10) {
      return sendError(
        res,
        400,
        "Proposal description must contain at least 10 characters."
      );
    }

    if (description.length > 5000) {
      return sendError(
        res,
        400,
        "Proposal description cannot exceed 5000 characters."
      );
    }

    const bid = Number(bidAmount);

    if (!Number.isFinite(bid) || bid <= 0) {
      return sendError(
        res,
        400,
        "Bid amount must be greater than 0."
      );
    }

    const completionDays =
      Number(estimatedCompletionTime);

    if (
      !Number.isFinite(completionDays) ||
      completionDays <= 0
    ) {
      return sendError(
        res,
        400,
        "Estimated completion time must be greater than 0."
      );
    }

    /* ------------------------------------------------------
       FIND GIG
    ------------------------------------------------------ */

    const gig = await Gig.findById(gigId);

    if (!gig) {
      return sendError(
        res,
        404,
        "Gig not found."
      );
    }

    if (!gig.freelancer) {
      return sendError(
        res,
        400,
        "Gig does not have a freelancer."
      );
    }

    /* ------------------------------------------------------
       OWN GIG CHECK
    ------------------------------------------------------ */

    if (
      isSameUser(
        gig.freelancer,
        userId
      )
    ) {
      return sendError(
        res,
        400,
        "You cannot submit a proposal to your own gig."
      );
    }

    /* ------------------------------------------------------
       DUPLICATE CHECK
    ------------------------------------------------------ */

    const existingProposal =
      await Proposal.findOne({
        client: userId,
        gig: gig._id,
      });

    if (existingProposal) {
      return sendError(
        res,
        409,
        "You have already submitted a proposal for this gig."
      );
    }

    /* ------------------------------------------------------
       CREATE PROPOSAL
    ------------------------------------------------------ */

    const proposal =
      await Proposal.create({
        client: userId,
        freelancer: gig.freelancer,
        gig: gig._id,

        proposalDescription: description,

        bidAmount: bid,

        currentOfferAmount: bid,

        estimatedCompletionTime: completionDays,

        status: "pending",

        paymentStatus: "unpaid",
      });

    const populatedProposal =
      await getPopulatedProposal(
        proposal._id
      );

    return res.status(201).json({
      success: true,
      message:
        "Proposal submitted successfully.",
      proposal: populatedProposal,
    });
  } catch (error) {
    console.error(
      "SUBMIT PROPOSAL ERROR:",
      error
    );

    if (error.code === 11000) {
      return sendError(
        res,
        409,
        "You have already submitted a proposal for this gig."
      );
    }

    if (
      error instanceof mongoose.Error.ValidationError
    ) {
      return sendError(
        res,
        400,
        Object.values(error.errors)
          .map((error) => error.message)
          .join(", ")
      );
    }

    return sendError(
      res,
      500,
      "Unable to submit proposal."
    );
  }
};

/* ==========================================================
   GET MY PROPOSALS
   CLIENT
========================================================== */

export const getMyProposals = async (
  req,
  res
) => {
  try {
    const proposals =
      await populateProposal(
        Proposal.find({
          client: getUserId(req),
        }).sort({
          createdAt: -1,
        })
      );

    return res.status(200).json({
      success: true,
      total: proposals.length,
      proposals,
    });
  } catch (error) {
    console.error(
      "GET MY PROPOSALS ERROR:",
      error
    );

    return sendError(
      res,
      500,
      "Unable to fetch your proposals."
    );
  }
};

/* ==========================================================
   GET RECEIVED PROPOSALS
   FREELANCER
========================================================== */

export const getReceivedProposals = async (
  req,
  res
) => {
  try {
    const proposals =
      await populateProposal(
        Proposal.find({
          freelancer: getUserId(req),
        }).sort({
          createdAt: -1,
        })
      );

    return res.status(200).json({
      success: true,
      total: proposals.length,
      proposals,
    });
  } catch (error) {
    console.error(
      "GET RECEIVED PROPOSALS ERROR:",
      error
    );

    return sendError(
      res,
      500,
      "Unable to fetch received proposals."
    );
  }
};

/* ==========================================================
   GET PROPOSALS OF A GIG
   FREELANCER ONLY
========================================================== */

export const getGigProposals = async (
  req,
  res
) => {
  try {
    const { gigId } = req.params;

    if (!isValidObjectId(gigId)) {
      return sendError(
        res,
        400,
        "Invalid gig ID."
      );
    }

    const gig =
      await Gig.findById(gigId)
        .select("freelancer");

    if (!gig) {
      return sendError(
        res,
        404,
        "Gig not found."
      );
    }

    if (
      !isSameUser(
        gig.freelancer,
        getUserId(req)
      )
    ) {
      return sendError(
        res,
        403,
        "Only the gig owner can view proposals."
      );
    }

    const proposals =
      await populateProposal(
        Proposal.find({
          gig: gigId,
        }).sort({
          createdAt: -1,
        })
      );

    return res.status(200).json({
      success: true,
      total: proposals.length,
      proposals,
    });
  } catch (error) {
    console.error(
      "GET GIG PROPOSALS ERROR:",
      error
    );

    return sendError(
      res,
      500,
      "Unable to fetch gig proposals."
    );
  }
};

/* ==========================================================
   GET SINGLE PROPOSAL
   CLIENT OR FREELANCER
========================================================== */

export const getProposal = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!validateProposalId(id, res)) {
      return;
    }

    const proposal =
      await getPopulatedProposal(id);

    if (!proposal) {
      return sendError(
        res,
        404,
        "Proposal not found."
      );
    }

    const clientId =
      proposal.client?._id;

    const freelancerId =
      proposal.freelancer?._id;

    const isClient =
      clientId &&
      isSameUser(
        clientId,
        getUserId(req)
      );

    const isFreelancer =
      freelancerId &&
      isSameUser(
        freelancerId,
        getUserId(req)
      );

    if (!isClient && !isFreelancer) {
      return sendError(
        res,
        403,
        "You are not authorized to view this proposal."
      );
    }

    return res.status(200).json({
      success: true,
      proposal,
    });
  } catch (error) {
    console.error(
      "GET PROPOSAL ERROR:",
      error
    );

    return sendError(
      res,
      500,
      "Unable to fetch proposal."
    );
  }
};

/* ==========================================================
   ACCEPT PROPOSAL
   FREELANCER ONLY

   pending / negotiating
              ↓
           accepted
========================================================== */

export const acceptProposal = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!validateProposalId(id, res)) {
      return;
    }

    const proposal =
      await findProposal(id);

    if (!proposal) {
      return sendError(
        res,
        404,
        "Proposal not found."
      );
    }

    if (
      !isSameUser(
        proposal.freelancer,
        getUserId(req)
      )
    ) {
      return sendError(
        res,
        403,
        "Only the freelancer can accept this proposal."
      );
    }

    if (
      ![
        "pending",
        "negotiating",
      ].includes(proposal.status)
    ) {
      return sendError(
        res,
        400,
        "Only pending or negotiating proposals can be accepted."
      );
    }

    await proposal.acceptProposal();

    return res.status(200).json({
      success: true,
      message:
        "Proposal accepted successfully. Waiting for client payment.",
      proposal:
        await getPopulatedProposal(
          proposal._id
        ),
    });
  } catch (error) {
    console.error(
      "ACCEPT PROPOSAL ERROR:",
      error
    );

    return sendError(
      res,
      400,
      error.message ||
        "Unable to accept proposal."
    );
  }
};

/* ==========================================================
   REJECT PROPOSAL
   FREELANCER ONLY
========================================================== */

export const rejectProposal = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      reason = "",
    } = req.body;

    if (!validateProposalId(id, res)) {
      return;
    }

    const proposal =
      await findProposal(id);

    if (!proposal) {
      return sendError(
        res,
        404,
        "Proposal not found."
      );
    }

    if (
      !isSameUser(
        proposal.freelancer,
        getUserId(req)
      )
    ) {
      return sendError(
        res,
        403,
        "Only the freelancer can reject this proposal."
      );
    }

    await proposal.rejectProposal(
      reason
    );

    return res.status(200).json({
      success: true,
      message:
        "Proposal rejected successfully.",
      proposal:
        await getPopulatedProposal(
          proposal._id
        ),
    });
  } catch (error) {
    console.error(
      "REJECT PROPOSAL ERROR:",
      error
    );

    return sendError(
      res,
      400,
      error.message ||
        "Unable to reject proposal."
    );
  }
};

/* ==========================================================
   NEGOTIATE PROPOSAL
   CLIENT ↔ FREELANCER
========================================================== */

export const negotiateProposal = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      message,
      offerAmount,
    } = req.body;

    if (!validateProposalId(id, res)) {
      return;
    }

    const cleanMessage =
      String(message || "").trim();

    if (!cleanMessage) {
      return sendError(
        res,
        400,
        "Negotiation message is required."
      );
    }

    if (cleanMessage.length > 2000) {
      return sendError(
        res,
        400,
        "Negotiation message cannot exceed 2000 characters."
      );
    }

    const amount =
      Number(offerAmount);

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return sendError(
        res,
        400,
        "Offer amount must be greater than 0."
      );
    }

    const proposal =
      await findProposal(id);

    if (!proposal) {
      return sendError(
        res,
        404,
        "Proposal not found."
      );
    }

    const isClient =
      isSameUser(
        proposal.client,
        getUserId(req)
      );

    const isFreelancer =
      isSameUser(
        proposal.freelancer,
        getUserId(req)
      );

    if (!isClient && !isFreelancer) {
      return sendError(
        res,
        403,
        "You are not authorized to negotiate this proposal."
      );
    }

    await proposal.addNegotiation({
      sender: getUserId(req),
      message: cleanMessage,
      offerAmount: amount,
    });

    return res.status(200).json({
      success: true,
      message:
        "Negotiation sent successfully.",
      proposal:
        await getPopulatedProposal(
          proposal._id
        ),
    });
  } catch (error) {
    console.error(
      "NEGOTIATE PROPOSAL ERROR:",
      error
    );

    return sendError(
      res,
      400,
      error.message ||
        "Unable to negotiate proposal."
    );
  }
};

/* ==========================================================
   UPDATE PROPOSAL
   CLIENT ONLY

   pending / negotiating
========================================================== */

export const updateProposal = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!validateProposalId(id, res)) {
      return;
    }

    const proposal =
      await findProposal(id);

    if (!proposal) {
      return sendError(
        res,
        404,
        "Proposal not found."
      );
    }

    if (
      !isSameUser(
        proposal.client,
        getUserId(req)
      )
    ) {
      return sendError(
        res,
        403,
        "Only the client can update this proposal."
      );
    }

    if (
      ![
        "pending",
        "negotiating",
      ].includes(proposal.status)
    ) {
      return sendError(
        res,
        400,
        "Only pending or negotiating proposals can be updated."
      );
    }

    const {
      proposalDescription,
      bidAmount,
      estimatedCompletionTime,
    } = req.body;

    /* ------------------------------------------------------
       DESCRIPTION
    ------------------------------------------------------ */

    if (
      proposalDescription !== undefined
    ) {
      const description =
        String(
          proposalDescription
        ).trim();

      if (description.length < 10) {
        return sendError(
          res,
          400,
          "Proposal description must contain at least 10 characters."
        );
      }

      if (description.length > 5000) {
        return sendError(
          res,
          400,
          "Proposal description cannot exceed 5000 characters."
        );
      }

      proposal.proposalDescription =
        description;
    }

    /* ------------------------------------------------------
       BID AMOUNT
    ------------------------------------------------------ */

    if (
      bidAmount !== undefined
    ) {
      const amount =
        Number(bidAmount);

      if (
        !Number.isFinite(amount) ||
        amount <= 0
      ) {
        return sendError(
          res,
          400,
          "Bid amount must be greater than 0."
        );
      }

      proposal.bidAmount =
        amount;

      proposal.currentOfferAmount =
        amount;
    }

    /* ------------------------------------------------------
       COMPLETION TIME
    ------------------------------------------------------ */

    if (
      estimatedCompletionTime !==
      undefined
    ) {
      const days =
        Number(
          estimatedCompletionTime
        );

      if (
        !Number.isFinite(days) ||
        days <= 0
      ) {
        return sendError(
          res,
          400,
          "Estimated completion time must be greater than 0."
        );
      }

      proposal.estimatedCompletionTime =
        days;
    }

    await proposal.save();

    return res.status(200).json({
      success: true,
      message:
        "Proposal updated successfully.",
      proposal:
        await getPopulatedProposal(
          proposal._id
        ),
    });
  } catch (error) {
    console.error(
      "UPDATE PROPOSAL ERROR:",
      error
    );

    return sendError(
      res,
      400,
      error.message ||
        "Unable to update proposal."
    );
  }
};

/* ==========================================================
   WITHDRAW PROPOSAL
   CLIENT ONLY
========================================================== */

export const withdrawProposal = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      reason = "",
    } = req.body;

    if (!validateProposalId(id, res)) {
      return;
    }

    const proposal =
      await findProposal(id);

    if (!proposal) {
      return sendError(
        res,
        404,
        "Proposal not found."
      );
    }

    if (
      !isSameUser(
        proposal.client,
        getUserId(req)
      )
    ) {
      return sendError(
        res,
        403,
        "Only the client can withdraw this proposal."
      );
    }

    await proposal.withdrawProposal(
      reason
    );

    return res.status(200).json({
      success: true,
      message:
        "Proposal withdrawn successfully.",
      proposal:
        await getPopulatedProposal(
          proposal._id
        ),
    });
  } catch (error) {
    console.error(
      "WITHDRAW PROPOSAL ERROR:",
      error
    );

    return sendError(
      res,
      400,
      error.message ||
        "Unable to withdraw proposal."
    );
  }
};

/* ==========================================================
   PAYMENT PENDING
   CLIENT ONLY

   accepted
      ↓
   payment pending
========================================================== */

export const markPaymentPending = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      orderId,
      amount,
    } = req.body;

    if (!validateProposalId(id, res)) {
      return;
    }

    const proposal =
      await findProposal(id);

    if (!proposal) {
      return sendError(
        res,
        404,
        "Proposal not found."
      );
    }

    if (
      !isSameUser(
        proposal.client,
        getUserId(req)
      )
    ) {
      return sendError(
        res,
        403,
        "Only the client can initiate payment."
      );
    }

    await proposal.markPaymentPending({
      orderId,
      amount,
    });

    return res.status(200).json({
      success: true,
      message:
        "Payment marked as pending.",
      proposal:
        await getPopulatedProposal(
          proposal._id
        ),
    });
  } catch (error) {
    console.error(
      "MARK PAYMENT PENDING ERROR:",
      error
    );

    return sendError(
      res,
      400,
      error.message ||
        "Unable to mark payment as pending."
    );
  }
};

/* ==========================================================
   MARK PROPOSAL AS PAID
   INTERNAL / PAYMENT VERIFICATION ONLY

   accepted
      ↓
     paid
      ↓
    hired
========================================================== */

export const markProposalAsPaid = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      paymentId,
      orderId,
      amount,
    } = req.body;

    if (!validateProposalId(id, res)) {
      return;
    }

    const proposal =
      await findProposal(id);

    if (!proposal) {
      return sendError(
        res,
        404,
        "Proposal not found."
      );
    }

    /*
      IMPORTANT:

      In production, this endpoint should be called
      only after verifying the payment with your payment
      provider webhook/API.

      Do not trust payment success from frontend alone.
    */

    await proposal.markAsPaid({
      paymentId,
      orderId,
      amount,
    });

    await proposal.hireFreelancer();

    return res.status(200).json({
      success: true,
      message:
        "Payment verified successfully. Freelancer has been hired.",
      proposal:
        await getPopulatedProposal(
          proposal._id
        ),
    });
  } catch (error) {
    console.error(
      "MARK PROPOSAL AS PAID ERROR:",
      error
    );

    return sendError(
      res,
      400,
      error.message ||
        "Unable to verify payment."
    );
  }
};

/* ==========================================================
   COMPLETE PROJECT
   FREELANCER ONLY

   hired
      ↓
   completed
========================================================== */

export const markProposalCompleted = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!validateProposalId(id, res)) {
      return;
    }

    const proposal =
      await findProposal(id);

    if (!proposal) {
      return sendError(
        res,
        404,
        "Proposal not found."
      );
    }

    if (
      !isSameUser(
        proposal.freelancer,
        getUserId(req)
      )
    ) {
      return sendError(
        res,
        403,
        "Only the hired freelancer can complete this project."
      );
    }

    await proposal.completeProject();

    return res.status(200).json({
      success: true,
      message:
        "Project marked as completed. Waiting for client approval.",
      proposal:
        await getPopulatedProposal(
          proposal._id
        ),
    });
  } catch (error) {
    console.error(
      "COMPLETE PROJECT ERROR:",
      error
    );

    return sendError(
      res,
      400,
      error.message ||
        "Unable to complete project."
    );
  }
};

/* ==========================================================
   RELEASE PAYMENT
   CLIENT ONLY

   completed
       ↓
   released
========================================================== */

export const clientCompleteProposal = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!validateProposalId(id, res)) {
      return;
    }

    const proposal =
      await findProposal(id);

    if (!proposal) {
      return sendError(
        res,
        404,
        "Proposal not found."
      );
    }

    if (
      !isSameUser(
        proposal.client,
        getUserId(req)
      )
    ) {
      return sendError(
        res,
        403,
        "Only the client can approve this project."
      );
    }

    await proposal.releasePayment();

    return res.status(200).json({
      success: true,
      message:
        "Project approved successfully. Payment released to freelancer.",
      proposal:
        await getPopulatedProposal(
          proposal._id
        ),
    });
  } catch (error) {
    console.error(
      "RELEASE PAYMENT ERROR:",
      error
    );

    return sendError(
      res,
      400,
      error.message ||
        "Unable to release payment."
    );
  }
};

/* ==========================================================
   CANCEL PROJECT
   CLIENT OR FREELANCER
========================================================== */

export const cancelProposal = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      reason = "",
    } = req.body;

    if (!validateProposalId(id, res)) {
      return;
    }

    const proposal =
      await findProposal(id);

    if (!proposal) {
      return sendError(
        res,
        404,
        "Proposal not found."
      );
    }

    const isClient =
      isSameUser(
        proposal.client,
        getUserId(req)
      );

    const isFreelancer =
      isSameUser(
        proposal.freelancer,
        getUserId(req)
      );

    if (!isClient && !isFreelancer) {
      return sendError(
        res,
        403,
        "You are not authorized to cancel this project."
      );
    }

    await proposal.cancelProject(
      reason
    );

    return res.status(200).json({
      success: true,
      message:
        "Project cancelled successfully.",
      proposal:
        await getPopulatedProposal(
          proposal._id
        ),
    });
  } catch (error) {
    console.error(
      "CANCEL PROPOSAL ERROR:",
      error
    );

    return sendError(
      res,
      400,
      error.message ||
        "Unable to cancel project."
    );
  }
};

/* ==========================================================
   DELETE PROPOSAL
   CLIENT ONLY
========================================================== */

export const deleteProposal = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!validateProposalId(id, res)) {
      return;
    }

    const proposal =
      await findProposal(id);

    if (!proposal) {
      return sendError(
        res,
        404,
        "Proposal not found."
      );
    }

    if (
      !isSameUser(
        proposal.client,
        getUserId(req)
      )
    ) {
      return sendError(
        res,
        403,
        "Only the client can delete this proposal."
      );
    }

    await proposal.softDelete();

    return res.status(200).json({
      success: true,
      message:
        "Proposal deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE PROPOSAL ERROR:",
      error
    );

    return sendError(
      res,
      400,
      error.message ||
        "Unable to delete proposal."
    );
  }
};

/* ==========================================================
   CLIENT STATISTICS
========================================================== */

export const getProposalStatistics = async (
  req,
  res
) => {
  try {
    const statistics =
      await Proposal.aggregate([
        {
          $match: {
            client: new mongoose.Types.ObjectId(
              getUserId(req)
            ),
            deletedAt: null,
          },
        },

        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1,
            },
          },
        },
      ]);

    const response = {
      total: 0,
      pending: 0,
      negotiating: 0,
      accepted: 0,
      rejected: 0,
      withdrawn: 0,
      hired: 0,
      completed: 0,
      cancelled: 0,
      suspended: 0,
    };

    statistics.forEach((item) => {
      response.total += item.count;

      if (
        Object.prototype.hasOwnProperty.call(
          response,
          item._id
        )
      ) {
        response[item._id] =
          item.count;
      }
    });

    return res.status(200).json({
      success: true,
      statistics: response,
    });
  } catch (error) {
    console.error(
      "CLIENT PROPOSAL STATISTICS ERROR:",
      error
    );

    return sendError(
      res,
      500,
      "Unable to fetch proposal statistics."
    );
  }
};

/* ==========================================================
   FREELANCER STATISTICS
========================================================== */

export const getFreelancerProposalStatistics =
  async (req, res) => {
    try {
      const statistics =
        await Proposal.aggregate([
          {
            $match: {
              freelancer:
                new mongoose.Types.ObjectId(
                  getUserId(req)
                ),
              deletedAt: null,
            },
          },

          {
            $group: {
              _id: "$status",
              count: {
                $sum: 1,
              },
            },
          },
        ]);

      const response = {
        total: 0,
        pending: 0,
        negotiating: 0,
        accepted: 0,
        rejected: 0,
        withdrawn: 0,
        hired: 0,
        completed: 0,
        cancelled: 0,
        suspended: 0,
      };

      statistics.forEach((item) => {
        response.total += item.count;

        if (
          Object.prototype.hasOwnProperty.call(
            response,
            item._id
          )
        ) {
          response[item._id] =
            item.count;
        }
      });

      return res.status(200).json({
        success: true,
        statistics: response,
      });
    } catch (error) {
      console.error(
        "FREELANCER PROPOSAL STATISTICS ERROR:",
        error
      );

      return sendError(
        res,
        500,
        "Unable to fetch freelancer statistics."
      );
    }
  };

/* ==========================================================
   RECENT PROPOSALS
========================================================== */

export const getRecentProposals = async (
  req,
  res
) => {
  try {
    const proposals =
      await populateProposal(
        Proposal.find({
          $or: [
            {
              client: getUserId(req),
            },
            {
              freelancer: getUserId(req),
            },
          ],
        })
          .sort({
            updatedAt: -1,
          })
          .limit(10)
      );

    return res.status(200).json({
      success: true,
      total: proposals.length,
      proposals,
    });
  } catch (error) {
    console.error(
      "RECENT PROPOSALS ERROR:",
      error
    );

    return sendError(
      res,
      500,
      "Unable to fetch recent proposals."
    );
  }
};

/* ==========================================================
   ACTIVE PROJECTS
========================================================== */

export const getActiveProjects = async (
  req,
  res
) => {
  try {
    const proposals =
      await populateProposal(
        Proposal.find({
          $or: [
            {
              client: getUserId(req),
            },
            {
              freelancer: getUserId(req),
            },
          ],

          status: {
            $in: [
              "hired",
              "completed",
            ],
          },
        }).sort({
          updatedAt: -1,
        })
      );

    return res.status(200).json({
      success: true,
      total: proposals.length,
      proposals,
    });
  } catch (error) {
    console.error(
      "ACTIVE PROJECTS ERROR:",
      error
    );

    return sendError(
      res,
      500,
      "Unable to fetch active projects."
    );
  }
};
