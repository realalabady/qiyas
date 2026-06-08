import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  Users,
  BarChart2,
  ArrowRight,
  ChevronLeft,
  Tag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuizCard, SectionHeader } from "@/components/quiz/quiz-card";
import { AdBanner } from "@/components/ads/ad-banner";
import { staggerContainer, staggerItem, fadeUp, scaleIn } from "@/lib/motion";
import { QUIZZES, getRelatedQuizzes } from "@/data/seed-quizzes";

export default function QuizDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const quiz = QUIZZES.find((q) => q.slug === slug);

  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <p className="text-6xl">😕</p>
        <h1 className="text-2xl font-bold">Quiz Not Found</h1>
        <p className="text-muted-foreground">
          This quiz doesn&apos;t exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/explore">Browse All Quizzes</Link>
        </Button>
      </div>
    );
  }

  const related = getRelatedQuizzes(quiz.slug, 3);
  const difficultyColor = {
    Easy: "success",
    Medium: "warning",
    Hard: "destructive",
  } as const;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Back link */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="size-4" />
          Back
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left: main content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Hero card */}
          <motion.div variants={scaleIn} initial="hidden" animate="visible">
            <div className="glass-card rounded-3xl overflow-hidden">
              {/* Thumbnail / gradient banner */}
              <div className="relative h-52 sm:h-64 bg-gradient-to-br from-fuchsia-900/60 via-violet-900/60 to-cyan-900/40 flex items-center justify-center">
                {quiz.thumbnail ? (
                  <img
                    src={quiz.thumbnail}
                    alt={quiz.title}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                ) : (
                  <span className="text-7xl">🧠</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent" />
                <Badge
                  className="absolute top-4 left-4"
                  variant={difficultyColor[quiz.difficulty]}
                >
                  {quiz.difficulty}
                </Badge>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <Badge variant="secondary">{quiz.category}</Badge>
                <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                  {quiz.title}
                </h1>
                <p className="text-muted-foreground leading-relaxed">
                  {quiz.longDescription}
                </p>

                {/* Stats row */}
                <div className="flex flex-wrap gap-5 text-sm text-muted-foreground border-t border-border/50 pt-4">
                  <span className="flex items-center gap-1.5">
                    <BarChart2 className="size-4 text-primary" />
                    {quiz.questionCount} questions
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-4 text-primary" />~
                    {quiz.estimatedMinutes} minutes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="size-4 text-primary" />
                    {quiz.completions.toLocaleString()} taken
                  </span>
                </div>

                {/* Tags */}
                {quiz.tags && quiz.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 items-center">
                    <Tag className="size-3.5 text-muted-foreground" />
                    {quiz.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-border/40 text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Ad between detail and related */}
          <AdBanner />

          {/* Related quizzes */}
          {related.length > 0 && (
            <motion.section
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <SectionHeader
                title="Related Quizzes"
                viewAllTo={`/explore?category=${quiz.category}`}
              />
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-5"
              >
                {related.map((q) => (
                  <motion.div key={q.id} variants={staggerItem}>
                    <QuizCard quiz={q} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>
          )}
        </div>

        {/* Right: sticky CTA sidebar */}
        <div className="lg:col-span-2">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="sticky top-24 space-y-4"
          >
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Ready to start?
                </p>
                <p className="font-semibold text-lg">
                  {quiz.questionCount} questions · ~{quiz.estimatedMinutes} min
                </p>
              </div>

              <Button size="lg" className="w-full" asChild>
                <Link to={`/quiz/${quiz.slug}/take`}>
                  Start Quiz <ArrowRight className="size-5" />
                </Link>
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Free · No account required · Instant results
              </p>

              <div className="border-t border-border/40 pt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Category</span>
                  <span className="text-foreground font-medium">
                    {quiz.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Difficulty</span>
                  <span className="text-foreground font-medium">
                    {quiz.difficulty}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Completions</span>
                  <span className="text-foreground font-medium">
                    {quiz.completions.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Sidebar ad */}
            <AdBanner />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
