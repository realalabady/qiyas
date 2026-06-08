import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

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
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 space-y-10">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        <h1 className="text-4xl font-extrabold">
          Privacy <span className="gradient-text">Policy</span>
        </h1>
        <p className="text-sm text-muted-foreground">Last updated: June 2025</p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="glass-card rounded-2xl p-8 space-y-8 text-sm"
      >
        <Section title="1. Information We Collect">
          <p>
            Qiyas does not require account creation. We collect no personally
            identifiable information from quiz takers.
          </p>
          <p>
            We collect anonymous, aggregated usage data — such as which quizzes
            are viewed or started — to improve the platform.
          </p>
        </Section>

        <Section title="2. Cookies">
          <p>
            We use minimal cookies for analytics and to remember your quiz
            progress locally. We do not use tracking cookies for advertising
            profiling.
          </p>
          <p>
            You can disable cookies in your browser settings at any time. Some
            features (like auto-saving answers) may be affected.
          </p>
        </Section>

        <Section title="3. Analytics">
          <p>
            We use privacy-respecting analytics to understand how visitors use
            the site. This includes page views and quiz completion rates — no
            personal data is collected.
          </p>
        </Section>

        <Section title="4. Google AdSense">
          <p>
            Qiyas may display advertisements served by Google AdSense. Google
            may use cookies to show relevant ads based on your browsing history.
            You can opt out via Google&apos;s Ad Settings.
          </p>
        </Section>

        <Section title="5. Third-Party Services">
          <p>
            We use Firebase (Google) for our backend infrastructure. Firebase
            may process anonymized usage data in accordance with Google&apos;s
            Privacy Policy.
          </p>
        </Section>

        <Section title="6. Children's Privacy">
          <p>
            Qiyas is not directed at children under 13. We do not knowingly
            collect data from children.
          </p>
        </Section>

        <Section title="7. Changes to This Policy">
          <p>
            We may update this policy periodically. Changes will be posted on
            this page with an updated date.
          </p>
        </Section>

        <Section title="8. Contact">
          <p>
            Questions about this policy? Email us at{" "}
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
