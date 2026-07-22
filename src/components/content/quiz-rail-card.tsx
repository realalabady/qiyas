import { QuizCard } from "@/components/quiz/quiz-card";
import { useLanguage } from "@/lib/i18n";
import { categoryLabel } from "@/lib/category-i18n";
import { localizedQuiz } from "@/lib/localized-content";
import type { Quiz } from "@/stores/quizzes-admin-store";

/**
 * Adapter that turns a raw `Quiz` into the `QuizCardData` shape the shared
 * QuizCard expects, localizing display text and the category label. Keeps the
 * various rails (homepage, related, sidebar) free of repeated mapping.
 */
export function QuizRailCard({ quiz: raw }: { quiz: Quiz }) {
  const { t, language } = useLanguage();
  const q = localizedQuiz(raw, language);
  return (
    <QuizCard
      quiz={{
        id: q.id,
        slug: q.slug,
        title: q.title,
        description: q.description,
        category: categoryLabel(raw.category, t),
        thumbnail: q.thumbnail,
        questionCount: q.questions.length,
        estimatedMinutes: Math.ceil(q.questions.length / 2) || 5,
        completions: 0,
      }}
    />
  );
}
