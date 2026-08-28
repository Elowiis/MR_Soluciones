"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Quote, ExternalLink, PenLine } from "lucide-react"
import type { GooglePlaceReviews, GoogleReview } from "@/lib/google-reviews"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
}

const MAX_PREVIEW_LENGTH = 240

/**
 * El panel de valoración ocupa la primera celda del grid, así que solo caben
 * 5 reseñas para mantener la retícula 3x2 en desktop y 2x3 en tablet.
 */
const REVIEWS_IN_GRID = 5

/** Logotipo "G" de Google (legible sobre fondo claro y oscuro). */
function GoogleG({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function Stars({
  rating,
  className = "w-4 h-4",
  emptyClassName = "text-gray-200",
}: {
  rating: number
  className?: string
  emptyClassName?: string
}) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`${className} ${
            index < Math.round(rating) ? "fill-amber-400 text-amber-400" : emptyClassName
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

/** Tarjeta destacada con la nota media y los enlaces al perfil de Google. */
function RatingPanel({ data, className = "" }: { data: GooglePlaceReviews; className?: string }) {
  const formattedRating = data.rating.toLocaleString("es-ES", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })

  return (
    <motion.div
      variants={cardVariants}
      className={`relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-green-800 via-green-800 to-emerald-900 p-6 text-white shadow-lg shadow-green-900/20 sm:p-7 ${className}`}
    >
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
      <div className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-emerald-400/10 blur-2xl" aria-hidden="true" />

      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 ring-1 ring-inset ring-white/15">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white">
            <GoogleG className="h-3 w-3" />
          </span>
          Valoración en Google
        </div>

        <div className="mt-5 flex items-end gap-3">
          <span className="text-6xl font-bold leading-none tracking-tight sm:text-7xl">{formattedRating}</span>
          <div className="pb-1">
            <Stars rating={data.rating} className="h-5 w-5" emptyClassName="text-white/25" />
            <p className="mt-1.5 text-sm text-white/70">
              {data.totalRatings} {data.totalRatings === 1 ? "reseña" : "reseñas"}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-7 flex flex-col gap-2.5">
        {data.reviewsUri && (
          <a
            href={data.reviewsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-green-900 shadow-sm transition-colors hover:bg-green-50"
          >
            Ver todas en Google
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        )}

        {data.writeReviewUri && (
          <a
            href={data.writeReviewUri}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <PenLine className="h-4 w-4" aria-hidden="true" />
            Escribe tu reseña
          </a>
        )}
      </div>
    </motion.div>
  )
}

function ReviewCard({ review }: { review: GoogleReview }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = review.text.length > MAX_PREVIEW_LENGTH
  const displayText = expanded || !isLong ? review.text : `${review.text.slice(0, MAX_PREVIEW_LENGTH).trimEnd()}…`

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="group relative flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-green-600/20 hover:shadow-xl hover:shadow-green-900/5 sm:p-6"
    >
      <Quote
        className="pointer-events-none absolute right-5 top-5 h-7 w-7 text-green-100 transition-colors group-hover:text-green-200"
        aria-hidden="true"
      />

      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          {review.authorPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={review.authorPhoto}
              alt=""
              width={44}
              height={44}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="h-11 w-11 rounded-full border border-gray-100 object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100 font-bold text-green-800">
              {review.authorName.charAt(0).toUpperCase()}
            </div>
          )}

          <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-100">
            <GoogleG className="h-3 w-3" />
          </span>
        </div>

        <div className="min-w-0 pr-8">
          <p className="truncate font-semibold text-gray-900">{review.authorName}</p>
          <p className="text-xs text-gray-500">{review.relativeTime}</p>
        </div>
      </div>

      <div className="mt-4">
        <Stars rating={review.rating} />
      </div>

      <p className="mt-3 flex-1 whitespace-pre-line text-sm leading-relaxed text-gray-600 sm:text-[15px]">
        {displayText}
      </p>

      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-4 self-start text-sm font-semibold text-green-700 transition-colors hover:text-green-800 hover:underline"
        >
          {expanded ? "Leer menos" : "Leer más"}
        </button>
      )}
    </motion.article>
  )
}

export function GoogleReviewsGrid({ data }: { data: GooglePlaceReviews }) {
  const reviews = data.reviews.slice(0, REVIEWS_IN_GRID)
  const hasReviews = reviews.length > 0

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-green-50/40 to-white px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8">
      {/* Blobs decorativos, consistentes con el resto de secciones */}
      <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-green-200 opacity-20 blur-3xl" aria-hidden="true" />
      <div className="absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-emerald-200 opacity-20 blur-3xl" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Cabecera */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center sm:mb-14"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700">
            <Star className="h-4 w-4 fill-green-700" aria-hidden="true" />
            Lo que dicen nuestros clientes
          </span>
          <h2 className="mb-3 text-3xl font-bold text-gray-900 sm:mb-4 sm:text-4xl md:text-5xl">
            Opiniones reales de clientes
          </h2>
          <p className="mx-auto max-w-2xl px-4 text-base text-gray-600 sm:text-lg md:text-xl">
            Familias de El Bierzo que ya han comprado, vendido o alquilado con nosotros.
          </p>
        </motion.div>

        {/* Panel de valoración + reseñas en una única retícula */}
        {hasReviews ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
          >
            <RatingPanel data={data} />
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="mx-auto max-w-md"
          >
            <RatingPanel data={data} />
          </motion.div>
        )}

        <p className="mt-8 text-center text-xs text-gray-400">
          Reseñas obtenidas de Google. Google y el logotipo de Google son marcas de Google LLC.
        </p>
      </div>
    </section>
  )
}
