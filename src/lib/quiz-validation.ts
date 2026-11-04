import type { Quiz, QuizFormData } from "@/stores/quizzes-admin-store";

type QuizLike = QuizFormData | Quiz;

export interface QuizValidationResult {
  isValid: boolean;
  errors: string[];
}

export function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getResultOptions(results: QuizLike["results"]): Array<{
  id: string;
  label: string;
}> {
  return results
    .map((result) => ({
      id: (result.id || "").trim(),
      label: result.title?.trim() || result.id || "Untitled result",
    }))
    .filter((result) => result.id.length > 0);
}

type TFn = (key: string) => string;

const defaultT: TFn = (key) => key;

export function validateQuizConfig(
  quiz: QuizLike,
  t: TFn = defaultT,
): QuizValidationResult {
  const errors: string[] = [];

  if (!quiz.title.trim()) errors.push(t("admin.quiz.validation.title_required"));
  if (!quiz.description.trim()) errors.push(t("admin.quiz.validation.desc_required"));
  if (quiz.questions.length === 0) errors.push(t("admin.quiz.validation.min_questions"));
  if (quiz.results.length === 0) errors.push(t("admin.quiz.validation.min_results"));

  const resultIds = new Set(
    quiz.results.map((result) => result.id.trim()).filter(Boolean),
  );

  if (resultIds.size !== quiz.results.length) {
    errors.push(t("admin.quiz.validation.unique_result_ids"));
  }

  quiz.questions.forEach((question, questionIndex) => {
    const prefix = `Q${questionIndex + 1}`;
    if (!question.text.trim())
      errors.push(`${prefix}: ${t("admin.quiz.validation.question_text_required")}`);
    if (question.answers.length < 2) {
      errors.push(`${prefix}: ${t("admin.quiz.validation.min_answers")}`);
    }

    // Weighting is checked per question, not per answer.
    //
    // Requiring a positive weight on every single answer breaks the ordinary
    // Likert item, where "does not apply to me at all" is supposed to add
    // nothing — that is what the bottom of the scale means. Two published
    // quizzes scored on a 0-4 agreement scale were rejected by that rule and
    // showed "Quiz Setup Incomplete" instead of running.
    //
    // What actually matters is that the question can move some result, and
    // that no answer points at a result that does not exist.
    if (
      quiz.quizType === "weighted_personality" ||
      quiz.quizType === "percentage_matching"
    ) {
      let movesAResult = false;
      question.answers.forEach((answer, answerIndex) => {
        const entries = Object.entries(answer.weights ?? {});
        if (entries.some(([id]) => !resultIds.has(id))) {
          errors.push(
            `${prefix} A${answerIndex + 1}: ${t("admin.quiz.validation.answer_weight_unknown_result")}`,
          );
        }
        if (
          entries.some(
            ([id, value]) =>
              resultIds.has(id) && Number.isFinite(value) && value > 0,
          )
        ) {
          movesAResult = true;
        }
      });
      if (!movesAResult) {
        errors.push(`${prefix}: ${t("admin.quiz.validation.question_weight_required")}`);
      }
    }

    question.answers.forEach((answer, answerIndex) => {
      const answerPrefix = `${prefix} A${answerIndex + 1}`;
      if (!answer.text.trim()) {
        errors.push(`${answerPrefix}: ${t("admin.quiz.validation.answer_text_required")}`);
      }

      if (quiz.quizType === "personality_based") {
        if (!answer.resultId || !resultIds.has(answer.resultId)) {
          errors.push(
            `${answerPrefix}: ${t("admin.quiz.validation.answer_result_required")}`,
          );
        }
      }

      if (quiz.quizType === "score_based") {
        if (!Number.isFinite(answer.score)) {
          errors.push(`${answerPrefix}: ${t("admin.quiz.validation.answer_score_required")}`);
        }
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}
