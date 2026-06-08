import { motion } from "framer-motion";
import { Zap, Target, Heart } from "lucide-react";

import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";

const VALUES = [
  {
    icon: Zap,
    title: "Speed First",
    body: "Every quiz loads instantly and results appear the second you finish.",
  },
  {
    icon: Target,
    title: "Accuracy Matters",
    body: "Our quizzes are researched and validated to give meaningful, reliable insights.",
  },
  {
    icon: Heart,
    title: "Always Free",
    body: "No paywall, no registration, no tricks. Qiyas is free for everyone, forever.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 space-y-14">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-center space-y-4"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold">
          About <span className="gradient-text">Qiyas</span>
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Qiyas is a viral quiz platform built for curious minds. We believe
          self-discovery should be fun, fast, and free — no account required.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-6 sm:grid-cols-3"
      >
        {VALUES.map(({ icon: Icon, title, body }) => (
          <motion.div
            key={title}
            variants={staggerItem}
            className="glass-card rounded-2xl p-6 space-y-3 text-center"
          >
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/20">
              <Icon className="size-6 text-primary" />
            </div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{body}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="glass-card rounded-2xl p-8 space-y-4"
      >
        <h2 className="text-2xl font-bold">Our Mission</h2>
        <p className="text-muted-foreground leading-relaxed">
          We created Qiyas because great personality insights and IQ tests were
          locked behind paywalls, email signups, and intrusive apps. We wanted
          something different: a platform where you open the site, take a quiz,
          get your result, and share it — all in under five minutes.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Every quiz on Qiyas is crafted with care: researched by psychology
          enthusiasts, written by storytellers, and designed by people who care
          about user experience. We&apos;re building the quiz platform we always
          wanted to use.
        </p>
      </motion.div>
    </div>
  );
}
