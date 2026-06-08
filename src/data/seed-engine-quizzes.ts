/**
 * Quiz Engine Seed Data
 * Sample quizzes for all 4 quiz types: weighted_personality, personality_based, score_based, percentage_matching
 */

import type { Quiz } from "@/stores/quizzes-admin-store";
import type { QuizType } from "@/lib/quiz-engine";

/* ═══════════════════════════════════════════════════════════════════════════
   QUIZ 1: Weighted Personality (Default - Best for personality quizzes)
   This is the most versatile - calculates weighted scores across multiple traits
═══════════════════════════════════════════════════════════════════════════ */

export const PERSONALITY_QUIZ: Quiz = {
  id: "quiz-personality-types",
  title: "What Is Your Personality Type?",
  slug: "personality-types",
  description:
    "Discover your core personality traits and how you interact with the world.",
  category: "Personality Tests",
  thumbnail:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
  seoTitle: "Personality Type Quiz - Discover Your True Personality",
  seoDescription:
    "Take our free personality type quiz. Get instant insights into your traits, strengths, and how you connect with others.",
  quizType: "weighted_personality" as QuizType,
  published: true,
  questions: [
    {
      id: "q1-personality",
      text: "In social situations, you typically:",
      type: "personality",
      image: "",
      answers: [
        {
          id: "a1-intro",
          text: "Listen and observe before speaking",
          weights: { introverted: 3, analytical: 2 },
        },
        {
          id: "a2-outgoing",
          text: "Jump into conversations and make new friends",
          weights: { extroverted: 3, spontaneous: 2 },
        },
        {
          id: "a3-balanced",
          text: "Adapt based on the situation",
          weights: { adaptable: 3, balanced: 2 },
        },
        {
          id: "a4-lead",
          text: "Take charge and lead the group",
          weights: { extroverted: 2, leader: 3 },
        },
      ],
    },
    {
      id: "q2-personality",
      text: "When facing a challenge, you prefer to:",
      type: "personality",
      image: "",
      answers: [
        {
          id: "a1-think",
          text: "Think it through logically",
          weights: { analytical: 3, cautious: 1 },
        },
        {
          id: "a2-jump",
          text: "Jump in and figure it out",
          weights: { spontaneous: 3, adventurous: 2 },
        },
        {
          id: "a3-research",
          text: "Research and gather information",
          weights: { analytical: 2, thorough: 3 },
        },
        {
          id: "a4-instinct",
          text: "Trust your gut instinct",
          weights: { intuitive: 3, spontaneous: 1 },
        },
      ],
    },
    {
      id: "q3-personality",
      text: "Your ideal work environment is:",
      type: "personality",
      image: "",
      answers: [
        {
          id: "a1-team",
          text: "Collaborative with lots of teamwork",
          weights: { extroverted: 2, team_player: 3 },
        },
        {
          id: "a2-independent",
          text: "Independent where you work alone",
          weights: { introverted: 3, independent: 2 },
        },
        {
          id: "a3-structured",
          text: "Highly organized and structured",
          weights: { analytical: 3, organized: 2 },
        },
        {
          id: "a4-creative",
          text: "Creative and flexible",
          weights: { creative: 3, spontaneous: 2 },
        },
      ],
    },
  ],
  results: [
    {
      id: "result-analytical",
      title: "The Analytical Strategist",
      description:
        "You approach life through logic and careful planning. You excel at solving complex problems and spotting patterns others miss.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400",
      strengths: [
        "Logical thinking",
        "Problem-solving",
        "Attention to detail",
        "Reliability",
      ],
      weaknesses: ["Overthinking", "Perfectionism", "Difficulty delegating"],
      careers: ["Engineer", "Data Analyst", "Researcher", "Architect"],
      personality: "analytical",
    },
    {
      id: "result-social",
      title: "The Social Butterfly",
      description:
        "You're energized by people and thrive in social settings. Your charisma and communication skills make you a natural connector.",
      image:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400",
      strengths: ["Communication", "Empathy", "Leadership", "Adaptability"],
      weaknesses: [
        "Impulsiveness",
        "Difficulty with solitude",
        "Surface-level thinking",
      ],
      careers: ["Marketing", "Sales", "Event Manager", "HR Specialist"],
      personality: "extroverted",
    },
    {
      id: "result-creative",
      title: "The Creative Innovator",
      description:
        "Your imagination and originality shine through in everything you do. You see possibilities where others see limitations.",
      image: "https://images.unsplash.com/photo-1552884642-540185e6a7db?w=400",
      strengths: ["Creativity", "Innovation", "Artistic vision", "Intuition"],
      weaknesses: [
        "Lack of structure",
        "Impracticality",
        "Difficulty finishing projects",
      ],
      careers: ["Designer", "Artist", "Content Creator", "Entrepreneur"],
      personality: "creative",
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

/* ═══════════════════════════════════════════════════════════════════════════
   QUIZ 2: Score-Based (Numeric scoring)
═══════════════════════════════════════════════════════════════════════════ */

export const IQ_QUIZ: Quiz = {
  id: "quiz-iq-test",
  title: "Quick IQ Test",
  slug: "iq-test-quick",
  description:
    "Test your cognitive abilities with this scientifically-designed IQ assessment.",
  category: "IQ Tests",
  thumbnail:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500",
  seoTitle: "Free IQ Test - Check Your Intelligence Score",
  seoDescription:
    "Take a quick and free IQ test. Get your estimated IQ score based on logic, reasoning, and problem-solving questions.",
  quizType: "score_based" as QuizType,
  published: true,
  questions: [
    {
      id: "q1-iq",
      text: "What is the next number in the sequence: 2, 4, 8, 16, ?",
      type: "scored",
      image: "",
      answers: [
        { id: "a1-wrong", text: "20", score: 0 },
        { id: "a2-wrong2", text: "24", score: 0 },
        { id: "a3-correct", text: "32", score: 100 },
        { id: "a4-wrong3", text: "40", score: 0 },
      ],
    },
    {
      id: "q2-iq",
      text: "If all roses are flowers, and all flowers fade, then what must be true?",
      type: "scored",
      image: "",
      answers: [
        { id: "a1-correct", text: "All roses fade", score: 100 },
        { id: "a2-wrong", text: "Some roses don't fade", score: 0 },
        { id: "a3-wrong2", text: "All flowers are roses", score: 0 },
        { id: "a4-wrong3", text: "No roses fade", score: 0 },
      ],
    },
    {
      id: "q3-iq",
      text: "Complete the analogy: Cat is to Kitten as Dog is to ?",
      type: "scored",
      image: "",
      answers: [
        { id: "a1-wrong", text: "Puppy", score: 100 },
        { id: "a2-wrong2", text: "Wolf", score: 0 },
        { id: "a3-wrong3", text: "Pup", score: 50 },
        { id: "a4-wrong4", text: "Canine", score: 0 },
      ],
    },
  ],
  results: [
    {
      id: "result-iq-low",
      title: "Average IQ (80-100)",
      description:
        "Your IQ score is in the average range. You have solid reasoning abilities and can handle most cognitive tasks.",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
      strengths: ["Practical thinking", "Common sense", "Reliability"],
      weaknesses: ["Complex problem-solving"],
      careers: ["Teacher", "Accountant", "Administrator"],
      personality: "average",
    },
    {
      id: "result-iq-high",
      title: "Above Average IQ (110-130)",
      description:
        "You have exceptional cognitive abilities. You excel at abstract thinking and complex problem-solving.",
      image: "https://images.unsplash.com/photo-1552884642-540185e6a7db?w=400",
      strengths: ["Complex reasoning", "Quick learning", "Innovation"],
      weaknesses: ["May overthink simple problems"],
      careers: ["Scientist", "Engineer", "Strategist"],
      personality: "high-iq",
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

/* ═══════════════════════════════════════════════════════════════════════════
   QUIZ 3: Personality-Based (Direct result mapping)
═══════════════════════════════════════════════════════════════════════════ */

export const CAREER_QUIZ: Quiz = {
  id: "quiz-career-match",
  title: "Find Your Ideal Career",
  slug: "career-match-test",
  description:
    "Discover which careers align with your natural strengths and interests.",
  category: "Career Tests",
  thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500",
  seoTitle: "Career Match Quiz - Find Your Perfect Job",
  seoDescription:
    "Take our career matching quiz to discover jobs that suit your personality, skills, and interests. Get personalized career recommendations.",
  quizType: "personality_based" as QuizType,
  published: true,
  questions: [
    {
      id: "q1-career",
      text: "What matters most to you in a job?",
      type: "personality",
      image: "",
      answers: [
        {
          id: "a1-create",
          text: "Creative expression",
          resultId: "result-creative-career",
        },
        {
          id: "a2-help",
          text: "Helping people",
          resultId: "result-social-career",
        },
        {
          id: "a3-solve",
          text: "Solving problems",
          resultId: "result-analytical-career",
        },
        {
          id: "a4-build",
          text: "Building things",
          resultId: "result-builder-career",
        },
      ],
    },
    {
      id: "q2-career",
      text: "Your ideal work style is:",
      type: "personality",
      image: "",
      answers: [
        {
          id: "a1-team",
          text: "Teamwork and collaboration",
          resultId: "result-social-career",
        },
        {
          id: "a2-solo",
          text: "Independent projects",
          resultId: "result-analytical-career",
        },
        {
          id: "a3-dynamic",
          text: "Dynamic and varied",
          resultId: "result-creative-career",
        },
        {
          id: "a4-leads",
          text: "Leading and managing",
          resultId: "result-builder-career",
        },
      ],
    },
  ],
  results: [
    {
      id: "result-creative-career",
      title: "Creative Professional Path",
      description:
        "Your skills are best suited for creative industries where innovation and expression are valued.",
      image: "https://images.unsplash.com/photo-1552884642-540185e6a7db?w=400",
      strengths: ["Creativity", "Innovation", "Artistic vision"],
      careers: ["Designer", "Marketing", "Content Creator", "UX Specialist"],
      personality: "creative",
    },
    {
      id: "result-social-career",
      title: "People-Focused Career Path",
      description:
        "You thrive in roles where you interact with people and make a direct impact on their lives.",
      image:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400",
      strengths: ["Communication", "Empathy", "Leadership"],
      careers: ["Teacher", "Counselor", "Sales Manager", "HR Specialist"],
      personality: "social",
    },
    {
      id: "result-analytical-career",
      title: "Analytical Problem-Solver Path",
      description:
        "Your logical mind is perfect for technical and analytical roles where precision matters.",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
      strengths: ["Logic", "Analysis", "Attention to detail"],
      careers: ["Engineer", "Data Scientist", "Researcher", "Accountant"],
      personality: "analytical",
    },
    {
      id: "result-builder-career",
      title: "Leadership & Building Path",
      description:
        "You're a natural leader with the ability to build teams and drive projects to success.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400",
      strengths: ["Leadership", "Strategic thinking", "Team building"],
      careers: ["Project Manager", "CEO", "Entrepreneur", "Director"],
      personality: "leader",
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

/* ═══════════════════════════════════════════════════════════════════════════
   QUIZ 4: Percentage Matching (Show match percentages for all categories)
═══════════════════════════════════════════════════════════════════════════ */

export const COMPATIBILITY_QUIZ: Quiz = {
  id: "quiz-relationship-compatibility",
  title: "Relationship Compatibility Test",
  slug: "relationship-compatibility",
  description:
    "Discover how compatible you are with different relationship types.",
  category: "Relationship Tests",
  thumbnail:
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500",
  seoTitle: "Relationship Compatibility Quiz - Find Your Match",
  seoDescription:
    "Test your relationship compatibility. See your percentage match across different relationship archetypes and connection styles.",
  quizType: "percentage_matching" as QuizType,
  published: true,
  questions: [
    {
      id: "q1-compat",
      text: "What's your love language?",
      type: "personality",
      image: "",
      answers: [
        {
          id: "a1-words",
          text: "Words of affirmation",
          weights: { communicative: 3, emotional: 2 },
        },
        {
          id: "a2-time",
          text: "Quality time",
          weights: { present: 3, attentive: 2 },
        },
        {
          id: "a3-acts",
          text: "Acts of service",
          weights: { caring: 3, thoughtful: 2 },
        },
        {
          id: "a4-physical",
          text: "Physical affection",
          weights: { physical: 3, spontaneous: 1 },
        },
      ],
    },
    {
      id: "q2-compat",
      text: "How do you handle conflicts?",
      type: "personality",
      image: "",
      answers: [
        {
          id: "a1-talk",
          text: "Talk it out immediately",
          weights: { communicative: 3, direct: 2 },
        },
        {
          id: "a2-think",
          text: "Take time to reflect",
          weights: { thoughtful: 3, introspective: 2 },
        },
        {
          id: "a3-compromise",
          text: "Find compromises",
          weights: { flexible: 3, diplomatic: 2 },
        },
        {
          id: "a4-avoid",
          text: "Give each other space",
          weights: { independent: 3, spacious: 2 },
        },
      ],
    },
    {
      id: "q3-compat",
      text: "Your ideal relationship involves:",
      type: "personality",
      image: "",
      answers: [
        {
          id: "a1-adventure",
          text: "Adventure and spontaneity",
          weights: { adventurous: 3, spontaneous: 2 },
        },
        {
          id: "a2-stability",
          text: "Stability and predictability",
          weights: { stable: 3, grounded: 2 },
        },
        {
          id: "a3-growth",
          text: "Growth and development together",
          weights: { growth_oriented: 3, ambitious: 1 },
        },
        {
          id: "a4-passion",
          text: "Deep emotional connection",
          weights: { emotional: 3, intimate: 2 },
        },
      ],
    },
  ],
  results: [
    {
      id: "result-passionate",
      title: "The Passionate Partner",
      description:
        "You bring intensity and emotional depth to relationships. You're seeking deep, meaningful connections.",
      image:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400",
      strengths: ["Emotional depth", "Loyalty", "Intensity"],
      weaknesses: ["Can be possessive", "Jealousy"],
      careers: ["Creative fields"],
      personality: "passionate",
    },
    {
      id: "result-reliable",
      title: "The Reliable Partner",
      description:
        "You're the stable, dependable one who builds lasting relationships through trust and consistency.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400",
      strengths: ["Dependability", "Loyalty", "Consistency"],
      weaknesses: ["Can seem predictable", "Fear of change"],
      careers: ["Stable professions"],
      personality: "reliable",
    },
    {
      id: "result-adventurous",
      title: "The Adventurous Partner",
      description:
        "You seek excitement and spontaneity. You're energized by new experiences and keep relationships fresh.",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
      strengths: ["Spontaneity", "Excitement", "Adaptability"],
      weaknesses: ["Restlessness", "Commitment challenges"],
      careers: ["Dynamic fields"],
      personality: "adventurous",
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Export all quizzes
export const ENGINE_SEED_QUIZZES = [
  PERSONALITY_QUIZ,
  IQ_QUIZ,
  CAREER_QUIZ,
  COMPATIBILITY_QUIZ,
];
