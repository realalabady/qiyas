import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Download, ArrowRight } from "lucide-react";
import type { QuizResult } from "@/lib/quiz-engine";

interface ResultsDisplayProps {
  result: QuizResult;
  onShare?: () => void;
  onDownload?: () => void;
  onContinue?: () => void;
}

export function ResultsDisplay({
  result,
  onShare,
  onDownload,
  onContinue,
}: ResultsDisplayProps) {
  const primaryResult = result.primaryResult;
  const topMatches = result.allResults.slice(1, 4); // Top 3 additional matches

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Primary Result */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="glass-card overflow-hidden mb-8">
            {/* Result Image */}
            {primaryResult.image && (
              <div className="h-64 overflow-hidden">
                <img
                  src={primaryResult.image}
                  alt={primaryResult.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Result Content */}
            <div className="p-8">
              {/* Title */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl font-bold gradient-text mb-2"
              >
                {primaryResult.title}
              </motion.h1>

              {/* Percentage */}
              {primaryResult.percentage !== undefined && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-muted-foreground mb-4"
                >
                  <span className="text-3xl font-bold text-primary">
                    {primaryResult.percentage}%
                  </span>{" "}
                  match
                </motion.div>
              )}

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-foreground/90 mb-8 leading-relaxed"
              >
                {primaryResult.description}
              </motion.p>

              {/* Strengths */}
              {primaryResult.strengths &&
                primaryResult.strengths.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mb-8"
                  >
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                      Your Strengths
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {primaryResult.strengths.map((strength) => (
                        <span
                          key={strength}
                          className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium"
                        >
                          {strength}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

              {/* Weaknesses */}
              {primaryResult.weaknesses &&
                primaryResult.weaknesses.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mb-8"
                  >
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">
                      Potential Challenges
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {primaryResult.weaknesses.map((weakness) => (
                        <span
                          key={weakness}
                          className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium"
                        >
                          {weakness}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

              {/* Careers */}
              {primaryResult.careers && primaryResult.careers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mb-8"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-green-400 mb-3">
                    Suggested Careers
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {primaryResult.careers.map((career) => (
                      <span
                        key={career}
                        className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium"
                      >
                        {career}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap gap-3 pt-6 border-t border-white/10"
              >
                {onShare && (
                  <Button onClick={onShare} variant="outline" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share Result
                  </Button>
                )}
                {onDownload && (
                  <Button
                    onClick={onDownload}
                    variant="outline"
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                )}
                {onContinue && (
                  <Button onClick={onContinue} className="gap-2 ml-auto">
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Other Matches */}
        {topMatches.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <h2 className="text-2xl font-bold mb-4">Your Other Matches</h2>
            <div className="grid gap-4">
              {topMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <Card className="glass-card p-6 hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1">
                          {match.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {match.description}
                        </p>
                      </div>
                      {match.percentage !== undefined && (
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-primary">
                            {match.percentage}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            match
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Match Progress Bar */}
                    <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${match.percentage || 0}%`,
                        }}
                        transition={{ duration: 1, delay: 1 + index * 0.1 }}
                        className="h-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Results Breakdown */}
        {result.allResults.length > 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold mb-4">Complete Results</h2>
            <Card className="glass-card p-6">
              <div className="space-y-4">
                {result.allResults.map((res, index) => (
                  <div key={res.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{res.title}</span>
                      <span className="text-sm text-primary font-bold">
                        {res.percentage}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${res.percentage || 0}%`,
                        }}
                        transition={{ duration: 1, delay: 1.5 + index * 0.05 }}
                        className="h-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
