/**
 * Quiz questions and results seed data.
 * Each quiz has questions[] and results[].
 * Answer options map to result keys (personality) or are scored (IQ/knowledge).
 */

export type QuestionType = "personality" | "scored";

export interface AnswerOption {
  id: string;
  text: string;
  /** For personality quizzes – which result key this answer contributes to */
  resultKey?: string;
  /** For scored quizzes – whether this is correct */
  correct?: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: AnswerOption[];
  /** Optional image URL */
  image?: string;
}

export interface QuizResult {
  key: string;
  title: string;
  emoji: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  /** Min score for scored quizzes */
  minScore?: number;
  /** Max score for scored quizzes */
  maxScore?: number;
}

export interface QuizData {
  slug: string;
  questions: Question[];
  results: QuizResult[];
}

/* ═══════════════════════════════════════════════════════════════
   1. Personality Color Test
═══════════════════════════════════════════════════════════════ */
const colorTest: QuizData = {
  slug: "personality-color-test",
  results: [
    {
      key: "red",
      emoji: "🔴",
      title: "Red Personality",
      description:
        "You are driven, passionate, and action-oriented. You lead with confidence and thrive in competitive environments. Life moves fast around you — and you wouldn't have it any other way.",
      strengths: ["Natural leader", "High energy", "Decisive", "Ambitious"],
      weaknesses: [
        "Can be impulsive",
        "May come across as aggressive",
        "Dislikes slow pace",
      ],
    },
    {
      key: "blue",
      emoji: "🔵",
      title: "Blue Personality",
      description:
        "You are calm, thoughtful, and deeply loyal. People trust you with their secrets because you listen without judgment. You prefer depth over breadth in everything — friendships, interests, and conversations.",
      strengths: ["Empathetic", "Reliable", "Great listener", "Analytical"],
      weaknesses: ["Can overthink", "May avoid conflict", "Slow to open up"],
    },
    {
      key: "yellow",
      emoji: "🟡",
      title: "Yellow Personality",
      description:
        "You are optimistic, creative, and full of ideas. You light up every room you enter and find joy in the smallest moments. Your enthusiasm is contagious and people love being around your energy.",
      strengths: ["Optimistic", "Creative", "Sociable", "Enthusiastic"],
      weaknesses: [
        "Can be disorganized",
        "Easily distracted",
        "Avoids conflict",
      ],
    },
    {
      key: "green",
      emoji: "🟢",
      title: "Green Personality",
      description:
        "You are stable, patient, and deeply empathetic. You are the peacemaker in every group and the one people turn to during crisis. Balance and harmony guide your every decision.",
      strengths: ["Patient", "Caring", "Balanced", "Mediator"],
      weaknesses: [
        "Resistant to change",
        "May suppress own needs",
        "Indecisive",
      ],
    },
  ],
  questions: [
    {
      id: "c1",
      text: "When facing a big decision, you tend to...",
      type: "personality",
      options: [
        { id: "c1a", text: "Act fast and trust your gut", resultKey: "red" },
        {
          id: "c1b",
          text: "Research thoroughly before deciding",
          resultKey: "blue",
        },
        {
          id: "c1c",
          text: "Talk it over with friends excitedly",
          resultKey: "yellow",
        },
        {
          id: "c1d",
          text: "Take your time and weigh all sides calmly",
          resultKey: "green",
        },
      ],
    },
    {
      id: "c2",
      text: "Your ideal weekend looks like...",
      type: "personality",
      options: [
        {
          id: "c2a",
          text: "Competing in a sport or challenge",
          resultKey: "red",
        },
        {
          id: "c2b",
          text: "Reading or a quiet hobby at home",
          resultKey: "blue",
        },
        {
          id: "c2c",
          text: "Exploring somewhere new with friends",
          resultKey: "yellow",
        },
        {
          id: "c2d",
          text: "A peaceful day in nature or the garden",
          resultKey: "green",
        },
      ],
    },
    {
      id: "c3",
      text: "In a group project, you naturally become...",
      type: "personality",
      options: [
        { id: "c3a", text: "The one who takes charge", resultKey: "red" },
        {
          id: "c3b",
          text: "The one who plans and analyses",
          resultKey: "blue",
        },
        { id: "c3c", text: "The one who generates ideas", resultKey: "yellow" },
        {
          id: "c3d",
          text: "The one who keeps everyone happy",
          resultKey: "green",
        },
      ],
    },
    {
      id: "c4",
      text: "When someone upsets you, you...",
      type: "personality",
      options: [
        {
          id: "c4a",
          text: "Confront them directly right away",
          resultKey: "red",
        },
        {
          id: "c4b",
          text: "Think carefully before responding",
          resultKey: "blue",
        },
        {
          id: "c4c",
          text: "Try to laugh it off and move on",
          resultKey: "yellow",
        },
        {
          id: "c4d",
          text: "Avoid conflict and seek peace quietly",
          resultKey: "green",
        },
      ],
    },
    {
      id: "c5",
      text: "What motivates you most at work?",
      type: "personality",
      options: [
        { id: "c5a", text: "Winning and hitting targets", resultKey: "red" },
        {
          id: "c5b",
          text: "Doing things right and with quality",
          resultKey: "blue",
        },
        {
          id: "c5c",
          text: "Creative expression and collaboration",
          resultKey: "yellow",
        },
        {
          id: "c5d",
          text: "Helping others and making a difference",
          resultKey: "green",
        },
      ],
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════
   2. IQ Test (scored)
═══════════════════════════════════════════════════════════════ */
const iqTest: QuizData = {
  slug: "iq-test",
  results: [
    {
      key: "genius",
      emoji: "🌟",
      title: "Genius Level (130+)",
      minScore: 10,
      maxScore: 12,
      description:
        "Your reasoning and problem-solving abilities are exceptional. You process complex information with remarkable speed and accuracy.",
      strengths: ["Abstract thinking", "Pattern recognition", "Rapid learning"],
      weaknesses: ["May get bored easily", "Perfectionism"],
    },
    {
      key: "high",
      emoji: "🧠",
      title: "High Intelligence (120–129)",
      minScore: 8,
      maxScore: 9,
      description:
        "Your intellect is significantly above average. You handle complex challenges with ease and often find creative solutions.",
      strengths: ["Strong logic", "Quick comprehension", "Versatile thinker"],
      weaknesses: ["Can over-analyse", "Impatience with simpler tasks"],
    },
    {
      key: "above",
      emoji: "💡",
      title: "Above Average (110–119)",
      minScore: 6,
      maxScore: 7,
      description:
        "Your thinking is sharper than most. You're a capable problem-solver who learns new concepts faster than average.",
      strengths: ["Good reasoning", "Curious mind", "Adaptable"],
      weaknesses: ["Occasional self-doubt", "Needs challenge to stay engaged"],
    },
    {
      key: "average",
      emoji: "✅",
      title: "Average Intelligence (90–109)",
      minScore: 3,
      maxScore: 5,
      description:
        "You have solid, reliable intelligence. Most complex tasks are within your reach with the right approach.",
      strengths: ["Practical thinking", "Consistent", "Well-rounded"],
      weaknesses: ["Benefits from extra time on abstract problems"],
    },
    {
      key: "below",
      emoji: "📖",
      title: "Keep Practising (< 90)",
      minScore: 0,
      maxScore: 2,
      description:
        "Intelligence is trainable! This result just means you have great room to grow. Try more logic puzzles and pattern games.",
      strengths: ["Determination", "Open to learning"],
      weaknesses: ["Needs more practice with logical reasoning"],
    },
  ],
  questions: [
    {
      id: "iq1",
      text: "What comes next in the sequence: 2, 4, 8, 16, ___?",
      type: "scored",
      options: [
        { id: "iq1a", text: "24", correct: false },
        { id: "iq1b", text: "32", correct: true },
        { id: "iq1c", text: "28", correct: false },
        { id: "iq1d", text: "36", correct: false },
      ],
    },
    {
      id: "iq2",
      text: "If all Bloops are Razzles, and all Razzles are Lazzles, are all Bloops definitely Lazzles?",
      type: "scored",
      options: [
        { id: "iq2a", text: "Yes", correct: true },
        { id: "iq2b", text: "No", correct: false },
        { id: "iq2c", text: "Cannot be determined", correct: false },
        { id: "iq2d", text: "Sometimes", correct: false },
      ],
    },
    {
      id: "iq3",
      text: "A farmer has 17 sheep. All but 9 die. How many are left?",
      type: "scored",
      options: [
        { id: "iq3a", text: "8", correct: false },
        { id: "iq3b", text: "17", correct: false },
        { id: "iq3c", text: "9", correct: true },
        { id: "iq3d", text: "0", correct: false },
      ],
    },
    {
      id: "iq4",
      text: "Which number should come next? 1, 1, 2, 3, 5, 8, ___",
      type: "scored",
      options: [
        { id: "iq4a", text: "11", correct: false },
        { id: "iq4b", text: "13", correct: true },
        { id: "iq4c", text: "12", correct: false },
        { id: "iq4d", text: "16", correct: false },
      ],
    },
    {
      id: "iq5",
      text: "If you rearrange the letters 'CIFAIPC', you get the name of a/an...",
      type: "scored",
      options: [
        { id: "iq5a", text: "Country", correct: false },
        { id: "iq5b", text: "Ocean", correct: true },
        { id: "iq5c", text: "City", correct: false },
        { id: "iq5d", text: "Animal", correct: false },
      ],
    },
    {
      id: "iq6",
      text: "Mary's father has five daughters: Nana, Nene, Nini, Nono. What's the fifth daughter's name?",
      type: "scored",
      options: [
        { id: "iq6a", text: "Nunu", correct: false },
        { id: "iq6b", text: "Nyny", correct: false },
        { id: "iq6c", text: "Mary", correct: true },
        { id: "iq6d", text: "Nana", correct: false },
      ],
    },
    {
      id: "iq7",
      text: "What is 15% of 200?",
      type: "scored",
      options: [
        { id: "iq7a", text: "25", correct: false },
        { id: "iq7b", text: "30", correct: true },
        { id: "iq7c", text: "35", correct: false },
        { id: "iq7d", text: "20", correct: false },
      ],
    },
    {
      id: "iq8",
      text: "Which shape has the most sides? Triangle, Pentagon, Hexagon, Octagon",
      type: "scored",
      options: [
        { id: "iq8a", text: "Triangle", correct: false },
        { id: "iq8b", text: "Pentagon", correct: false },
        { id: "iq8c", text: "Hexagon", correct: false },
        { id: "iq8d", text: "Octagon", correct: true },
      ],
    },
    {
      id: "iq9",
      text: "A clock shows 3:15. What is the angle between the hour and minute hands?",
      type: "scored",
      options: [
        { id: "iq9a", text: "0°", correct: false },
        { id: "iq9b", text: "7.5°", correct: true },
        { id: "iq9c", text: "15°", correct: false },
        { id: "iq9d", text: "90°", correct: false },
      ],
    },
    {
      id: "iq10",
      text: "Which word is the odd one out? Dog, Cat, Lion, Rose, Tiger",
      type: "scored",
      options: [
        { id: "iq10a", text: "Dog", correct: false },
        { id: "iq10b", text: "Lion", correct: false },
        { id: "iq10c", text: "Rose", correct: true },
        { id: "iq10d", text: "Tiger", correct: false },
      ],
    },
    {
      id: "iq11",
      text: "If you go to bed at 8 PM and set your alarm for 9 AM the next morning, how many hours of sleep will you get?",
      type: "scored",
      options: [
        { id: "iq11a", text: "1 hour", correct: true },
        { id: "iq11b", text: "9 hours", correct: false },
        { id: "iq11c", text: "13 hours", correct: false },
        { id: "iq11d", text: "12 hours", correct: false },
      ],
    },
    {
      id: "iq12",
      text: "Complete the analogy: Book is to Reading as Fork is to ___?",
      type: "scored",
      options: [
        { id: "iq12a", text: "Cooking", correct: false },
        { id: "iq12b", text: "Eating", correct: true },
        { id: "iq12c", text: "Serving", correct: false },
        { id: "iq12d", text: "Kitchen", correct: false },
      ],
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════
   3. Introvert / Extrovert / Ambivert Test
═══════════════════════════════════════════════════════════════ */
const introvertTest: QuizData = {
  slug: "introvert-extrovert-test",
  results: [
    {
      key: "introvert",
      emoji: "🌙",
      title: "Introvert",
      description:
        "You recharge alone and prefer depth over breadth. Solitude is not loneliness for you — it's restoration. You think before speaking, and when you do speak, your words carry weight.",
      strengths: ["Deep thinker", "Great listener", "Creative", "Self-aware"],
      weaknesses: [
        "Can be misread as aloof",
        "Social energy depletes quickly",
        "May over-analyse",
      ],
    },
    {
      key: "extrovert",
      emoji: "☀️",
      title: "Extrovert",
      description:
        "You come alive around people. Social situations energise you and you think best out loud. You're the one who brings people together and keeps the energy high.",
      strengths: ["Charismatic", "Energetic", "Collaborative", "Adaptable"],
      weaknesses: [
        "Struggles with solitude",
        "May talk before thinking",
        "Needs external stimulation",
      ],
    },
    {
      key: "ambivert",
      emoji: "⚡",
      title: "Ambivert",
      description:
        "You are beautifully balanced — drawing from both introvert and extrovert traits depending on the situation. You can be the life of the party and also enjoy quiet evenings at home.",
      strengths: [
        "Versatile",
        "Emotionally intelligent",
        "Adaptable",
        "Relatable",
      ],
      weaknesses: [
        "Can feel pulled in two directions",
        "Needs balance to stay well",
      ],
    },
  ],
  questions: [
    {
      id: "ie1",
      text: "After a long social event, you feel...",
      type: "personality",
      options: [
        {
          id: "ie1a",
          text: "Drained — you need alone time to recover",
          resultKey: "introvert",
        },
        {
          id: "ie1b",
          text: "Energised and want to keep the night going",
          resultKey: "extrovert",
        },
        {
          id: "ie1c",
          text: "It depends on the event and people",
          resultKey: "ambivert",
        },
      ],
    },
    {
      id: "ie2",
      text: "Your ideal Friday night is...",
      type: "personality",
      options: [
        {
          id: "ie2a",
          text: "Quiet night in with a book or show",
          resultKey: "introvert",
        },
        {
          id: "ie2b",
          text: "Out with a big group having fun",
          resultKey: "extrovert",
        },
        {
          id: "ie2c",
          text: "Small dinner with close friends",
          resultKey: "ambivert",
        },
      ],
    },
    {
      id: "ie3",
      text: "When you have a problem to solve, you prefer to...",
      type: "personality",
      options: [
        {
          id: "ie3a",
          text: "Think about it alone first",
          resultKey: "introvert",
        },
        {
          id: "ie3b",
          text: "Talk it through with others out loud",
          resultKey: "extrovert",
        },
        {
          id: "ie3c",
          text: "Do some solo thinking then get feedback",
          resultKey: "ambivert",
        },
      ],
    },
    {
      id: "ie4",
      text: "At a party where you know no one, you...",
      type: "personality",
      options: [
        {
          id: "ie4a",
          text: "Stay near someone you know or leave early",
          resultKey: "introvert",
        },
        {
          id: "ie4b",
          text: "Jump in and start introducing yourself",
          resultKey: "extrovert",
        },
        {
          id: "ie4c",
          text: "Warm up slowly and then open up",
          resultKey: "ambivert",
        },
      ],
    },
    {
      id: "ie5",
      text: "How would your friends describe you?",
      type: "personality",
      options: [
        {
          id: "ie5a",
          text: "Quiet, thoughtful, private",
          resultKey: "introvert",
        },
        {
          id: "ie5b",
          text: "Loud, social, fun to be around",
          resultKey: "extrovert",
        },
        {
          id: "ie5c",
          text: "It changes — I can be both",
          resultKey: "ambivert",
        },
      ],
    },
    {
      id: "ie6",
      text: "In meetings or group discussions, you tend to...",
      type: "personality",
      options: [
        {
          id: "ie6a",
          text: "Listen carefully and share only when ready",
          resultKey: "introvert",
        },
        {
          id: "ie6b",
          text: "Speak up enthusiastically and often",
          resultKey: "extrovert",
        },
        {
          id: "ie6c",
          text: "Contribute when it feels right",
          resultKey: "ambivert",
        },
      ],
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════
   4. Love Language Test
═══════════════════════════════════════════════════════════════ */
const loveLanguageTest: QuizData = {
  slug: "love-language-test",
  results: [
    {
      key: "words",
      emoji: "💬",
      title: "Words of Affirmation",
      description:
        "You thrive on verbal expressions of love. Compliments, encouragement, and 'I love you' mean everything to you. The right words can make your whole day.",
      strengths: ["Expressive", "Emotionally articulate", "Uplifts others"],
      weaknesses: [
        "Deeply hurt by criticism",
        "Needs frequent verbal reassurance",
      ],
    },
    {
      key: "time",
      emoji: "⏰",
      title: "Quality Time",
      description:
        "You feel most loved when you have someone's undivided attention. Phone-free moments and meaningful conversations fill your heart.",
      strengths: [
        "Present and attentive",
        "Values depth in relationships",
        "Great conversationalist",
      ],
      weaknesses: [
        "Hurt by cancellations",
        "May struggle with partner's need for space",
      ],
    },
    {
      key: "acts",
      emoji: "🛠️",
      title: "Acts of Service",
      description:
        "Actions speak louder than words for you. When someone does something helpful — cooking, fixing things, taking tasks off your plate — you feel truly cared for.",
      strengths: ["Practical", "Dependable", "Shows love through action"],
      weaknesses: [
        "Resentment when effort isn't reciprocated",
        "May feel unappreciated",
      ],
    },
    {
      key: "gifts",
      emoji: "🎁",
      title: "Receiving Gifts",
      description:
        "Thoughtful gifts — no matter the size — tell you that someone was thinking of you. It's not about materialism; it's about the symbolism of being remembered.",
      strengths: ["Appreciative", "Sentimental", "Thoughtful gift-giver"],
      weaknesses: [
        "May feel forgotten without tangible tokens",
        "Can be misunderstood as materialistic",
      ],
    },
    {
      key: "touch",
      emoji: "🤗",
      title: "Physical Touch",
      description:
        "Hugs, hand-holding, and presence fill your emotional tank. Physical connection is how you feel secure, loved, and close to the people who matter.",
      strengths: ["Warm", "Affectionate", "Physically comforting"],
      weaknesses: [
        "Feels distant without touch",
        "Needs physical closeness to feel secure",
      ],
    },
  ],
  questions: [
    {
      id: "ll1",
      text: "What makes you feel most loved by a partner?",
      type: "personality",
      options: [
        {
          id: "ll1a",
          text: "They tell me they love and appreciate me",
          resultKey: "words",
        },
        {
          id: "ll1b",
          text: "We spend quality uninterrupted time together",
          resultKey: "time",
        },
        {
          id: "ll1c",
          text: "They do helpful things without being asked",
          resultKey: "acts",
        },
        {
          id: "ll1d",
          text: "They surprise me with thoughtful gifts",
          resultKey: "gifts",
        },
        {
          id: "ll1e",
          text: "They hug me or hold my hand often",
          resultKey: "touch",
        },
      ],
    },
    {
      id: "ll2",
      text: "When you feel disconnected from someone you love, you want them to...",
      type: "personality",
      options: [
        {
          id: "ll2a",
          text: "Say something sweet or encouraging",
          resultKey: "words",
        },
        { id: "ll2b", text: "Spend focused time with me", resultKey: "time" },
        { id: "ll2c", text: "Do something kind for me", resultKey: "acts" },
        {
          id: "ll2d",
          text: "Bring me something small and meaningful",
          resultKey: "gifts",
        },
        {
          id: "ll2e",
          text: "Give me a hug or sit close to me",
          resultKey: "touch",
        },
      ],
    },
    {
      id: "ll3",
      text: "On your birthday, what would mean the most to you?",
      type: "personality",
      options: [
        {
          id: "ll3a",
          text: "A heartfelt card or message from someone special",
          resultKey: "words",
        },
        {
          id: "ll3b",
          text: "A whole day out together, phone-free",
          resultKey: "time",
        },
        {
          id: "ll3c",
          text: "They handle all the planning and logistics",
          resultKey: "acts",
        },
        {
          id: "ll3d",
          text: "A perfectly chosen gift they picked themselves",
          resultKey: "gifts",
        },
        {
          id: "ll3e",
          text: "Lots of hugs and affectionate moments",
          resultKey: "touch",
        },
      ],
    },
    {
      id: "ll4",
      text: "What bothers you most in a relationship?",
      type: "personality",
      options: [
        {
          id: "ll4a",
          text: "Not hearing 'I love you' or words of appreciation",
          resultKey: "words",
        },
        {
          id: "ll4b",
          text: "Always being busy with no time for me",
          resultKey: "time",
        },
        {
          id: "ll4c",
          text: "Having to do everything myself",
          resultKey: "acts",
        },
        {
          id: "ll4d",
          text: "Forgetting important dates or never giving gifts",
          resultKey: "gifts",
        },
        {
          id: "ll4e",
          text: "Rarely touching or showing physical affection",
          resultKey: "touch",
        },
      ],
    },
    {
      id: "ll5",
      text: "When you want to show love to someone, you typically...",
      type: "personality",
      options: [
        {
          id: "ll5a",
          text: "Tell them how much they mean to you",
          resultKey: "words",
        },
        {
          id: "ll5b",
          text: "Plan a special day just for the two of you",
          resultKey: "time",
        },
        {
          id: "ll5c",
          text: "Do something helpful to make their life easier",
          resultKey: "acts",
        },
        {
          id: "ll5d",
          text: "Buy or make them something they'll love",
          resultKey: "gifts",
        },
        {
          id: "ll5e",
          text: "Reach for their hand or give them a warm hug",
          resultKey: "touch",
        },
      ],
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════
   Generic fallback for quizzes without custom questions yet
═══════════════════════════════════════════════════════════════ */
function makeGenericPersonality(slug: string): QuizData {
  const results: QuizResult[] = [
    {
      key: "type_a",
      emoji: "⚡",
      title: "Type A — The Achiever",
      description:
        "You're driven, organised, and goal-focused. You set high standards and consistently meet them.",
      strengths: ["Ambitious", "Organised", "Disciplined"],
      weaknesses: ["Prone to stress", "Can be impatient"],
    },
    {
      key: "type_b",
      emoji: "🌊",
      title: "Type B — The Creator",
      description:
        "You're imaginative and easy-going. You think outside the box and thrive when given creative freedom.",
      strengths: ["Creative", "Flexible", "Open-minded"],
      weaknesses: ["Can lack structure", "May procrastinate"],
    },
    {
      key: "type_c",
      emoji: "🤝",
      title: "Type C — The Connector",
      description:
        "You are the heart of every team. Building relationships and supporting others is what drives you.",
      strengths: ["Empathetic", "Collaborative", "Loyal"],
      weaknesses: ["May avoid conflict", "Puts others first"],
    },
    {
      key: "type_d",
      emoji: "🔬",
      title: "Type D — The Analyst",
      description:
        "You approach everything logically and methodically. Data, evidence, and precision are your love languages.",
      strengths: ["Precise", "Logical", "Thorough"],
      weaknesses: ["Can over-analyse", "Appears emotionally reserved"],
    },
  ];
  const questions: Question[] = [
    {
      id: `${slug}_q1`,
      text: "When starting a new project, you first...",
      type: "personality",
      options: [
        {
          id: `${slug}_q1a`,
          text: "Set clear goals and deadlines",
          resultKey: "type_a",
        },
        {
          id: `${slug}_q1b`,
          text: "Brainstorm freely without constraints",
          resultKey: "type_b",
        },
        {
          id: `${slug}_q1c`,
          text: "Talk it through with the team",
          resultKey: "type_c",
        },
        {
          id: `${slug}_q1d`,
          text: "Research and gather all available data",
          resultKey: "type_d",
        },
      ],
    },
    {
      id: `${slug}_q2`,
      text: "Your greatest strength at work is...",
      type: "personality",
      options: [
        {
          id: `${slug}_q2a`,
          text: "Getting things done efficiently",
          resultKey: "type_a",
        },
        {
          id: `${slug}_q2b`,
          text: "Coming up with original ideas",
          resultKey: "type_b",
        },
        {
          id: `${slug}_q2c`,
          text: "Building strong relationships",
          resultKey: "type_c",
        },
        {
          id: `${slug}_q2d`,
          text: "Solving complex problems",
          resultKey: "type_d",
        },
      ],
    },
    {
      id: `${slug}_q3`,
      text: "When things go wrong, you tend to...",
      type: "personality",
      options: [
        {
          id: `${slug}_q3a`,
          text: "Take charge and fix it immediately",
          resultKey: "type_a",
        },
        {
          id: `${slug}_q3b`,
          text: "Look for a creative workaround",
          resultKey: "type_b",
        },
        {
          id: `${slug}_q3c`,
          text: "Rally the team and work together",
          resultKey: "type_c",
        },
        {
          id: `${slug}_q3d`,
          text: "Analyse what went wrong first",
          resultKey: "type_d",
        },
      ],
    },
    {
      id: `${slug}_q4`,
      text: "People rely on you most for your...",
      type: "personality",
      options: [
        {
          id: `${slug}_q4a`,
          text: "Drive and determination",
          resultKey: "type_a",
        },
        { id: `${slug}_q4b`, text: "Fresh perspective", resultKey: "type_b" },
        { id: `${slug}_q4c`, text: "Warmth and support", resultKey: "type_c" },
        { id: `${slug}_q4d`, text: "Attention to detail", resultKey: "type_d" },
      ],
    },
    {
      id: `${slug}_q5`,
      text: "In your free time, you prefer...",
      type: "personality",
      options: [
        {
          id: `${slug}_q5a`,
          text: "Productive hobbies with measurable results",
          resultKey: "type_a",
        },
        {
          id: `${slug}_q5b`,
          text: "Creative outlets like art or music",
          resultKey: "type_b",
        },
        {
          id: `${slug}_q5c`,
          text: "Spending quality time with loved ones",
          resultKey: "type_c",
        },
        {
          id: `${slug}_q5d`,
          text: "Reading or learning something new",
          resultKey: "type_d",
        },
      ],
    },
  ];
  return { slug, results, questions };
}

/* ═══════════════════════════════════════════════════════════════
   Quiz Data Map
═══════════════════════════════════════════════════════════════ */
export const QUIZ_DATA_MAP: Record<string, QuizData> = {
  "personality-color-test": colorTest,
  "iq-test": iqTest,
  "introvert-extrovert-test": introvertTest,
  "love-language-test": loveLanguageTest,
  "mental-age-test": makeGenericPersonality("mental-age-test"),
  "career-personality-test": makeGenericPersonality("career-personality-test"),
  "friendship-test": makeGenericPersonality("friendship-test"),
  "stress-level-test": makeGenericPersonality("stress-level-test"),
  "which-anime-character-are-you": makeGenericPersonality(
    "which-anime-character-are-you",
  ),
  "memory-test": makeGenericPersonality("memory-test"),
  "general-knowledge-quiz": makeGenericPersonality("general-knowledge-quiz"),
  "dark-personality-test": makeGenericPersonality("dark-personality-test"),
};

/** Calculate result key from answers */
export function calculateResult(
  answers: Record<string, string>,
  quizData: QuizData,
): QuizResult {
  const quizType = quizData.questions[0]?.type ?? "personality";

  if (quizType === "scored") {
    // Count correct answers
    let score = 0;
    quizData.questions.forEach((q) => {
      const selectedId = answers[q.id];
      const selected = q.options.find((o) => o.id === selectedId);
      if (selected?.correct) score++;
    });
    // Map score to result
    const sorted = [...quizData.results].sort(
      (a, b) => (b.minScore ?? 0) - (a.minScore ?? 0),
    );
    return (
      sorted.find((r) => score >= (r.minScore ?? 0)) ??
      sorted[sorted.length - 1]
    );
  }

  // Personality mapping — tally votes per result key
  const tally: Record<string, number> = {};
  quizData.questions.forEach((q) => {
    const selectedId = answers[q.id];
    const selected = q.options.find((o) => o.id === selectedId);
    if (selected?.resultKey) {
      tally[selected.resultKey] = (tally[selected.resultKey] ?? 0) + 1;
    }
  });
  const topKey = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0];
  return quizData.results.find((r) => r.key === topKey) ?? quizData.results[0];
}
