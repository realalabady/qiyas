import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";

const FAQS = [
  {
    q: "Are all quizzes free?",
    a: "Yes! Every quiz on Qiyas is 100% free. No subscriptions, no hidden fees, no paywalls — ever.",
  },
  {
    q: "Do I need to create an account?",
    a: "Absolutely not. You can take any quiz instantly without signing up. Just visit the quiz page and start.",
  },
  {
    q: "Are the results accurate?",
    a: "Our quizzes are built with care and draw from established psychological frameworks. That said, they're designed for fun and self-reflection — not clinical diagnosis.",
  },
  {
    q: "Can I share my result?",
    a: "Yes! Every result page has share buttons for major social platforms, plus a copy-link option. Sharing is encouraged.",
  },
  {
    q: "How often are new quizzes added?",
    a: "We add new quizzes regularly — typically a few each week. Follow us on social media to be the first to know.",
  },
  {
    q: "Is my data private?",
    a: "We don't collect personal data beyond anonymous usage analytics used to improve the platform. We never sell your data. See our Privacy Policy for full details.",
  },
  {
    q: "Can I suggest a quiz topic?",
    a: "We'd love that! Use the Contact page to send us your idea and we'll consider it for a future quiz.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      variants={staggerItem}
      className="glass-card rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-medium">{q}</span>
        <ChevronDown
          className={`size-5 text-muted-foreground shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4">
          {a}
        </div>
      )}
    </motion.div>
  );
}

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 space-y-10">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-center space-y-3"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold">
          Frequently Asked <span className="gradient-text">Questions</span>
        </h1>
        <p className="text-muted-foreground">
          Everything you need to know about Qiyas.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {FAQS.map(({ q, a }) => (
          <FAQItem key={q} q={q} a={a} />
        ))}
      </motion.div>
    </div>
  );
}
