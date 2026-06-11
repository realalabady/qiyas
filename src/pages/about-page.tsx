import { motion } from "framer-motion";
import { Zap, Target, Heart } from "lucide-react";

import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n";

export default function AboutPage() {
  const { t } = useLanguage();
  const values = [
    {
      icon: Zap,
      title: t("about.value.speed.title"),
      body: t("about.value.speed.body"),
    },
    {
      icon: Target,
      title: t("about.value.accuracy.title"),
      body: t("about.value.accuracy.body"),
    },
    {
      icon: Heart,
      title: t("about.value.free.title"),
      body: t("about.value.free.body"),
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 space-y-14">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-center space-y-4"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold">
          <span className="gradient-text">{t("about.title")}</span>
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {t("about.subtitle")}
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-6 sm:grid-cols-3"
      >
        {values.map(({ icon: Icon, title, body }) => (
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
        <h2 className="text-2xl font-bold">{t("about.mission.title")}</h2>
        <p className="text-muted-foreground leading-relaxed">
          {t("about.mission.p1")}
        </p>
        <p className="text-muted-foreground leading-relaxed">
          {t("about.mission.p2")}
        </p>
      </motion.div>
    </div>
  );
}
