import type { Transition } from "framer-motion"

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 28,
}

export const springSoft: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 26,
}

export const fadeSlideVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
} as const
