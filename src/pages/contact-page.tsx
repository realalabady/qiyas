import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";

import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/motion";
import { useLanguage } from "@/lib/i18n";

const CONTACT_EMAIL = "info@al-maarefah.com";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const { t } = useLanguage();

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  /**
   * Hand the message to the visitor's mail client.
   *
   * This form used to just flip a boolean and announce "Message sent!" while
   * discarding everything typed into it. There is no backend to post to, so it
   * composes a real mailto: instead — the message actually reaches us, and the
   * confirmation says what genuinely happened.
   */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = `${form.message}\n\n---\n${form.name} <${form.email}>`;
    window.location.href =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(form.subject)}` +
      `&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 space-y-10">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-center space-y-3"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold">
          <span className="gradient-text">{t("contact.title")}</span>
        </h1>
        <p className="text-muted-foreground">{t("contact.subtitle")}</p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="space-y-4 text-muted-foreground leading-relaxed"
      >
        <p>{t("contact.body.p1")}</p>
        <p>{t("contact.body.p2")}</p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="glass-card rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/20">
            <Mail className="size-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{t("contact.email_title")}</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-sm text-primary hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        {sent ? (
          <div className="text-center py-8 space-y-3">
            <p className="text-4xl">✅</p>
            <p className="font-semibold text-lg">{t("contact.sent.title")}</p>
            <p className="text-muted-foreground text-sm">{t("contact.sent.subtitle")}</p>
            <Button variant="outline" size="sm" onClick={() => setSent(false)}>
              {t("contact.sent.another")}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("contact.form.name")}</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={update("name")}
                  placeholder={t("contact.form.name_placeholder")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("contact.form.email")}</Label>
                <Input
                  id="email"
                  value={form.email}
                  onChange={update("email")}
                  type="email"
                  placeholder={t("contact.form.email_placeholder")}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">{t("contact.form.subject")}</Label>
              <Input
                  id="subject"
                  value={form.subject}
                  onChange={update("subject")}
                  placeholder={t("contact.form.subject_placeholder")}
                  required
                />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">{t("contact.form.message")}</Label>
              <Textarea
                id="message"
                  value={form.message}
                  onChange={update("message")}
                placeholder={t("contact.form.message_placeholder")}
                required
              />
            </div>
            <Button type="submit" className="w-full gap-2">
              <Send className="size-4" /> {t("contact.form.submit")}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
