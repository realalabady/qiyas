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

export function validateQuizConfig(quiz: QuizLike): QuizValidationResult {
  const errors: string[] = [];

  if (!quiz.title.trim()) errors.push("Quiz title is required.");
  if (!quiz.description.trim()) errors.push("Quiz description is required.");
  if (quiz.questions.length === 0) errors.push("Add at least 1 question.");
  if (quiz.results.length === 0) errors.push("Add at least 1 result.");

  const resultIds = new Set(
    quiz.results.map((result) => result.id.trim()).filter(Boolean),
  );

  if (resultIds.size !== quiz.results.length) {
    errors.push("Each result must have a unique non-empty ID.");
  }

  quiz.questions.forEach((question, questionIndex) => {
    const prefix = `Q${questionIndex + 1}`;
    if (!question.text.trim())
      errors.push(`${prefix}: question text is required.`);
    if (question.answers.length < 2) {
      errors.push(`${prefix}: add at least 2 answers.`);
    }

    question.answers.forEach((answer, answerIndex) => {
      const answerPrefix = `${prefix} A${answerIndex + 1}`;
      if (!answer.text.trim()) {
        errors.push(`${answerPrefix}: answer text is required.`);
      }

      if (
        quiz.quizType === "weighted_personality" ||
        quiz.quizType === "percentage_matching"
      ) {
        const weights = answer.weights ?? {};
        const validWeightedEntries = Object.entries(weights).filter(
          ([resultId, value]) =>
            resultIds.has(resultId) && Number.isFinite(value) && value > 0,
        );
        if (validWeightedEntries.length === 0) {
          errors.push(
            `${answerPrefix}: add at least one positive weight mapped to a valid result ID.`,
          );
        }
      }

      if (quiz.quizType === "personality_based") {
        if (!answer.resultId || !resultIds.has(answer.resultId)) {
          errors.push(
            `${answerPrefix}: map the answer to an existing result ID.`,
          );
        }
      }

      if (quiz.quizType === "score_based") {
        if (!Number.isFinite(answer.score)) {
          errors.push(`${answerPrefix}: score must be a valid number.`);
        }
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}
