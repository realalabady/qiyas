/**
 * Quiz Take Page — Interactive quiz flow with Quiz Engine integration.
 * One question per screen with smooth transitions and analytics tracking.
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuizTakeStore } from "@/stores/quiz-take-store";
import { useAnalyticsStore } from "@/stores/analytics-store";
import { useQuizzesAdmin } from "@/stores/quizzes-admin-store";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  pageTransition,
  slideInRight,
  staggerContainer,
  staggerItem,
} from "@/lib/motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { validateQuizConfig } from "@/lib/quiz-validation";

export function QuizTakePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const quizStore = useQuizzesAdmin();
  const quizTakeStore = useQuizTakeStore();
  const analyticsStore = useAnalyticsStore();

  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [startTime] = useState(Date.now());

  // Find the quiz by slug
  const quiz = quizStore.getQuizBySlug(slug || "");
  const validation = quiz ? validateQuizConfig(quiz) : null;

  useEffect(() => {
    if (!quiz) {
      navigate("/not-found");
      return;
    }

    if (!validation?.isValid) {
      return;
    }

    // Initialize quiz if not already started
    if (!quizTakeStore.quizConfig || quizTakeStore.quizConfig.id !== quiz.id) {
      // Convert admin store questions to QuizEngine questions
      const engineQuestions = quiz.questions.map((q) => ({
        id: q.id,
        text: q.text,
        description: q.description,
        image: q.image,
        answers: q.answers,
        type:
          q.type === "personality" || q.type === "scored"
            ? "single"
            : q.type === "multiple-select"
              ? "multiple"
              : "single",
      }));

      const quizConfig = {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        type: quiz.quizType,
        questions: engineQuestions,
        results: quiz.results,
      } as any;
      quizTakeStore.loadQuiz(quizConfig);
    }
  }, [quiz, navigate, quizTakeStore, validation?.isValid]);

  if (!quiz) return null;

  if (!validation?.isValid) {
    return (
      <motion.div
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 px-4 pb-12 flex items-center justify-center"
      >
        <div className="text-center max-w-xl">
          <h1 className="text-3xl font-bold text-white mb-4">
            Quiz Setup Incomplete
          </h1>
          <p className="text-slate-400 mb-6">
            This quiz needs proper question/result mapping before it can produce
            valid results.
          </p>
          <Button onClick={() => navigate(`/quiz/${slug}`)} className="gap-2">
            <ArrowLeft size={18} />
            Back to Quiz
          </Button>
        </div>
      </motion.div>
    );
  }

  const questions = quiz.questions;
  const currentQuestionIndex = quizTakeStore.currentQuestionIndex;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex / questions.length) * 100;

  // Safety check: if currentQuestion is undefined, return error
  if (!currentQuestion) {
    return (
      <motion.div
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 px-4 pb-12 flex items-center justify-center"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Quiz Not Ready</h1>
          <p className="text-slate-400 mb-6">
            This quiz doesn't have any questions configured yet.
          </p>
          <Button onClick={() => navigate("/explore")} className="gap-2">
            <ArrowLeft size={18} />
            Back to Quizzes
          </Button>
        </div>
      </motion.div>
    );
  }

  const handleSelectAnswer = (answerId: string) => {
    setSelectedAnswerId(answerId);
    const currentQ = questions[currentQuestionIndex];
    quizTakeStore.answerQuestion(currentQ.id, answerId);
  };

  const handleNext = () => {
    if (currentQuestionIndex === questions.length - 1) {
      // Quiz completed - calculate result
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      const result = quizTakeStore.calculateResult();
      if (!result) return;

      analyticsStore.recordCompletion({
        quizId: quiz.id,
        quizSlug: quiz.slug,
        resultId: result.primaryResult.id,
        resultTitle: result.primaryResult.title,
        completedAt: new Date(),
        timeSpent,
        userAgent: navigator.userAgent,
        source: "direct",
      });

      navigate(`/quiz/${slug}/result/${result.primaryResult.id}`, {
        state: { result, timeSpent },
      });
    } else {
      quizTakeStore.nextQuestion();
      setSelectedAnswerId(null);
    }
  };

  const handlePrevious = () => {
    quizTakeStore.previousQuestion();
    setSelectedAnswerId(null);
  };

  const handleBack = () => {
    if (
      confirm(
        "Are you sure? Your progress will be lost. This quiz will not be saved.",
      )
    ) {
      quizTakeStore.resetQuiz();
      navigate(`/quiz/${slug}`);
    }
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isAnswered = selectedAnswerId !== null;

  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 px-4 pb-12"
    >
      <div className="max-w-2xl mx-auto mb-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Quiz</span>
        </button>

        <Progress value={progress} className="h-2 mb-4" />
        <p className="text-sm text-slate-400">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mb-12"
          >
            {currentQuestion.image && (
              <img
                src={currentQuestion.image}
                alt="Question"
                className="w-full h-64 object-cover rounded-2xl mb-8"
              />
            )}
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
              {currentQuestion.text}
            </h2>

            <motion.div
              className="space-y-3"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {currentQuestion.answers.map((answer) => (
                <motion.button
                  key={answer.id}
                  onClick={() => handleSelectAnswer(answer.id)}
                  variants={staggerItem}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left group ${
                    selectedAnswerId === answer.id
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 transition-all ${
                        selectedAnswerId === answer.id
                          ? "border-blue-500 bg-blue-500"
                          : "border-slate-600"
                      }`}
                    />
                    <span className="text-white font-medium">
                      {answer.text}
                    </span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-4 justify-between mt-12">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft size={18} />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!isAnswered}
            className="gap-2 min-w-[140px]"
          >
            {isLastQuestion ? (
              <>
                <Check size={18} />
                Submit
              </>
            ) : (
              <>
                <span>Next</span>
                <ArrowRight size={18} />
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
