import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import type { Question, QuestionType } from "@/stores/quizzes-admin-store";
import { AnswerEditor } from "./answer-editor";

interface QuestionEditorProps {
  questions: Question[];
  onChange: (questions: Question[]) => void;
  quizType: string;
  resultCategories?: string[];
}

export function QuestionEditor({
  questions,
  onChange,
  quizType,
  resultCategories,
}: QuestionEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      text: "",
      type: "personality",
      image: "",
      answers: [],
    };
    onChange([...questions, newQuestion]);
    setExpandedId(newQuestion.id);
  };

  const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
    onChange(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const handleDeleteQuestion = (id: string) => {
    onChange(questions.filter((q) => q.id !== id));
  };

  const handleReorderQuestion = (fromIndex: number, toIndex: number) => {
    const newQuestions = [...questions];
    const [removed] = newQuestions.splice(fromIndex, 1);
    newQuestions.splice(toIndex, 0, removed);
    onChange(newQuestions);
  };

  const handleAnswersChange = (id: string, answers: any[]) => {
    handleUpdateQuestion(id, { answers });
  };

  const questionTypeOptions: Array<{ value: QuestionType; label: string }> = [
    { value: "personality", label: "Personality" },
    { value: "scored", label: "Scored" },
    { value: "image-choice", label: "Image Choice" },
    { value: "multiple-select", label: "Multiple Select" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Questions</label>
        <Button
          type="button"
          onClick={handleAddQuestion}
          size="sm"
          className="gap-2"
        >
          <Plus size={16} />
          Add Question
        </Button>
      </div>

      <AnimatePresence mode="popLayout">
        {questions.map((question, index) => (
          <motion.div
            key={question.id}
            layout
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-4 bg-card hover:bg-card/80 transition-colors">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center gap-2">
                  {/* Drag Handle */}
                  <div className="cursor-grab active:cursor-grabbing">
                    <GripVertical
                      size={18}
                      className="text-muted-foreground hover:text-foreground"
                    />
                  </div>

                  {/* Question Number */}
                  <span className="text-sm font-medium text-muted-foreground">
                    Q{index + 1}
                  </span>

                  {/* Expand/Collapse */}
                  <button
                    onClick={() =>
                      setExpandedId(
                        expandedId === question.id ? null : question.id
                      )
                    }
                    className="flex-1 text-left"
                  >
                    <p className="text-sm font-medium truncate text-foreground">
                      {question.text || "Untitled question"}
                    </p>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="p-1 hover:bg-red-500/10 rounded transition-colors"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>

                  {/* Toggle Icon */}
                  <button
                    onClick={() =>
                      setExpandedId(
                        expandedId === question.id ? null : question.id
                      )
                    }
                  >
                    {expandedId === question.id ? (
                      <ChevronUp size={16} className="text-muted-foreground" />
                    ) : (
                      <ChevronDown
                        size={16}
                        className="text-muted-foreground"
                      />
                    )}
                  </button>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedId === question.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 pt-4 border-t border-border"
                    >
                      {/* Question Text */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">
                          Question Text
                        </label>
                        <textarea
                          value={question.text}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            handleUpdateQuestion(question.id, {
                              text: e.target.value,
                            })
                          }
                          placeholder="Enter question text"
                          className="mt-1 min-h-20 w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      {/* Question Type */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">
                          Question Type
                        </label>
                        <select
                          value={question.type}
                          onChange={(e) =>
                            handleUpdateQuestion(question.id, {
                              type: e.target.value as QuestionType,
                            })
                          }
                          className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
                        >
                          {questionTypeOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Question Image */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">
                          Question Image (URL)
                        </label>
                        <Input
                          type="text"
                          value={question.image || ""}
                          onChange={(e) =>
                            handleUpdateQuestion(question.id, {
                              image: e.target.value,
                            })
                          }
                          placeholder="https://..."
                          className="mt-1"
                        />
                      </div>

                      {/* Answers Editor */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-2 block">
                          Answers
                        </label>
                        <AnswerEditor
                          answers={question.answers}
                          onChange={(answers) =>
                            handleAnswersChange(question.id, answers)
                          }
                          quizType={quizType}
                          resultCategories={resultCategories}
                        />
                      </div>

                      {/* Reorder Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleReorderQuestion(index, index - 1)}
                          disabled={index === 0}
                        >
                          Move Up
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleReorderQuestion(index, index + 1)}
                          disabled={index === questions.length - 1}
                        >
                          Move Down
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {questions.length === 0 && (
        <Card className="p-8 text-center bg-card/50">
          <p className="text-sm text-muted-foreground mb-4">
            No questions yet. Add your first question to get started.
          </p>
          <Button onClick={handleAddQuestion} className="gap-2">
            <Plus size={16} />
            Add First Question
          </Button>
        </Card>
      )}
    </div>
  );
}
