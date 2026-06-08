import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";

import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/motion";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
          Contact <span className="gradient-text">Us</span>
        </h1>
        <p className="text-muted-foreground">
          Have a question, suggestion, or just want to say hi?
        </p>
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
            <p className="font-medium">Email Us</p>
            <a
              href="mailto:hello@qiyas.app"
              className="text-sm text-primary hover:underline"
            >
              hello@qiyas.app
            </a>
          </div>
        </div>

        {sent ? (
          <div className="text-center py-8 space-y-3">
            <p className="text-4xl">✅</p>
            <p className="font-semibold text-lg">Message sent!</p>
            <p className="text-muted-foreground text-sm">
              We&apos;ll get back to you within 24–48 hours.
            </p>
            <Button variant="outline" size="sm" onClick={() => setSent(false)}>
              Send another
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="What's this about?" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Tell us what's on your mind…"
                required
              />
            </div>
            <Button type="submit" className="w-full gap-2">
              <Send className="size-4" /> Send Message
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
