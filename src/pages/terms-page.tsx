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

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 space-y-10">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        <h1 className="text-4xl font-extrabold">
          Terms &amp; <span className="gradient-text">Conditions</span>
        </h1>
        <p className="text-sm text-muted-foreground">Last updated: June 2025</p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="glass-card rounded-2xl p-8 space-y-8 text-sm"
      >
        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using Qiyas, you agree to be bound by these Terms
            and Conditions. If you do not agree, please do not use the platform.
          </p>
        </Section>

        <Section title="2. Use of the Platform">
          <p>
            Qiyas is provided for entertainment and personal insight purposes
            only. You agree to use it only for lawful purposes and in a manner
            that does not infringe the rights of others.
          </p>
          <p>
            You must not attempt to scrape, copy, reproduce, or distribute our
            quiz content without written permission.
          </p>
        </Section>

        <Section title="3. Content Ownership">
          <p>
            All quiz content, including questions, results, and design, is the
            intellectual property of Qiyas. Results generated are for personal,
            non-commercial use.
          </p>
          <p>
            When you share a result, you grant us a non-exclusive license to
            display that shared content.
          </p>
        </Section>

        <Section title="4. Disclaimer">
          <p>
            Qiyas quizzes are for entertainment and self-reflection only. They
            are not a substitute for professional psychological, medical, or
            career advice.
          </p>
          <p>
            Results are indicative and not scientifically validated clinical
            assessments.
          </p>
        </Section>

        <Section title="5. Limitation of Liability">
          <p>
            Qiyas is provided "as is" without warranties of any kind. We are not
            liable for any indirect, incidental, or consequential damages
            arising from your use of the platform.
          </p>
        </Section>

        <Section title="6. Changes to Terms">
          <p>
            We reserve the right to modify these terms at any time. Continued
            use of the platform after changes constitutes acceptance of the new
            terms.
          </p>
        </Section>

        <Section title="7. Contact">
          <p>
            Questions? Email{" "}
            <a
              href="mailto:legal@qiyas.app"
              className="text-primary hover:underline"
            >
              legal@qiyas.app
            </a>
            .
          </p>
        </Section>
      </motion.div>
    </div>
  );
}
