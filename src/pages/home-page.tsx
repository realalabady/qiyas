import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuizCard, SectionHeader } from "@/components/quiz/quiz-card";
import { AdBanner } from "@/components/ads/ad-banner";
import { staggerContainer, staggerItem, fadeUp } from "@/lib/motion";
import type { QuizCardData } from "@/components/quiz/quiz-card";

/* ── Sample data ──────────────────────────────────────────────────────────── */
const SAMPLE_QUIZZES: QuizCardData[] = [
  {
    id: "1",
    slug: "personality-color-test",
    title: "What Color Is Your Personality?",
    description:
      "Discover what your favorite colors reveal about your inner self.",
    category: "Personality",
    questionCount: 15,
    estimatedMinutes: 5,
    completions: 142800,
  },
  {
    id: "2",
    slug: "mental-age-test",
    title: "What Is Your Mental Age?",
    description:
      "Find out if your mind is younger or older than your actual age.",
    category: "Mental Age",
    questionCount: 20,
    estimatedMinutes: 7,
    completions: 98500,
  },
  {
    id: "3",
    slug: "iq-test",
    title: "Quick IQ Test — Find Your Score",
    description: "A fun 10-minute test to estimate your intelligence quotient.",
    category: "IQ",
    questionCount: 25,
    estimatedMinutes: 10,
    completions: 215000,
  },
  {
    id: "4",
    slug: "career-personality-test",
    title: "What Career Suits Your Personality?",
    description:
      "Match your strengths and preferences to the perfect career path.",
    category: "Career",
    questionCount: 18,
    estimatedMinutes: 6,
    completions: 73400,
  },
  {
    id: "5",
    slug: "friendship-test",
    title: "What Kind of Friend Are You?",
    description: "Are you the supportive type, the funny one, or the advisor?",
    category: "Friendship",
    questionCount: 12,
    estimatedMinutes: 4,
    completions: 61200,
  },
  {
    id: "6",
    slug: "stress-level-test",
    title: "How Stressed Are You Really?",
    description: "Measure your stress levels and get personalized coping tips.",
    category: "Stress",
    questionCount: 14,
    estimatedMinutes: 5,
    completions: 54700,
  },
];

const CATEGORIES = [
  { emoji: "🧠", label: "Personality", to: "/category/personality" },
  { emoji: "💡", label: "IQ Tests", to: "/category/iq" },
  { emoji: "👶", label: "Mental Age", to: "/category/mental-age" },
  { emoji: "💼", label: "Career", to: "/category/career" },
  { emoji: "💖", label: "Relationship", to: "/category/relationship" },
  { emoji: "🎌", label: "Anime", to: "/category/anime" },
  { emoji: "🎬", label: "Entertainment", to: "/category/entertainment" },
  { emoji: "🌈", label: "Color Tests", to: "/category/color" },
];

/* ── Component ────────────────────────────────────────────────────────────── */
function HomePage() {
  return (
    <div className="relative">
      {/* Ambient gradients */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-0 w-[500px] h-[400px] bg-cyan-600/8 rounded-full blur-[100px]" />
      </div>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 sm:py-32 px-4">
        <motion.div
          className="mx-auto max-w-4xl text-center flex flex-col items-center gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={staggerItem}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight"
          >
            Discover Who <span className="gradient-text">You Really Are</span>
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            Viral personality quizzes, IQ tests, and career assessments — take
            any quiz instantly and share your results with friends.
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="flex flex-wrap gap-3 justify-center"
          >
            <Button size="lg" asChild>
              <Link to="/explore">
                Explore Quizzes <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/categories">Browse Categories</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20 pb-20">
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <SectionHeader
            title="🔥 Trending Quizzes"
            viewAllTo="/explore?sort=trending"
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {SAMPLE_QUIZZES.slice(0, 3).map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </motion.div>
        </motion.section>

        {/* ── Ad Banner ─────────────────────────────────────────────────── */}
        <AdBanner />

        {/* ── Categories ────────────────────────────────────────────────── */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <SectionHeader
            title="📂 Browse by Category"
            viewAllTo="/categories"
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {CATEGORIES.map(({ emoji, label, to }) => (
              <motion.div key={label} variants={staggerItem}>
                <Link
                  to={to}
                  className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 text-center hover:-translate-y-1 hover:border-white/20 transition-all duration-200 block group"
                >
                  <span className="text-3xl">{emoji}</span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ── Popular Quizzes ───────────────────────────────────────────── */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <SectionHeader
            title={
              <>
                <TrendingUp className="inline size-5 mr-2 text-primary" />
                Popular This Week
              </>
            }
            viewAllTo="/explore?sort=popular"
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {SAMPLE_QUIZZES.slice(3).map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </motion.div>
        </motion.section>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="glass-card rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center gap-6 relative overflow-hidden"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-fuchsia-600/10 via-transparent to-violet-600/10" />
          <Badge variant="default">Ready to discover yourself?</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold max-w-xl">
            Take a Quiz — It&apos;s{" "}
            <span className="gradient-text">Completely Free</span>
          </h2>
          <p className="text-muted-foreground max-w-md">
            No account needed. Start any quiz right now and share your results
            with friends.
          </p>
          <Button size="xl" asChild>
            <Link to="/explore">
              Explore All Quizzes <ArrowRight className="size-5" />
            </Link>
          </Button>
        </motion.section>
      </div>
    </div>
  );
}

export default HomePage;
