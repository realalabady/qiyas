import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n";

/**
 * Editorial policy — who writes the content, how quizzes are built, how errors
 * are corrected, and where the limits are.
 *
 * Psychology and IQ content is judged on whether a reader can tell who stands
 * behind it. Every article is bylined to the editorial team, so this page is
 * what makes that byline meaningful.
 */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="text-muted-foreground leading-relaxed space-y-2">
        {children}
      </div>
    </section>
  );
}

export default function EditorialPolicyPage() {
  const { t } = useLanguage();

  const sections = [
    { key: "s1", paragraphs: ["p1", "p2"] },
    { key: "s2", paragraphs: ["p1", "p2"] },
    { key: "s3", paragraphs: ["p1"] },
    { key: "s4", paragraphs: ["p1"] },
    { key: "s5", paragraphs: ["p1"] },
    { key: "s6", paragraphs: ["p1"] },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 space-y-10">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        <h1 className="text-4xl font-extrabold">
          <span className="gradient-text">{t("editorial.title")}</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("editorial.subtitle")}
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="glass-card rounded-2xl p-8 space-y-8"
      >
        {sections.map(({ key, paragraphs }) => (
          <Section key={key} title={t(`editorial.${key}.title`)}>
            {paragraphs.map((p) => (
              <p key={p}>{t(`editorial.${key}.${p}`)}</p>
            ))}
          </Section>
        ))}
      </motion.div>
    </div>
  );
}
