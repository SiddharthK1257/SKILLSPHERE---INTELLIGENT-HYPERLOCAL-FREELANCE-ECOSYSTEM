import Gig from "../models/Gig.js";

export const sanitizeGig = (gig) => {
  if (!gig) return null;
  const g = typeof gig.toObject === "function" ? gig.toObject({ virtuals: true }) : gig;

  if (!g.basicPackage) {
    g.basicPackage = {
      name: "Basic",
      description: "Basic Package Description",
      price: g.price || 0,
      deliveryTime: g.deliveryTime || 0,
      features: [],
    };
  }
  if (!g.basicPackage.features) {
    g.basicPackage.features = [];
  }
  if (!g.standardPackage) g.standardPackage = null;
  if (!g.premiumPackage) g.premiumPackage = null;
  if (!g.skills) g.skills = [];
  if (!g.gallery) g.gallery = [];
  if (!g.requirements) g.requirements = [];
  if (!g.faqs) g.faqs = [];
  if (!g.coverImage) g.coverImage = g.image || "";

  return g;
};

// ======================================
// @desc    Create Gig
// @route   POST /api/gigs
// @access  Private
// ======================================
export const createGig = async (req, res) => {
  try {
    const {
      title,
      description,
      shortDescription,
      category,
      price,
      deliveryTime,
      image,
      coverImage,
      skills,
      basicPackage,
      standardPackage,
      premiumPackage,
      languageRequired,
      certifications,
      educationRequired,
      experienceRequired,
      preferredTechnologies,
      softSkills,
      maxBudget,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      (!price && !basicPackage?.price) ||
      (!deliveryTime && !basicPackage?.deliveryTime)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, Description, Category, Price/Basic Package and Delivery Time are required.",
      });
    }

    const calculatedPrice = Number(price) || Number(basicPackage?.price) || 0;
    const calculatedDeliveryTime = Number(deliveryTime) || Number(basicPackage?.deliveryTime) || 0;

    const gig = await Gig.create({
      title,
      description,
      shortDescription: shortDescription || description.substring(0, 150),
      category,
      price: calculatedPrice,
      deliveryTime: calculatedDeliveryTime,
      coverImage: coverImage || image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
      skills: skills || [],
      basicPackage: basicPackage || {
        name: "Basic",
        description: "Basic Package Description",
        price: calculatedPrice,
        deliveryTime: calculatedDeliveryTime,
      },
      standardPackage: standardPackage || null,
      premiumPackage: premiumPackage || null,
      languageRequired: languageRequired || [],
      certifications: certifications || [],
      educationRequired: educationRequired || "",
      experienceRequired: Number(experienceRequired) || 0,
      preferredTechnologies: preferredTechnologies || [],
      softSkills: softSkills || [],
      maxBudget: Number(maxBudget) || calculatedPrice,
      freelancer: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Gig created successfully",
      gig: sanitizeGig(gig),
    });
  } catch (error) {
    console.error("Create Gig Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// @desc    Get All Gigs
// @route   GET /api/gigs
// @access  Public
// ======================================
export const getAllGigs = async (req, res) => {
  try {
    const gigs = await Gig.find()
      .populate("freelancer", "name email")
      .sort({ createdAt: -1 });

    const sanitizedGigs = gigs.map(sanitizeGig);

    res.status(200).json({
      success: true,
      count: sanitizedGigs.length,
      gigs: sanitizedGigs,
    });
  } catch (error) {
    console.error("Get All Gigs Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// @desc    Get Single Gig
// @route   GET /api/gigs/:id
// @access  Public
// ======================================
export const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate(
      "freelancer",
      "name email bio skills role"
    );

    console.log("===== GIG =====");
    console.log(gig);

    console.log("===== FREELANCER =====");
    console.log(gig?.freelancer);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    res.status(200).json({
      success: true,
      gig: sanitizeGig(gig),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// @desc    Update Gig
// @route   PUT /api/gigs/:id
// @access  Private
// ======================================
export const updateGig = async (req, res) => {
  try {
    let gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    if (
      gig.freelancer.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const updateData = { ...req.body };

    if (req.body.image !== undefined) {
      updateData.coverImage = req.body.image;
    }

    if (req.body.price !== undefined || req.body.deliveryTime !== undefined) {
      const priceVal = req.body.price !== undefined ? Number(req.body.price) : gig.price;
      const deliveryVal = req.body.deliveryTime !== undefined ? Number(req.body.deliveryTime) : gig.deliveryTime;

      updateData.price = priceVal;
      updateData.deliveryTime = deliveryVal;
      updateData.basicPackage = {
        name: "Basic",
        description: "Basic Package Description",
        price: priceVal,
        deliveryTime: deliveryVal,
      };
      updateData.maxBudget = priceVal;
    }

    gig = await Gig.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Gig updated successfully",
      gig: sanitizeGig(gig),
    });
  } catch (error) {
    console.error("Update Gig Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// @desc    Delete Gig
// @route   DELETE /api/gigs/:id
// @access  Private
// ======================================
export const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    // ======================================
    // Authorization
    // Admin can delete any gig.
    // Freelancer can delete only their own gig.
    // ======================================

    if (
      req.user.role !== "admin" &&
      gig.freelancer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await gig.deleteOne();

    res.status(200).json({
      success: true,
      message: "Gig deleted successfully",
    });
  } catch (error) {
    console.error("Delete Gig Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// @desc    Get My Gigs
// @route   GET /api/gigs/mygigs
// @access  Private
// ======================================
export const getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({
      freelancer: req.user._id,
    }).sort({
      createdAt: -1,
    });

    const sanitizedGigs = gigs.map(sanitizeGig);

    res.status(200).json({
      success: true,
      count: sanitizedGigs.length,
      gigs: sanitizedGigs,
    });
  } catch (error) {
    console.error("Get My Gigs Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};