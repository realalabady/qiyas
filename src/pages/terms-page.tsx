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

export default function TermsPage() {
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
          <span className="gradient-text">{t("terms.title")}</span>
        </h1>
        <p className="text-sm text-muted-foreground">{t("terms.updated")}</p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="glass-card rounded-2xl p-8 space-y-8 text-sm"
      >
        <Section title={t("terms.s1.title")}>
          <p>{t("terms.s1.p1")}</p>
        </Section>

        <Section title={t("terms.s2.title")}>
          <p>{t("terms.s2.p1")}</p>
          <p>{t("terms.s2.p2")}</p>
        </Section>

        <Section title={t("terms.s3.title")}>
          <p>{t("terms.s3.p1")}</p>
          <p>{t("terms.s3.p2")}</p>
        </Section>

        <Section title={t("terms.s4.title")}>
          <p>{t("terms.s4.p1")}</p>
          <p>{t("terms.s4.p2")}</p>
        </Section>

        <Section title={t("terms.s5.title")}>
          <p>{t("terms.s5.p1")}</p>
        </Section>

        <Section title={t("terms.s6.title")}>
          <p>{t("terms.s6.p1")}</p>
        </Section>

        <Section title={t("terms.s7.title")}>
          <p>
            {t("terms.s7.p1")}{" "}
            <a
              href="mailto:legal@al-maarefah.app"
              className="text-primary hover:underline"
            >
              legal@al-maarefah.app
            </a>
            .
          </p>
        </Section>
      </motion.div>
    </div>
  );
}
