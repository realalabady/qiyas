import type { QuizCardData } from "@/components/quiz/quiz-card";

/* ── Categories ─────────────────────────────────────────────────────────── */
export interface Category {
  slug: string;
  label: string;
  emoji: string;
  description: string;
  quizCount: number;
}

export const CATEGORIES: Category[] = [
  {
    slug: "personality",
    label: "Personality",
    emoji: "🧠",
    description: "Uncover your unique traits, strengths and tendencies.",
    quizCount: 8,
  },
  {
    slug: "iq",
    label: "IQ Tests",
    emoji: "💡",
    description: "Challenge your reasoning and problem-solving skills.",
    quizCount: 4,
  },
  {
    slug: "mental-age",
    label: "Mental Age",
    emoji: "👶",
    description: "Find out how young (or wise) your mind really is.",
    quizCount: 3,
  },
  {
    slug: "career",
    label: "Career",
    emoji: "💼",
    description: "Discover which careers suit your natural strengths.",
    quizCount: 4,
  },
  {
    slug: "relationship",
    label: "Relationship",
    emoji: "💖",
    description: "Explore your love language and relationship style.",
    quizCount: 3,
  },
  {
    slug: "friendship",
    label: "Friendship",
    emoji: "🤝",
    description: "Learn what kind of friend you truly are.",
    quizCount: 2,
  },
  {
    slug: "stress",
    label: "Stress",
    emoji: "😮‍💨",
    description: "Measure your stress and get personalized coping strategies.",
    quizCount: 2,
  },
  {
    slug: "memory",
    label: "Memory",
    emoji: "🧩",
    description: "Test and train your short-term and long-term memory.",
    quizCount: 2,
  },
  {
    slug: "entertainment",
    label: "Entertainment",
    emoji: "🎬",
    description: "Fun pop-culture and movie/TV quizzes for everyone.",
    quizCount: 3,
  },
  {
    slug: "anime",
    label: "Anime",
    emoji: "🎌",
    description: "Which anime character or series matches your personality?",
    quizCount: 2,
  },
  {
    slug: "color",
    label: "Color Personality",
    emoji: "🌈",
    description: "Reveal what your favorite colors say about you.",
    quizCount: 2,
  },
  {
    slug: "knowledge",
    label: "General Knowledge",
    emoji: "📚",
    description: "Test your trivia and general knowledge across topics.",
    quizCount: 3,
  },
];

/* ── Quiz seed data ──────────────────────────────────────────────────────── */
export interface QuizSeed extends QuizCardData {
  seoTitle: string;
  seoDescription: string;
  longDescription: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
}

