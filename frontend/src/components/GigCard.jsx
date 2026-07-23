import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaStar,
  FaRegClock,
  FaCheckCircle,
  FaArrowRight,
  FaFire,
  FaBolt,
  FaCrown,
  FaBriefcase,
} from "react-icons/fa";

/* ==========================================================
   DEFAULT ASSETS
========================================================== */

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=Professional+Freelancer&background=2563eb&color=fff&size=200";

/* ==========================================================
   HELPERS
========================================================== */

const getNumber = (value, fallback = 0) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};

const formatNumber = (value) => {
  return new Intl.NumberFormat("en-IN").format(
    getNumber(value)
  );
};

const getImageUrl = (image) => {
  if (!image) return DEFAULT_COVER;

  if (typeof image === "string") {
    return image;
  }

  if (typeof image === "object") {
    return (
      image.url ||
      image.secure_url ||
      image.path ||
      DEFAULT_COVER
    );
  }

  return DEFAULT_COVER;
};

/* ==========================================================
   COMPONENT
========================================================== */

export default function GigCard({
  gig = {},
  onFavoriteChange,
}) {
  const [liked, setLiked] = useState(
    Boolean(gig?.isFavorite || gig?.isSaved)
  );

  const [imageError, setImageError] =
    useState(false);

  /* ========================================================
     NORMALIZED DATA
  ======================================================== */

  const freelancer = useMemo(() => {
    return (
      gig?.freelancerSnapshot ||
      gig?.freelancer ||
      {}
    );
  }, [gig]);

  const gigId = gig?._id;

  const image = imageError
    ? DEFAULT_COVER
    : getImageUrl(
        gig?.coverImage ||
          gig?.image
      );

  const name =
    freelancer?.name ||
    gig?.freelancerName ||
    "Professional Freelancer";

  const avatar = getImageUrl(
    freelancer?.profileImage ||
      freelancer?.avatar ||
      freelancer?.profilePicture ||
      freelancer?.image ||
      DEFAULT_AVATAR
  );

  const location =
    gig?.location ||
    freelancer?.country ||
    freelancer?.location ||
    "Remote";

  const skills =
    Array.isArray(gig?.tags) &&
    gig.tags.length > 0
      ? gig.tags
      : Array.isArray(gig?.skills) &&
        gig.skills.length > 0
      ? gig.skills
      : [
          "React",
          "Node.js",
          "UI/UX",
        ];

  const price = getNumber(
    gig?.basicPackage?.price ??
      gig?.startingPrice ??
      gig?.price,
    999
  );

  const delivery = getNumber(
    gig?.basicPackage?.deliveryTime ??
      gig?.estimatedDuration ??
      gig?.deliveryTime,
    3
  );

  const rating = Math.min(
    5,
    Math.max(
      0,
      getNumber(gig?.rating, 4.9)
    )
  );

  const reviews = getNumber(
    gig?.reviewsCount ??
      (Array.isArray(gig?.reviews)
        ? gig.reviews.length
        : gig?.reviews),
    120
  );

  const orders = getNumber(
    gig?.completedOrders ??
      gig?.orders ??
      gig?.totalOrders,
    0
  );

  const category =
    gig?.category ||
    "Development";

  const title =
    gig?.title ||
    "Professional Full Stack Development Service";

  const description =
    gig?.shortDescription ||
    gig?.description ||
    "Professional solutions with clean code, responsive design, and scalable architecture.";

  const verified = Boolean(
    freelancer?.verified ||
      freelancer?.isVerified ||
      gig?.verified
  );

  const featured = Boolean(
    gig?.featured
  );

  const aiRecommended = Boolean(
    gig?.aiRecommended
  );

  const trending = Boolean(
    gig?.trending
  );

  /* ========================================================
     URL
  ======================================================== */

  const gigUrl = gigId
    ? `/gigs/${gigId}`
    : "/browse-gigs";

  /* ========================================================
     FAVORITE HANDLER
  ======================================================== */

  const handleFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const newLiked = !liked;

    setLiked(newLiked);

    if (onFavoriteChange) {
      onFavoriteChange({
        gig,
        liked: newLiked,
      });
    }
  };

  /* ========================================================
     RENDER
  ======================================================== */

  return (
    <motion.article
      layout
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -8,
      }}
      transition={{
        duration: 0.35,
      }}
      className="
        group
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-md
        transition-all
        duration-500
        hover:border-blue-300
        hover:shadow-2xl
      "
    >
      {/* =====================================================
          IMAGE SECTION
      ====================================================== */}

      <div className="relative h-64 overflow-hidden">

        <img
          src={image}
          alt={title}
          loading="lazy"
          onError={() =>
            setImageError(true)
          }
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-110
          "
        />

        {/* Overlay */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-black/90
            via-black/30
            to-transparent
          "
        />

        {/* Top Badges */}

        <div className="absolute left-5 top-5 flex max-w-[75%] flex-wrap gap-2">

          <span className="
            rounded-full
            bg-blue-600
            px-4
            py-2
            text-xs
            font-bold
            uppercase
            tracking-wider
            text-white
            shadow-xl
          ">
            {category}
          </span>

          {featured && (
            <span className="
              flex
              items-center
              gap-1
              rounded-full
              bg-yellow-400
              px-3
              py-2
              text-xs
              font-bold
              text-black
              shadow-lg
            ">
              <FaCrown />
              Featured
            </span>
          )}

          {trending && (
            <span className="
              flex
              items-center
              gap-1
              rounded-full
              bg-red-500
              px-3
              py-2
              text-xs
              font-bold
              text-white
              shadow-lg
            ">
              <FaFire />
              Trending
            </span>
          )}

          {aiRecommended && (
            <span className="
              flex
              items-center
              gap-1
              rounded-full
              bg-violet-600
              px-3
              py-2
              text-xs
              font-bold
              text-white
              shadow-lg
            ">
              <FaBolt />
              AI Pick
            </span>
          )}

        </div>

        {/* Favorite */}

        <motion.button
          type="button"
          whileTap={{
            scale: 0.85,
          }}
          whileHover={{
            scale: 1.1,
          }}
          onClick={handleFavorite}
          aria-label={
            liked
              ? "Remove gig from favorites"
              : "Add gig to favorites"
          }
          aria-pressed={liked}
          className="
            absolute
            right-5
            top-5
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-white/95
            text-lg
            shadow-xl
            backdrop-blur-md
            transition
            hover:bg-white
            focus:outline-none
            focus:ring-4
            focus:ring-blue-300
          "
        >
          {liked ? (
            <FaHeart
              className="text-red-500"
            />
          ) : (
            <FaRegHeart
              className="text-slate-700"
            />
          )}
        </motion.button>

        {/* Rating */}

        <div className="
          absolute
          bottom-5
          left-5
          flex
          items-center
          gap-2
          rounded-full
          bg-white/95
          px-4
          py-2
          shadow-xl
          backdrop-blur-md
        ">
          <FaStar
            className="text-yellow-500"
          />

          <span className="
            font-bold
            text-slate-900
          ">
            {rating.toFixed(1)}
          </span>

          <span className="
            text-sm
            text-slate-500
          ">
            ({formatNumber(reviews)})
          </span>
        </div>

        {/* Image Price */}

        <div className="
          absolute
          bottom-5
          right-5
          rounded-2xl
          bg-black/50
          px-4
          py-2
          backdrop-blur-md
        ">
          <p className="
            text-xs
            uppercase
            tracking-widest
            text-slate-300
          ">
            Starting From
          </p>

          <p className="
            text-2xl
            font-black
            text-green-400
          ">
            ₹{formatNumber(price)}
          </p>
        </div>

      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="flex flex-1 flex-col p-6">

        {/* Freelancer */}

        <div className="
          flex
          items-center
          justify-between
          gap-4
        ">

          <div className="
            flex
            min-w-0
            items-center
            gap-4
          ">

            <div className="relative shrink-0">

              <img
                src={avatar}
                alt={name}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.src =
                    DEFAULT_AVATAR;
                }}
                className="
                  h-14
                  w-14
                  rounded-full
                  border-2
                  border-blue-500
                  object-cover
                  shadow-lg
                "
              />

              {verified && (
                <span className="
                  absolute
                  -bottom-1
                  -right-1
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-full
                  bg-blue-600
                  text-white
                  shadow-lg
                ">
                  <FaCheckCircle
                    className="text-xs"
                  />
                </span>
              )}

            </div>

            <div className="min-w-0">

              <h3 className="
                truncate
                text-lg
                font-bold
                text-slate-900
              ">
                {name}
              </h3>

              <div className="
                mt-1
                flex
                items-center
                gap-2
                text-sm
                text-slate-500
              ">
                <FaMapMarkerAlt
                  className="shrink-0 text-blue-600"
                />

                <span className="truncate">
                  {location}
                </span>
              </div>

            </div>

          </div>

          <div className="
            hidden
            shrink-0
            rounded-xl
            bg-blue-50
            px-3
            py-2
            text-center
            sm:block
          ">

            <p className="
              text-xs
              text-slate-500
            ">
              Rating
            </p>

            <div className="
              flex
              items-center
              gap-1
            ">
              <FaStar
                className="text-yellow-500"
              />

              <span className="font-bold">
                {rating.toFixed(1)}
              </span>
            </div>

          </div>

        </div>

        {/* Title */}

        <Link
          to={gigUrl}
          className="block"
        >
          <h2 className="
            mt-6
            line-clamp-2
            text-2xl
            font-extrabold
            leading-tight
            text-slate-900
            transition
            duration-300
            group-hover:text-blue-600
          ">
            {title}
          </h2>
        </Link>

        {/* Description */}

        <p className="
          mt-4
          line-clamp-3
          text-[15px]
          leading-7
          text-slate-600
        ">
          {description}
        </p>

        {/* Skills */}

        <div className="
          mt-6
          flex
          flex-wrap
          gap-2
        ">
          {skills
            .filter(Boolean)
            .slice(0, 4)
            .map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="
                  rounded-full
                  bg-gradient-to-r
                  from-blue-50
                  to-cyan-50
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  text-blue-700
                  transition
                  hover:scale-105
                  hover:bg-blue-600
                  hover:text-white
                "
              >
                {skill}
              </span>
            ))}
        </div>

        {/* Statistics */}

        <div className="
          mt-8
          grid
          grid-cols-3
          gap-3
          rounded-2xl
          border
          border-slate-200
          bg-slate-50
          p-4
        ">

          <Stat
            icon={
              <FaRegClock
                className="text-blue-600"
              />
            }
            label="Delivery"
            value={`${delivery} Days`}
          />

          <Stat
            icon={
              <FaStar
                className="text-yellow-500"
              />
            }
            label="Reviews"
            value={formatNumber(reviews)}
          />

          <Stat
            icon={
              <FaBriefcase
                className="text-red-500"
              />
            }
            label="Orders"
            value={formatNumber(orders)}
          />

        </div>

      </div>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <div className="
        border-t
        border-slate-200
        bg-gradient-to-r
        from-slate-50
        via-white
        to-blue-50
        p-6
      ">

        <div className="
          flex
          items-end
          justify-between
          gap-4
        ">

          <div>

            <p className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-slate-400
            ">
              Starting From
            </p>

            <div className="
              mt-2
              flex
              items-end
              gap-2
            ">
              <h2 className="
                text-3xl
                font-black
                text-green-600
              ">
                ₹{formatNumber(price)}
              </h2>

              <span className="
                pb-1
                text-sm
                text-slate-500
              ">
                / project
              </span>
            </div>

          </div>

          <div className="
            rounded-2xl
            bg-green-100
            px-4
            py-2
            text-center
          ">
            <p className="
              text-xs
              font-semibold
              uppercase
              text-green-700
            ">
              Delivery
            </p>

            <p className="
              font-bold
              text-green-700
            ">
              {delivery} Days
            </p>
          </div>

        </div>

        {/* Buttons */}

        <div className="
          mt-6
          flex
          gap-3
        ">

          <motion.button
            type="button"
            whileTap={{
              scale: 0.9,
            }}
            whileHover={{
              scale: 1.05,
            }}
            onClick={handleFavorite}
            aria-label={
              liked
                ? "Remove from favorites"
                : "Add to favorites"
            }
            aria-pressed={liked}
            className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
              transition
              hover:border-red-300
              hover:bg-red-50
              focus:outline-none
              focus:ring-4
              focus:ring-red-100
            "
          >
            {liked ? (
              <FaHeart
                className="text-xl text-red-500"
              />
            ) : (
              <FaRegHeart
                className="text-xl text-slate-500"
              />
            )}
          </motion.button>

          <Link
            to={gigUrl}
            className="
              group/button
              flex
              h-14
              flex-1
              items-center
              justify-center
              gap-3
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              via-indigo-600
              to-cyan-500
              px-6
              font-bold
              text-white
              shadow-lg
              transition-all
              duration-300
              hover:shadow-xl
              hover:shadow-blue-300
              focus:outline-none
              focus:ring-4
              focus:ring-blue-200
            "
          >
            View Gig

            <FaArrowRight
              className="
                transition-transform
                duration-300
                group-hover/button:translate-x-2
              "
            />
          </Link>

        </div>

        {/* Trust Indicators */}

        <div className="
          mt-6
          flex
          flex-wrap
          gap-2
        ">

          <TrustBadge>
            ✓ Secure Payment
          </TrustBadge>

          <TrustBadge>
            ✓ Verified Freelancer
          </TrustBadge>

          <TrustBadge>
            ✓ Satisfaction Guaranteed
          </TrustBadge>

        </div>

      </div>

    </motion.article>
  );
}

/* ==========================================================
   STAT COMPONENT
========================================================== */

function Stat({
  icon,
  label,
  value,
}) {
  return (
    <div className="text-center">

      <div className="
        mb-2
        flex
        justify-center
        text-xl
      ">
        {icon}
      </div>

      <p className="
        text-xs
        text-slate-500
      ">
        {label}
      </p>

      <p className="
        mt-1
        truncate
        text-sm
        font-bold
        text-slate-900
      ">
        {value}
      </p>

    </div>
  );
}

/* ==========================================================
   TRUST BADGE
========================================================== */

function TrustBadge({
  children,
}) {
  return (
    <span className="
      rounded-full
      bg-blue-50
      px-3
      py-2
      text-[11px]
      font-semibold
      text-blue-700
    ">
      {children}
    </span>
  );
}
