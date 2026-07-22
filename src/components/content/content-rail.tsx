import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { SectionHeader } from "@/components/quiz/quiz-card";
import { staggerContainer, fadeUp } from "@/lib/motion";

/**
 * A titled, animated grid rail of cards. Used by the homepage and detail pages
 * to render the Latest / Trending / Popular / Related sections consistently.
 * `viewAllTo` renders a crawlable "View all" anchor via SectionHeader.
 */
export function ContentRail({
  title,
  viewAllTo,
  children,
  cols = 3,
}: {
  title: ReactNode;
  viewAllTo?: string;
  children: ReactNode;
  cols?: 2 | 3 | 4;
}) {
  const gridCols =
    cols === 4
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
      : cols === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <SectionHeader title={title} viewAllTo={viewAllTo} />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={`grid ${gridCols} gap-5`}
      >
        {children}
      </motion.div>
    </motion.section>
  );
}
