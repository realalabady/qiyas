/**
 * Result Page — Display quiz results with sharing options, powered by Quiz Engine.
 */

import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { QuizCard } from "@/components/quiz/quiz-card";
import { ResultsDisplay } from "@/components/quiz/results-display";
import {
  pageTransition,
  fadeUp,
  staggerContainer,
  staggerItem,
} from "@/lib/motion";
import { Share2, Copy, RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuizzesAdmin } from "@/stores/quizzes-admin-store";
import { useQuizTakeStore } from "@/stores/quiz-take-store";
import type { QuizResult } from "@/lib/quiz-engine";

export function QuizResultPage() {
  const { slug, resultId } = useParams<{ slug: string; resultId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const quizStore = useQuizzesAdmin();
  const quizTakeStore = useQuizTakeStore();
  const [copied, setCopied] = useState(false);

  // Find the quiz
  const quiz = quizStore.quizzes.find((q) => q.slug === slug);

  // Resolve the result with graceful fallbacks so refreshed or shared
  // /quiz/:slug/result/:resultId links don't break:
  //   1. router state (fresh completion in this tab)
  //   2. localStorage snapshot of the last completion in this browser
  //   3. reconstruct a generic view of the result type from the :resultId param
  const { result, timeSpent } = useMemo<{
    result: QuizResult | null;
    timeSpent: number | undefined;
  }>(() => {
    if (location.state?.result) {
      return {
        result: location.state.result as QuizResult,
        timeSpent: location.state.timeSpent as number | undefined,
      };
    }

    try {
      const raw = localStorage.getItem(`qiyas-last-result:${slug}`);
      if (raw) {
        const saved = JSON.parse(raw) as {
          result: QuizResult;
          timeSpent?: number;
        };
        if (!resultId || saved.result?.primaryResult?.id === resultId) {
          return { result: saved.result, timeSpent: saved.timeSpent };
        }
      }
    } catch {
      // ignore malformed/unavailable storage
    }

    if (quiz && resultId) {
      const matched = quiz.results.find((r) => r.id === resultId);
      if (matched) {
        return {
          result: {
            primaryResult: matched,
            allResults: quiz.results,
            scores: {},
            percentages: {},
            quizId: quiz.id,
            completedAt: new Date(),
          },
          timeSpent: undefined,
        };
      }
    }

    return { result: null, timeSpent: undefined };
  }, [location.state, slug, resultId, quiz]);

  // Get suggested quizzes (same category)
  const suggestedQuizzes = quizStore.quizzes
    .filter((q) => q.category === quiz?.category && q.slug !== slug)
    .slice(0, 3);

  if (!quiz || !result) {
    return (
      <motion.div
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center pt-20"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Result Not Found
          </h1>
          <p className="text-slate-400 mb-6">
            The result you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/")} className="gap-2">
            <RotateCcw size={18} />
            Back to Home
          </Button>
        </div>
      </motion.div>
    );
  }

  const resultUrl = `${window.location.origin}/quiz/${slug}/result/${result.primaryResult.id}`;
  const shareText = `I got "${result.primaryResult.title}" on the ${quiz.title} quiz! Check it out:`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(resultUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText,
    )}&url=${encodeURIComponent(resultUrl)}`;
    window.open(twitterUrl, "_blank");
  };

  const handleShareFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      resultUrl,
    )}`;
    window.open(fbUrl, "_blank");
  };

  const handleShareWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(
      shareText + " " + resultUrl,
    )}`;
    window.open(waUrl, "_blank");
  };

  const handleRetakeQuiz = () => {
    quizTakeStore.resetQuiz();
    navigate(`/quiz/${slug}/take`);
  };

  const handleContinueByCategory = () => {
    if (!quiz) return;
    const categorySlug = quiz.category.toLowerCase().replace(/\s+/g, "-");
    navigate(`/explore?category=${encodeURIComponent(categorySlug)}`);
  };

  const handleDownloadResult = async () => {
    const element = document.getElementById("result-card");
    if (!element) return;
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(element, {
        backgroundColor: "#0f172a", // slate-900 to match the page background
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `${slug || "quiz"}-result.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 px-4 pb-12"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center mb-12"
        >
          <div className="inline-block mb-6 p-3 bg-green-500/10 rounded-full">
            <Sparkles size={32} className="text-green-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Quiz Complete!
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            {timeSpent && (
              <>
                You completed this in {Math.floor(timeSpent / 60)} minutes and{" "}
                {timeSpent % 60} seconds.
              </>
            )}
          </p>
        </motion.div>

        {/* Results Display with Engine Results */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          id="result-card"
          className="mb-12"
        >
          {result && (
            <ResultsDisplay
              result={result}
              onShare={handleShareTwitter}
              onDownload={handleDownloadResult}
              onContinue={handleContinueByCategory}
            />
          )}
        </motion.div>

        {/* Sharing Section */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 mb-12 border border-slate-700"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Share2 size={24} />
            Share Your Result
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="gap-2 justify-center"
            >
              <Copy size={18} />
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </Button>
            <Button
              onClick={handleShareTwitter}
              className="gap-2 justify-center bg-blue-600 hover:bg-blue-700"
            >
              <span>𝕏</span>
              Twitter
            </Button>
            <Button
              onClick={handleShareFacebook}
              className="gap-2 justify-center bg-blue-800 hover:bg-blue-900"
            >
              <span>f</span>
              Facebook
            </Button>
            <Button
              onClick={handleShareWhatsApp}
              className="gap-2 justify-center bg-green-600 hover:bg-green-700"
            >
              <span>💬</span>
              WhatsApp
            </Button>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="flex gap-4 justify-center mb-12 flex-wrap"
        >
          <Button onClick={handleRetakeQuiz} className="gap-2">
            <RotateCcw size={18} />
            Retake Quiz
          </Button>
          <Button
            onClick={() => navigate("/explore")}
            variant="outline"
            className="gap-2"
          >
            <Sparkles size={18} />
            Take More Quizzes
          </Button>
        </motion.div>

        {/* Suggested Quizzes */}
        {suggestedQuizzes.length > 0 && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8">
              Similar Quizzes
            </h2>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {suggestedQuizzes.map((suggestedQuiz) => (
                <motion.div key={suggestedQuiz.id} variants={staggerItem}>
                  <Link to={`/quiz/${suggestedQuiz.slug}`}>
                    <QuizCard
                      quiz={{
                        id: suggestedQuiz.id,
                        slug: suggestedQuiz.slug,
                        title: suggestedQuiz.title,
                        description: suggestedQuiz.description,
                        category: suggestedQuiz.category,
                        questionCount: suggestedQuiz.questions.length,
                        estimatedMinutes:
                          Math.ceil(suggestedQuiz.questions.length / 2) || 5,
                        thumbnail: suggestedQuiz.thumbnail,
                        completions: 0,
                      }}
                    />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