export const QUIZZES: QuizSeed[] = [
  {
    id: "1",
    slug: "personality-color-test",
    title: "What Color Is Your Personality?",
    description:
      "Discover what your favorite colors reveal about your inner self and emotional world.",
    longDescription:
      "Colors speak louder than words. This scientifically-inspired personality test analyzes your color preferences to reveal deep truths about your temperament, emotional style, and how others perceive you. Take 5 minutes and see which color defines you.",
    category: "Color Personality",
    questionCount: 15,
    estimatedMinutes: 5,
    completions: 142800,
    difficulty: "Easy",
    seoTitle: "Color Personality Test – What Color Are You?",
    seoDescription:
      "Take this free color personality test to discover what your color preferences reveal about your true self. Fast, accurate, shareable results.",
    tags: ["personality", "color", "free"],
  },
  {
    id: "2",
    slug: "mental-age-test",
    title: "What Is Your Mental Age?",
    description:
      "Find out if your mind is younger or older than your biological age.",
    longDescription:
      "Your mental age isn't the same as your birthday. This fun and revealing test measures how you think, react, and make decisions to estimate your true mental age. Are you an old soul or forever young?",
    category: "Mental Age",
    questionCount: 20,
    estimatedMinutes: 7,
    completions: 98500,
    difficulty: "Easy",
    seoTitle: "Mental Age Test – What Is Your Real Mental Age?",
    seoDescription:
      "Discover your mental age with this free quiz. Are you younger or older than your actual age? Find out in under 7 minutes.",
    tags: ["mental-age", "personality", "fun"],
  },
  {
    id: "3",
    slug: "iq-test",
    title: "Quick IQ Test — Find Your Score",
    description: "A fun 10-minute test to estimate your intelligence quotient.",
    longDescription:
      "This quick but comprehensive IQ assessment tests your logic, pattern recognition, spatial awareness, and verbal reasoning. Get an instant IQ estimate and see how you compare globally.",
    category: "IQ Tests",
    questionCount: 25,
    estimatedMinutes: 10,
    completions: 215000,
    difficulty: "Medium",
    seoTitle: "Free IQ Test Online – Instant Score",
    seoDescription:
      "Take our free 25-question IQ test and get your score instantly. Tests logic, pattern recognition, and reasoning skills.",
    tags: ["iq", "intelligence", "logic"],
  },
  {
    id: "4",
    slug: "career-personality-test",
    title: "What Career Suits Your Personality?",
    description:
      "Match your strengths and work style to the perfect career path.",
    longDescription:
      "Choosing the right career is one of life's biggest decisions. This test analyzes your natural strengths, communication style, and work preferences to recommend careers where you'll thrive and find fulfillment.",
    category: "Career",
    questionCount: 18,
    estimatedMinutes: 6,
    completions: 73400,
    difficulty: "Easy",
    seoTitle: "Career Personality Test – What Job Suits You?",
    seoDescription:
      "Discover which career matches your personality type. Free test with personalized recommendations.",
    tags: ["career", "personality", "work"],
  },
  {
    id: "5",
    slug: "friendship-test",
    title: "What Kind of Friend Are You?",
    description:
      "Are you the supportive one, the funny one, or the wise advisor?",
    longDescription:
      "Great friendships rely on understanding different roles. This quiz reveals your natural friend archetype — whether you're the loyalist, the entertainer, the counselor, or the adventurer — and what makes your friendships unique.",
    category: "Friendship",
    questionCount: 12,
    estimatedMinutes: 4,
    completions: 61200,
    difficulty: "Easy",
    seoTitle: "Friendship Personality Test – What Type of Friend Are You?",
    seoDescription:
      "Find out your friendship style. Are you the supportive friend, the funny one, or the advisor? Take the free quiz.",
    tags: ["friendship", "personality", "social"],
  },
  {
    id: "6",
    slug: "stress-level-test",
    title: "How Stressed Are You Really?",
    description:
      "Measure your current stress levels and get personalized coping tips.",
    longDescription:
      "Stress is invisible until it isn't. This evidence-based stress assessment evaluates your daily habits, emotional state, and physical symptoms to give you an honest picture of your stress load — plus actionable tips to feel better.",
    category: "Stress",
    questionCount: 14,
    estimatedMinutes: 5,
    completions: 54700,
    difficulty: "Easy",
    seoTitle: "Stress Level Test – How Stressed Are You?",
    seoDescription:
      "Take this free stress level test to understand your stress triggers and get personalized coping strategies.",
    tags: ["stress", "mental-health", "wellness"],
  },
  {
    id: "7",
    slug: "introvert-extrovert-test",
    title: "Are You an Introvert, Extrovert, or Ambivert?",
    description: "Find out where you truly fall on the social energy spectrum.",
    longDescription:
      "The introvert/extrovert spectrum is more nuanced than most people realize. This test goes beyond simple labels to show exactly where your personality lands — and why it matters for your relationships and daily energy.",
    category: "Personality",
    questionCount: 16,
    estimatedMinutes: 6,
    completions: 187300,
    difficulty: "Easy",
    seoTitle: "Introvert vs Extrovert Test – Where Are You on the Spectrum?",
    seoDescription:
      "Discover if you're an introvert, extrovert, or ambivert with this free personality quiz.",
    tags: ["introvert", "extrovert", "personality"],
  },
  {
    id: "8",
    slug: "love-language-test",
    title: "What Is Your Love Language?",
    description: "Discover how you give and receive love in relationships.",
    longDescription:
      "Gary Chapman's five love languages revolutionized relationship communication. This quiz identifies your primary and secondary love languages — words of affirmation, quality time, acts of service, gifts, or physical touch — so you can build deeper connections.",
    category: "Relationship",
    questionCount: 20,
    estimatedMinutes: 7,
    completions: 134600,
    difficulty: "Easy",
    seoTitle: "Love Language Test – What Is Your Love Language?",
    seoDescription:
      "Discover your love language with this free quiz. Learn how you give and receive love to build better relationships.",
    tags: ["love", "relationship", "communication"],
  },
  {
    id: "9",
    slug: "which-anime-character-are-you",
    title: "Which Anime Character Are You?",
    description:
      "Find out which iconic anime hero or villain matches your personality.",
    longDescription:
      "From Naruto to Attack on Titan, anime is full of complex, unforgettable characters. Answer these personality questions to discover which iconic anime character mirrors your own spirit, motivations, and fighting style.",
    category: "Anime",
    questionCount: 15,
    estimatedMinutes: 5,
    completions: 92100,
    difficulty: "Easy",
    seoTitle: "Which Anime Character Are You? Free Personality Quiz",
    seoDescription:
      "Take this anime personality quiz to discover which iconic anime character matches your personality.",
    tags: ["anime", "personality", "entertainment"],
  },
  {
    id: "10",
    slug: "memory-test",
    title: "How Good Is Your Memory?",
    description: "Test your short-term memory and cognitive recall abilities.",
    longDescription:
      "Memory is a trainable skill. This engaging memory challenge tests your ability to recall sequences, patterns, and details under pressure. See how your memory compares and get tips to sharpen it.",
    category: "Memory",
    questionCount: 20,
    estimatedMinutes: 8,
    completions: 43200,
    difficulty: "Medium",
    seoTitle: "Memory Test – How Good Is Your Memory?",
    seoDescription:
      "Test your memory with this free online quiz. How well can you recall details and patterns?",
    tags: ["memory", "cognitive", "brain"],
  },
  {
    id: "11",
    slug: "general-knowledge-quiz",
    title: "General Knowledge Quiz — 2024 Edition",
    description:
      "Test your trivia across science, history, pop culture and more.",
    longDescription:
      "Think you know a little about everything? Prove it with this comprehensive general knowledge quiz covering science, history, geography, pop culture, and sports. 25 questions, instant scoring.",
    category: "General Knowledge",
    questionCount: 25,
    estimatedMinutes: 10,
    completions: 67800,
    difficulty: "Medium",
    seoTitle: "General Knowledge Quiz 2024 – Test Your Trivia",
    seoDescription:
      "How much do you really know? Test your general knowledge with this free 25-question trivia quiz.",
    tags: ["trivia", "knowledge", "general"],
  },
  {
    id: "12",
    slug: "dark-personality-test",
    title: "How Dark Is Your Personality?",
    description:
      "Explore the darker side of your personality traits in a fun, safe way.",
    longDescription:
      "The 'dark triad' of personality — narcissism, Machiavellianism, and psychopathy — exists on a spectrum in everyone. This is a light, non-clinical exploration of your darker tendencies. Are you ruthless, manipulative, or surprisingly wholesome?",
    category: "Personality",
    questionCount: 18,
    estimatedMinutes: 6,
    completions: 201400,
    difficulty: "Easy",
    seoTitle: "Dark Personality Test – How Dark Are You?",
    seoDescription:
      "Explore your dark side with this fun personality test. Discover where you fall on the dark triad spectrum.",
    tags: ["personality", "dark", "psychology"],
  },
];

/** Get quizzes filtered by category slug */
export function getQuizzesByCategory(categorySlug: string): QuizSeed[] {
  const cat = CATEGORIES.find((c) => c.slug === categorySlug);
  if (!cat) return [];
  return QUIZZES.filter((q) => q.category === cat.label);
}

/** Get related quizzes (same category, exclude self) */
export function getRelatedQuizzes(slug: string, limit = 3): QuizSeed[] {
  const quiz = QUIZZES.find((q) => q.slug === slug);
  if (!quiz) return QUIZZES.slice(0, limit);
  return QUIZZES.filter(
    (q) => q.category === quiz.category && q.slug !== slug,
  ).slice(0, limit);
}

/** Trending = highest completions */
export const TRENDING_QUIZZES = [...QUIZZES]
  .sort((a, b) => b.completions - a.completions)
  .slice(0, 6);

/** Newest = last IDs in seed list */
export const NEWEST_QUIZZES = [...QUIZZES].slice(-6).reverse();
