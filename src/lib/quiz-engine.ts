/**
 * Universal Quiz Engine
 * Supports: score_based, personality_based, weighted_personality, percentage_matching
 */

export type QuizType =
  | "score_based"
  | "personality_based"
  | "weighted_personality"
  | "percentage_matching";

export interface Answer {
  id: string;
  text: string;
  weights?: Record<string, number>; // e.g., { analytical: 3, mature: 2 }
  score?: number; // For score_based quizzes
  resultId?: string; // For simple personality_based quizzes
}

export interface Question {
  id: string;
  text: string;
  description?: string;
  image?: string;
  answers: Answer[];
  type?: "single" | "multiple"; // single or multiple choice
}

export interface Result {
  id: string;
  title: string;
  description: string;
  image?: string;
  strengths?: string[];
  weaknesses?: string[];
  careers?: string[];
  percentage?: number; // Calculated percentage match
  personality?: string; // Personality category name
}

export interface QuizConfig {
  id: string;
  type: QuizType;
  title: string;
  description: string;
  questions: Question[];
  results: Result[];
}

export interface UserAnswers {
  [questionId: string]: string | string[]; // Single or multiple answer IDs
}

export interface QuizResult {
  primaryResult: Result;
  allResults: Result[]; // Sorted by percentage
  scores: Record<string, number>; // Raw scores/weights
  percentages: Record<string, number>; // Calculated percentages
  quizId: string;
  completedAt: Date;
}

/**
 * Core Quiz Engine
 */
export class QuizEngine {
  private config: QuizConfig;
  private userAnswers: UserAnswers = {};

  constructor(config: QuizConfig) {
    this.config = config;
  }

  /**
   * Record a user's answer
   */
  public answerQuestion(questionId: string, answerId: string | string[]): void {
    this.userAnswers[questionId] = answerId;
  }

  /**
   * Calculate final result based on quiz type
   */
  public calculateResult(): QuizResult {
    switch (this.config.type) {
      case "weighted_personality":
        return this.calculateWeightedPersonality();
      case "score_based":
        return this.calculateScoreBased();
      case "personality_based":
        return this.calculatePersonalityBased();
      case "percentage_matching":
        return this.calculatePercentageMatching();
      default:
        throw new Error(`Unknown quiz type: ${this.config.type}`);
    }
  }

  /**
   * Weighted Personality (Default)
   * Aggregates personality weights from all answers
   */
  private calculateWeightedPersonality(): QuizResult {
    const scores: Record<string, number> = {};

    // Initialize all personality categories
    this.config.results.forEach((result) => {
      scores[result.id] = 0;
    });

    // Aggregate weights from user answers
    for (const questionId in this.userAnswers) {
      const answerIds = Array.isArray(this.userAnswers[questionId])
        ? this.userAnswers[questionId]
        : [this.userAnswers[questionId]];

      for (const answerId of answerIds) {
        const answer = this.findAnswer(answerId);
        if (answer && answer.weights) {
          for (const [personality, weight] of Object.entries(answer.weights)) {
            scores[personality] = (scores[personality] || 0) + weight;
          }
        }
      }
    }

    // Calculate percentages
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const percentages: Record<string, number> = {};

    for (const [personality, score] of Object.entries(scores)) {
      percentages[personality] =
        totalScore > 0 ? Math.round((score / totalScore) * 100) : 0;
    }

    return this.buildResult(scores, percentages);
  }

  /**
   * Score-Based Quiz
   * Simple accumulation of numeric scores
   */
  private calculateScoreBased(): QuizResult {
    let totalScore = 0;

    for (const questionId in this.userAnswers) {
      const answerId = Array.isArray(this.userAnswers[questionId])
        ? (this.userAnswers[questionId] as string[])[0]
        : (this.userAnswers[questionId] as string);

      const answer = this.findAnswer(answerId);
      if (answer && answer.score !== undefined) {
        totalScore += answer.score;
      }
    }

    // Map score to result (find result that matches score range)
    const primaryResult = this.mapScoreToResult();
    const scores = { total: totalScore };
    const percentages = { total: 100 };

    return {
      primaryResult,
      allResults: [primaryResult],
      scores,
      percentages,
      quizId: this.config.id,
      completedAt: new Date(),
    };
  }

