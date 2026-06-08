import React from "react";
import { Link } from "react-router-dom";
import { Clock, Users, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { staggerItem, tapScale } from "@/lib/motion";

export interface QuizCardData {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  thumbnail?: string;
  questionCount: number;
  estimatedMinutes: number;
  completions: number;
  tags?: string[];
}

interface QuizCardProps {
  quiz: QuizCardData;
  loading?: boolean;
}

export function QuizCard({ quiz, loading = false }: QuizCardProps) {
  if (loading) {
    return (
      <div className="quiz-card rounded-2xl overflow-hidden">
        <div className="skeleton aspect-video w-full" />
        <div className="p-4 flex flex-col gap-3">
          <div className="skeleton h-5 w-2/3 rounded-lg" />
          <div className="skeleton h-4 w-full rounded-lg" />
          <div className="skeleton h-4 w-3/4 rounded-lg" />
          <div className="flex gap-2 mt-1">
            <div className="skeleton h-5 w-16 rounded-full" />
            <div className="skeleton h-5 w-16 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={staggerItem} whileTap={tapScale}>
      <Link
        to={`/quiz/${quiz.slug}`}
        className="block focus:outline-none group"
      >
        <article className="quiz-card rounded-2xl overflow-hidden h-full flex flex-col">
          {/* Thumbnail */}
          <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-fuchsia-900/40 to-violet-900/40">
            {quiz.thumbnail ? (
              <img
                src={quiz.thumbnail}
                alt={quiz.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl">🧠</span>
              </div>
            )}
            <Badge
              className="absolute top-3 left-3 backdrop-blur-sm"
              variant="secondary"
            >
              {quiz.category}
            </Badge>
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col gap-2 flex-1">
            <h3 className="font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
              {quiz.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
              {quiz.description}
            </p>

            <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {quiz.estimatedMinutes}m
                </span>
                <span className="flex items-center gap-1">
                  <Users className="size-3" />
                  {quiz.completions.toLocaleString()}
                </span>
              </div>
              <span className="flex items-center gap-0.5 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Start <ChevronRight className="size-3" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

export function SectionHeader({
  title,
  viewAllTo,
}: {
  title: React.ReactNode;
  viewAllTo?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h2>
      {viewAllTo && (
        <Link
          to={viewAllTo}
          className="text-sm text-primary hover:underline flex items-center gap-1 transition-colors"
        >
          View All <ChevronRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
