import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2 } from "lucide-react";
import type { Answer } from "@/stores/quizzes-admin-store";

interface AnswerEditorProps {
  answers: Answer[];
  onChange: (answers: Answer[]) => void;
  quizType: string;
  resultOptions?: Array<{ id: string; label: string }>;
}

export function AnswerEditor({
  answers,
  onChange,
  quizType,
  resultOptions = [],
}: AnswerEditorProps) {
  const { t } = useLanguage();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Answer>({
    id: "",
    text: "",
    weights: {},
    score: 0,
  });

  const handleAddAnswer = () => {
    if (!formData.text.trim()) return;
    if (quizType === "personality_based" && !formData.resultId) return;
    if (
      (quizType === "weighted_personality" ||
        quizType === "percentage_matching") &&
      resultOptions.length > 0
    ) {
      const hasValidWeight = Object.entries(formData.weights || {}).some(
        ([resultId, value]) =>
          resultOptions.some((option) => option.id === resultId) && value > 0,
      );
      if (!hasValidWeight) return;
    }

    if (editingId) {
      onChange(
        answers.map((a) =>
          a.id === editingId ? { ...formData, id: editingId } : a,
        ),
      );
      setEditingId(null);
    } else {
      onChange([
        ...answers,
        {
          id: `answer-${Date.now()}`,
          text: formData.text,
          weights: formData.weights,
          score: formData.score,
          resultId: formData.resultId,
        },
      ]);
    }

    setFormData({ id: "", text: "", weights: {}, score: 0 });
  };

  const handleEditAnswer = (answer: Answer) => {
    setFormData(answer);
    setEditingId(answer.id);
  };

  const handleDeleteAnswer = (id: string) => {
    onChange(answers.filter((a) => a.id !== id));
  };

  const handleSetWeight = (category: string, value: number) => {
    setFormData({
      ...formData,
      weights: {
        ...(formData.weights || {}),
        [category]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{t("admin.quiz.answers.heading")}</h3>
        <span className="text-sm text-muted-foreground">
          {answers.length} {t("admin.quiz.answers.count")}
        </span>
      </div>

      {/* Answers List */}
      {answers.length > 0 && (
        <div className="grid gap-2">
          {answers.map((answer) => (
            <motion.div
              key={answer.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 rounded-lg bg-white/5 border border-border/40 flex items-start justify-between group hover:border-primary/50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{answer.text}</p>
                {quizType === "weighted_personality" && answer.weights && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("admin.quiz.answers.weights_display")}{" "}
                    {Object.entries(answer.weights)
                      .filter(([, v]) => v > 0)
                      .map(([k, v]) => `${k}:${v}`)
                      .join(", ")}
                  </p>
                )}
                {quizType === "score_based" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("admin.quiz.answers.score_display")} {answer.score}
                  </p>
                )}
                {quizType === "personality_based" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("admin.quiz.answers.result_display")} {answer.resultId}
                  </p>
                )}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => handleEditAnswer(answer)}
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => handleDeleteAnswer(answer.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form */}
      <Card className="glass-card p-4 bg-white/2">
        <div className="space-y-3">
          {/* Answer Text */}
          <div>
            <label className="block text-xs font-medium mb-1">
              {t("admin.quiz.answers.text_label")}
            </label>
            <Input
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
              placeholder={t("admin.quiz.answers.text_placeholder")}
            />
          </div>

          {/* Quiz Type Specific Fields */}
          {(quizType === "weighted_personality" ||
            quizType === "percentage_matching") &&
            resultOptions.length > 0 && (
              <div>
                <label className="block text-xs font-medium mb-2">
                  {t("admin.quiz.answers.weights_label")}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {resultOptions.map((option) => (
                    <div key={option.id}>
                      <label className="text-xs text-muted-foreground">
                        {option.label}
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        value={formData.weights?.[option.id] || 0}
                        onChange={(e) =>
                          handleSetWeight(
                            option.id,
                            parseInt(e.target.value) || 0,
                          )
                        }
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

          {quizType === "score_based" && (
            <div>
              <label className="block text-xs font-medium mb-1">
                {t("admin.quiz.answers.score_label")}
              </label>
              <Input
                type="number"
                min="0"
                value={formData.score || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    score: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div>
          )}

          {quizType === "personality_based" && resultOptions.length > 0 && (
            <div>
              <label className="block text-xs font-medium mb-1">
                {t("admin.quiz.answers.maps_to")}
              </label>
              <select
                value={formData.resultId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, resultId: e.target.value })
                }
                className="w-full p-2 rounded-lg bg-white/5 border border-border/40 text-foreground focus:outline-none focus:border-primary/50 text-sm [&>option]:bg-slate-900 [&>option]:text-slate-100"
              >
                <option value="">{t("admin.quiz.answers.select_result")}</option>
                {resultOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Actions */}
          {resultOptions.length === 0 &&
            (quizType === "weighted_personality" ||
              quizType === "percentage_matching" ||
              quizType === "personality_based") && (
              <p className="text-xs text-amber-300">
                {t("admin.quiz.answers.add_results_first")}
              </p>
            )}

          <div className="flex gap-2 justify-end pt-2">
            {editingId && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setFormData({ id: "", text: "", weights: {}, score: 0 });
                  setEditingId(null);
                }}
              >
                {t("admin.common.cancel")}
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleAddAnswer}
              disabled={
                !formData.text.trim() ||
                (quizType === "personality_based" && !formData.resultId) ||
                (((quizType === "weighted_personality" ||
                  quizType === "percentage_matching") &&
                  resultOptions.length > 0 &&
                  !Object.entries(formData.weights || {}).some(
                    ([resultId, value]) =>
                      resultOptions.some((option) => option.id === resultId) &&
                      value > 0,
                  )) ||
                  false)
              }
              className="gap-1"
            >
              <Plus className="w-3 h-3" />
              {editingId ? t("admin.quiz.answers.update") : t("admin.quiz.answers.add")}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
