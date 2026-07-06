export type ArticleLang = "en" | "ar";

/** Per-language snapshot of an article's display text. */
export interface ArticleI18n {
  title?: string;
  excerpt?: string;
  content?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string | null;
  author: string;
  category: string;
  tags: string[];
  published: boolean;
  /** Auto-generated translations keyed by language. Optional for legacy data. */
  i18n?: Partial<Record<ArticleLang, ArticleI18n>>;
  createdAt: Date;
  updatedAt: Date;
  views: number;
}

export const SAMPLE_ARTICLES: Omit<
  Article,
  "id" | "createdAt" | "updatedAt"
>[] = [
  {
    title:
      "Understanding Personality Types: A Deep Dive into the Myers-Briggs System",
    slug: "understanding-personality-types-myers-briggs",
    content: `The Myers-Briggs Type Indicator (MBTI) is one of the most popular personality assessment tools in the world. This comprehensive guide explores the four dichotomies that make up the 16 personality types and how they influence our behavior, relationships, and career choices.

The four dimensions of MBTI are:
- Introversion (I) vs Extraversion (E)
- Sensing (S) vs Intuition (N)
- Thinking (T) vs Feeling (F)
- Judging (J) vs Perceiving (P)

Each combination creates a unique personality type with distinct characteristics and preferences. Whether you're an INTJ strategist, an ENFP enthusiast, or any other type, understanding your personality can lead to better self-awareness and improved relationships.`,
    excerpt:
      "Discover the foundations of the Myers-Briggs Type Indicator and how it can help you understand yourself and others better.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    author: "Admin",
    category: "Personality",
    tags: ["mbti", "personality", "psychology"],
    published: true,
    views: 1524,
  },
  {
    title: "5 Surprising Facts About IQ Tests You Didn't Know",
    slug: "5-surprising-facts-about-iq-tests",
    content: `IQ tests have been around for over a century, yet many people still misunderstand them. Here are five fascinating facts about intelligence testing that might surprise you...

1. IQ tests measure specific cognitive abilities, not all forms of intelligence
2. Your IQ score can change over time with practice and education
3. Different IQ tests can produce slightly different results
4. IQ is not the only predictor of success in life
5. Cultural factors can influence IQ test performance`,
    excerpt:
      "Learn surprising facts about IQ testing and what intelligence tests really measure.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    author: "Admin",
    category: "Intelligence",
    tags: ["iq", "testing", "cognition"],
    published: true,
    views: 892,
  },
  {
    title: "The Psychology Behind Career Compatibility Tests",
    slug: "psychology-career-compatibility-tests",
    content: `Career compatibility tests use psychological principles to match individuals with suitable professions. Learn how these assessments work and why they're becoming increasingly valuable in career planning...

Career tests analyze various factors including skills, interests, values, and personality traits to suggest suitable career paths. This personalized approach has helped millions find fulfilling careers.`,
    excerpt:
      "Explore the science behind career compatibility tests and how they can guide your professional path.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    author: "Admin",
    category: "Career",
    tags: ["career", "compatibility", "psychology"],
    published: true,
    views: 654,
  },
];
