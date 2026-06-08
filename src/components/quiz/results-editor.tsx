import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import type { Result } from '@/stores/quizzes-admin-store';

interface ResultsEditorProps {
  results: Result[];
  onChange: (results: Result[]) => void;
}

interface FormResult {
  id: string;
  title: string;
  description: string;
  image?: string;
  strengths?: string[];
  weaknesses?: string[];
  careers?: string[];
}

export function ResultsEditor({ results, onChange }: ResultsEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormResult>({
    id: '',
    title: '',
    description: '',
  });

  const handleAddResult = () => {
    if (!formData.title.trim() || !formData.description.trim()) return;

    if (editingId) {
      onChange(
        results.map((r) =>
          r.id === editingId ? { ...formData } as Result : r
        )
      );
      setEditingId(null);
    } else {
      onChange([
        ...results,
        {
          id: `result-${Date.now()}`,
          title: formData.title,
          description: formData.description,
          image: formData.image,
          strengths: formData.strengths,
          weaknesses: formData.weaknesses,
          careers: formData.careers,
        },
      ]);
    }

    setFormData({ id: '', title: '', description: '' });
  };

  const handleEditResult = (result: Result) => {
    setFormData({
      id: result.id,
      title: result.title,
      description: result.description,
      image: result.image,
      strengths: result.strengths,
      weaknesses: result.weaknesses,
      careers: result.careers,
    });
    setEditingId(result.id);
  };

  const handleDeleteResult = (id: string) => {
    onChange(results.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Quiz Results</h3>
        <span className="text-sm text-muted-foreground">{results.length} results</span>
      </div>

      {/* Results List */}
      {results.length > 0 && (
        <div className="grid gap-2">
          {results.map((result) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 rounded-lg bg-white/5 border border-border/40 flex items-start justify-between group hover:border-primary/50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{result.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {result.description}
                </p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => handleEditResult(result)}
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => handleDeleteResult(result.id)}
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
          {/* Result Title */}
          <div>
            <label className="block text-xs font-medium mb-1">
              Result Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., The Analyst, The Creative"
            />
          </div>

          {/* Result Description */}
          <div>
            <label className="block text-xs font-medium mb-1">
              Result Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe this result type..."
              className="w-full h-16 p-2 rounded-lg bg-white/5 border border-border/40 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 text-sm"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-medium mb-1">
              Image URL (Optional)
            </label>
            <Input
              value={formData.image || ''}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-2">
            {editingId && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setFormData({ id: '', title: '', description: '' });
                  setEditingId(null);
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleAddResult}
              disabled={!formData.title.trim() || !formData.description.trim()}
              className="gap-1"
            >
              <Plus className="w-3 h-3" />
              {editingId ? 'Update' : 'Add Result'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
