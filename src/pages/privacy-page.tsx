import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n";

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

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 space-y-10">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        <h1 className="text-4xl font-extrabold">
          <span className="gradient-text">{t("privacy.title")}</span>
        </h1>
        <p className="text-sm text-muted-foreground">{t("privacy.updated")}</p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="glass-card rounded-2xl p-8 space-y-8 text-sm"
      >
        <Section title={t("privacy.s1.title")}>
          <p>{t("privacy.s1.p1")}</p>
          <p>{t("privacy.s1.p2")}</p>
        </Section>

        <Section title={t("privacy.s2.title")}>
          <p>{t("privacy.s2.p1")}</p>
          <p>{t("privacy.s2.p2")}</p>
        </Section>

        <Section title={t("privacy.s3.title")}>
          <p>{t("privacy.s3.p1")}</p>
        </Section>

        <Section title={t("privacy.s4.title")}>
          <p>{t("privacy.s4.p1")}</p>
        </Section>

        <Section title={t("privacy.s5.title")}>
          <p>{t("privacy.s5.p1")}</p>
        </Section>

        <Section title={t("privacy.s6.title")}>
          <p>{t("privacy.s6.p1")}</p>
        </Section>

        <Section title={t("privacy.s7.title")}>
          <p>{t("privacy.s7.p1")}</p>
        </Section>

        <Section title={t("privacy.s8.title")}>
          <p>
            {t("privacy.s8.p1")}{" "}
            <a
              href="mailto:privacy@qiyas.app"
              className="text-primary hover:underline"
            >
              privacy@qiyas.app
            </a>
            .
          </p>
        </Section>
      </motion.div>
    </div>
  );
}