  /**
   * Personality-Based Quiz
   * Direct mapping of answers to result types
   */
  private calculatePersonalityBased(): QuizResult {
    const resultCounts: Record<string, number> = {};

    // Count how many times each result was selected
    for (const questionId in this.userAnswers) {
      const answerIds = Array.isArray(this.userAnswers[questionId])
        ? this.userAnswers[questionId]
        : [this.userAnswers[questionId]];

      for (const answerId of answerIds) {
        const answer = this.findAnswer(answerId);
        if (answer && answer.resultId) {
          resultCounts[answer.resultId] =
            (resultCounts[answer.resultId] || 0) + 1;
        }
      }
    }

    // Find result with highest count
    const topResultId = Object.entries(resultCounts).sort(
      ([, a], [, b]) => b - a,
    )[0]?.[0];

    const primaryResult =
      this.config.results.find((r) => r.id === topResultId) ||
      this.config.results[0];

    const percentages: Record<string, number> = {};
    const totalAnswers = Object.values(this.userAnswers).reduce(
      (sum, ans) => sum + (Array.isArray(ans) ? ans.length : 1),
      0,
    );

    for (const [resultId, count] of Object.entries(resultCounts)) {
      percentages[resultId] = Math.round((count / totalAnswers) * 100);
    }

    return {
      primaryResult,
      allResults: this.config.results,
      scores: resultCounts,
      percentages,
      quizId: this.config.id,
      completedAt: new Date(),
    };
  }

  /**
   * Percentage Matching
   * Shows match percentage for each result category
   */
  private calculatePercentageMatching(): QuizResult {
    const scores: Record<string, number> = {};

    // Initialize all results
    this.config.results.forEach((result) => {
      scores[result.id] = 0;
    });

    // Aggregate weights (similar to weighted_personality)
    for (const questionId in this.userAnswers) {
      const answerIds = Array.isArray(this.userAnswers[questionId])
        ? this.userAnswers[questionId]
        : [this.userAnswers[questionId]];

      for (const answerId of answerIds) {
        const answer = this.findAnswer(answerId);
        if (answer && answer.weights) {
          for (const [personality, weight] of Object.entries(answer.weights)) {
            scores[personality] = (scores[personality] || 0) + weight;
          }
        }
      }
    }

    // Calculate percentages out of max possible
    const maxScore = Math.max(...Object.values(scores));
    const percentages: Record<string, number> = {};

    for (const [personality, score] of Object.entries(scores)) {
      percentages[personality] =
        maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    }

    return this.buildResult(scores, percentages);
  }

  /**
   * Build final result object
   */
  private buildResult(
    scores: Record<string, number>,
    percentages: Record<string, number>,
  ): QuizResult {
    // Sort results by percentage
    const sortedResults = this.config.results
      .map((result) => ({
        ...result,
        percentage: percentages[result.id] || 0,
      }))
      .sort((a, b) => (b.percentage || 0) - (a.percentage || 0));

    return {
      primaryResult: sortedResults[0],
      allResults: sortedResults,
      scores,
      percentages,
      quizId: this.config.id,
      completedAt: new Date(),
    };
  }

  /**
   * Helper: Find answer by ID across all questions
   */
  private findAnswer(answerId: string): Answer | undefined {
    for (const question of this.config.questions) {
      const answer = question.answers.find((a) => a.id === answerId);
      if (answer) return answer;
    }
    return undefined;
  }

  /**
   * Helper: Map numeric score to result (for score_based)
   */
  private mapScoreToResult(): Result {
    // Simple implementation: return first result
    // In production, you'd map score ranges to specific results
    return this.config.results[0];
  }

  /**
   * Get current progress
   */
  public getProgress(): number {
    return Math.round(
      (Object.keys(this.userAnswers).length / this.config.questions.length) *
        100,
    );
  }

  /**
   * Get answered questions count
   */
  public getAnsweredCount(): number {
    return Object.keys(this.userAnswers).length;
  }

  /**
   * Check if quiz is complete
   */
  public isComplete(): boolean {
    return this.getAnsweredCount() === this.config.questions.length;
  }
}
