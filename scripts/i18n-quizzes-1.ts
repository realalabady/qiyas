/**
 * English for the Big Five and attachment quizzes.
 *
 * Questions and answers are positional — they must stay in the same order as
 * scripts/add-quizzes-1.ts, and _i18n-lib.ts asserts the counts before writing.
 * Results are keyed by their authored ids.
 *
 * Usage:
 *   node --experimental-strip-types scripts/i18n-quizzes-1.ts [--apply]
 */

import { runQuizI18n, type QuizEn, type QuizQuestionEn } from "./_i18n-lib.ts";

const S = "https://www.al-maarefah.com";

const AGREE = [
  "Does not apply to me at all",
  "Applies to me slightly",
  "Applies to me somewhat",
  "Applies to me a lot",
  "Applies to me completely",
];

const q = (text: string): QuizQuestionEn => ({ text, answers: AGREE });

const EN: Record<string, QuizEn> = {
  "اختبار-العوامل-الخمسة-الكبرى": {
    title: "The Big Five Test: Which Trait Is Most Prominent in You?",
    description:
      "Twenty questions on the Big Five model — the one researchers actually use — to find which of the five traits is most prominent in how you describe yourself.",
    seoTitle: "Big Five personality test - five factor model - personality traits",
    seoDescription:
      "The Big Five personality test: openness, conscientiousness, extraversion, agreeableness and emotional sensitivity. Twenty questions, and a result that explains what the trait means and what it does not.",
    longDescription: `# What does this test measure?

The **Big Five** is the only widely known personality model that was extracted from data rather than imposed on it: thousands of words describing people were collected, people rated themselves on them, and statistical analysis revealed they cluster into five bundles. That same clustering has recurred across languages, cultures and measurement instruments.

The five traits are: **openness to experience**, **conscientiousness**, **extraversion**, **agreeableness**, and **emotional sensitivity** (neuroticism).

# How to answer

Twenty statements, four per trait. Answer each one for your usual behaviour over recent months — not for what you wish you were, and not for a single exceptional occasion. The first answer that comes to mind is usually more accurate than one you deliberate over.

# How to read your result

The result shows **the most prominent trait in your answers**, then the rest ranked by proportion.

Read it as "what dominated my description of myself", not as your personality type. The Big Five are **continuous dimensions**, not boxes: every one of us has all five to some degree, and most people sit in the middle on most of them. The trait that comes out on top does not cancel the other four.

# The limits of this test specifically

We say this plainly because most comparable tests do not:

* **It is not a validated inventory.** The Big Five instruments used in research — IPIP items or BFI-2 — are longer, and have normative samples your score is compared against. This test has none, so its result is relative among your own traits rather than a comparison with other people.
* **All its items run one way.** Agreeing always raises the score, which makes it vulnerable to **acquiescence bias**: someone inclined to agree in general scores higher on every trait. Research inventories handle this with reverse-worded items.
* **It measures no ability and judges nobody.** Traits are descriptions, not merits, and none of the five is the "best" one.

# What the model can actually tell you

This is what separates it from type tests: it has measured predictive power. Meta-analyses have found that **conscientiousness** predicts job performance across occupations, and that traits compete with socioeconomic status and cognitive ability in predicting life outcomes such as longevity and marital stability. The size of those effects is **moderate**, not deterministic: it improves your long-run estimate, it does not predict what you will do tomorrow.

# Read more

For the full account of where the model came from, what it predicts in numbers, and why Myers-Briggs stumbles against the same criteria, see our guide: [The Big Five](${S}/articles/%D9%86%D9%85%D9%88%D8%B0%D8%AC-%D8%A7%D9%84%D8%B9%D9%88%D8%A7%D9%85%D9%84-%D8%A7%D9%84%D8%AE%D9%85%D8%B3%D8%A9-%D8%A7%D9%84%D9%83%D8%A8%D8%B1%D9%89)`,
    questions: [
      q("I enjoy thinking about abstract and theoretical ideas."),
      q("I seek out new experiences even when they are uncomfortable."),
      q("Art, music or literature genuinely pull at me."),
      q("I chafe at routine and doing the same things over again."),

      q("I plan my day or week in advance."),
      q("I finish what I start even after it stops being appealing."),
      q("I arrive on time and keep to appointments."),
      q("I attend to small details and check my work before submitting it."),

      q("I draw energy from being among people."),
      q("I start conversations with people I do not know easily."),
      q("I prefer a crowded, lively place to a quiet one."),
      q("I talk more than I listen in a group."),

      q("I assume good intentions in others until shown otherwise."),
      q("I give up my position to preserve a relationship."),
      q("I feel what others are going through and it affects me."),
      q("I avoid confrontation and prefer solutions that satisfy everybody."),

      q("I worry about things that may never happen."),
      q("My mood changes quickly."),
      q("Criticism stays with me for a long time."),
      q("I feel stress physically — in my stomach, shoulders or sleep."),
    ],
    results: {
      openness: {
        title: "Openness to Experience 🔭",
        description: `**Openness to experience** came out on top in how you describe yourself: a pull toward ideas, experimentation and variety, and more attraction to what you have not yet encountered than to what you have mastered.

This shows up in concrete ways: you open a new subject simply because it looked interesting, you tire of repetitive work faster than others do, and you find opportunity in ambiguity rather than threat. People high on this trait keep learning for years after formal education ends, which does more for a long career than any credential.

The likely cost is depth: openness opens more doors than it closes, so you end up knowing a little about a great deal. What gets built on at work is usually depth, not breadth. Pick one subject each quarter and go into it far enough to explain it to someone who does not know it — being able to explain is the test of understanding.

**Remember this result is relative.** The test says openness is the most prominent of your five traits, not that you are high on it compared with other people — there is no normative sample here. The other four are present in you to some degree, and the leading trait does not summarise you.`,
      },
      conscientiousness: {
        title: "Conscientiousness 🎯",
        description: `**Conscientiousness** came out on top in how you describe yourself: organisation, follow-through, finishing what you start, and postponing a pleasure for a later result.

This is the trait whose value is worth knowing, because it is the strongest predictor in the whole model. A well-known meta-analysis found it predicts job performance across every occupational group examined — the only one of the five that does. And in a study comparing traits against socioeconomic status and cognitive ability, conscientiousness competed with both in predicting longevity, marital stability and occupational attainment.

The cost appears at its upper end: care about getting it right turns into delay when you wait for conditions to be complete, and perfectionism raises the cost of starting. You may find it hard to hand a task to someone else because you know you would do it better — making you a bottleneck for the people around you.

So allow the first version to be incomplete on purpose, and hand over one whole task this month, its decision included rather than just its execution.

**And the result is relative among your own traits**, not a comparison with other people.`,
      },
      extraversion: {
        title: "Extraversion 🔊",
        description: `**Extraversion** came out on top in how you describe yourself: drawing energy from interaction, being comfortable in groups, and tending to take the lead in conversation.

This shows up in the way long solitude drains you while it restores others, in thinking out loud and arriving at your view while speaking rather than before, and in a network that widens without deliberate effort — one of your most useful practical assets, since a sizeable share of opportunities are never advertised.

It is worth clarifying what this trait does not mean: being low on it is not shyness and not social anxiety, which belong to an entirely different trait. An introvert is not afraid of people; interaction simply costs them more energy.

The cost that deserves your attention is your effect on other people's silence. When the most forward person speaks first, the dissenting view recedes — not because it has been persuaded but because the cost went up. In meetings, speak last rather than first, and ask directly of whoever has not spoken.

**This is a relative result** saying extraversion is the most prominent of your five traits, not that you are high on it compared with others.`,
      },
      agreeableness: {
        title: "Agreeableness 🤝",
        description: `**Agreeableness** came out on top in how you describe yourself: cooperation, assuming good intentions, empathy, and preferring harmony to confrontation.

This builds a kind of trust that cannot be bought. People feel safe with you, they come to you to mediate, and you notice tension in a group before it is announced.

The cost is well known and recurrent: difficulty saying no, carrying loads that are not yours, and postponing conflict until it grows rather than resolving it small. The subtler danger is conflating two states that look identical from outside: genuinely being content, and being comfortable with the absence of conflict. The question that separates them: if refusing carried no cost at all, what would I have chosen?

There is an occupational cost too: evidence suggests high agreeableness is associated with worse outcomes in negotiation and in pay — because someone who avoids confrontation also avoids asking.

So practise one short refusal that needs no justification, and state your position once clearly on the matters that matter to you, even if it is not accepted.

**And the result is relative** among your traits, not against a normative sample.`,
      },
      neuroticism: {
        title: "Emotional Sensitivity 🌊",
        description: `**Emotional sensitivity** came out on top in how you describe yourself — what the model calls neuroticism. The name is more alarming than its meaning: what is meant is the sensitivity of your emotional system, how much of a situation reaches you and how fast.

This shows up in criticism staying with you longer, small situations taking on a larger size, and stress translating into physical tension — in sleep, the stomach, the shoulders.

The trait has a useful face that drops out of popular accounts: sensitivity in noticing. People high on it are among the most accurate at spotting that something is not right, the quickest to register risk, and the least prone to overconfident estimates.

What helps in practice, with research behind it: **name the feeling in one word** before responding, since naming alone lowers its intensity; and use **reappraisal** — changing your interpretation of the situation — rather than suppression, because suppression consumes effort without reducing the feeling. And stabilise your sleep, since disturbed sleep raises sensitivity and is raised by it in a closed loop.

**This test is not a diagnostic instrument.** The trait is not a disorder, and a high score on it is not pathological anxiety. If tension is persistent and affecting your sleep, work and relationships, assessment by a mental health professional is the right route.`,
      },
    },
  },

  "اختبار-نمط-التعلق": {
    title: "Attachment Style Test: Where Do You Sit on Anxiety and Avoidance?",
    description:
      "Sixteen questions built on the two dimensions the research actually found — attachment anxiety and avoidance — rather than four boxes. With an explanation of what your position means and what it does not.",
    seoTitle: "Attachment style test - secure anxious avoidant - attachment in relationships",
    seoDescription:
      "Attachment style test: secure, anxious, avoidant, or high on both. Built on the anxiety and avoidance dimensions used in research instruments, with an explanation of the test's limits.",
    longDescription: `# What does this test measure?

Attachment theory began with children: researchers noticed that what a child does **on reunion** with a caregiver after a brief absence reveals a recurring pattern in what they expect of a response. In the mid-1980s it was proposed that adult romantic relationships operate as an attachment system too: the partner becomes the person from whom safety is sought in distress.

This test measures **two dimensions**, which is what statistical analysis of attachment questionnaires actually found:

* **Attachment anxiety** — how preoccupied you are with being left, or with the other person caring less than you do.
* **Attachment avoidance** — how uncomfortable closeness and dependence make you, and how much you lean toward emotional self-sufficiency.

# How to answer

Sixteen statements. Answer for your **recurring** pattern in close relationships — not for one bad relationship, and not for what you wish were true. If you are not in a relationship now, answer from what you recall of previous ones or expect of yourself.

# How to read your result

The result shows which quadrant your position falls in: low on both (**secure**), high anxiety (**anxious**), high avoidance (**avoidant**), or high on both.

**The four styles are not real categories.** This is the most important point on the page. When researchers tested the data directly for whether attachment is categorical or continuous, the answer pointed to **continuous**. The four styles are nothing more than quadrants of a two-dimensional space, drawn to make discussion easier. In practice that means someone falling near a dividing line gets classified completely differently for a small difference in score — and that saying "I am avoidant" converts a position on a scale into an identity that does not carry that precision.

# The limits of this test

* **It is not a validated instrument.** The research measures — the ECR and its revised form — are longer and have published psychometric properties. This is a short test giving an indication, not a comparable score.
* **A style is not a final verdict.** A meta-analysis found the association between childhood and adult attachment is real but **moderate in strength** — meaning the effect of early experience is not erased, and a great many people do change. What is most associated with movement toward security is a stable long relationship with a responsive person, and psychotherapy.
* **And do not use it to classify your partner.** Questionnaires are self-reports, and are not suited to diagnosing someone who is not the one answering.

# Read more

For the origins of the theory, the evidence for the two dimensions, and why researchers reject sorting people into four boxes, see: [Attachment styles in relationships](${S}/articles/%D8%A7%D9%86%D9%85%D8%A7%D8%B7-%D8%A7%D9%84%D8%AA%D8%B9%D9%84%D9%82-%D9%81%D9%8A-%D8%A7%D9%84%D8%B9%D9%84%D8%A7%D9%82%D8%A7%D8%AA)`,
    questions: [
      q("I worry that someone close to me will stop caring about me."),
      q("I need repeated reassurance that the relationship is fine."),
      q("If they are slow to reply to my message, I start imagining bad reasons."),
      q("I feel my investment in the other person is greater than theirs in me."),
      q("My mood is badly affected by any coolness in how they treat me."),
      q("I replay what I said after an argument, afraid I have broken something."),
      q("I fear that someone who gets close will find a flaw in me and pull back."),
      q("I need conflict resolved immediately and cannot leave it until tomorrow."),

      q("I find it hard to talk about my feelings in front of someone I love."),
      q("I prefer to solve my problems myself without involving anyone."),
      q("I withdraw from a conversation once it becomes emotionally charged."),
      q("I feel uncomfortable when someone depends on me heavily."),
      q("I need clear space of my own inside a relationship."),
      q("I usually do not ask for support even when I genuinely need it."),
      q("Too much closeness makes me want to step back."),
      q("I find talk about the future of a relationship uncomfortable or premature."),
    ],
    results: {
      secure: {
        title: "Low on Anxiety and Avoidance — Secure 🌿",
        description: `Your answers came out low on both dimensions: you are not greatly preoccupied with being left, and closeness and dependence do not trouble you. This is what is called security in attachment.

It shows up in specific ways: you can **ask** for support when you need it and **give** it when asked; you can tolerate conflict without it becoming a threat to the relationship itself; and you read ambiguity — an unanswered message, a flat tone — on a plausible reading rather than the worst one. The result is that your disagreements stay their actual size.

It is worth knowing that security is **not a fixed trait in you** but the product of repeated experience. Which means two things: it can be shaken in an unresponsive relationship or after a painful experience, and your own responsive presence is itself among the strongest things that move another person toward security — this is what the evidence on change points to.

What deserves your attention: security makes needs easier to meet, so you may not notice when a stretch goes by in which you ask for nothing. Watch whether you say what bothers you, or just absorb it because absorbing it is easy for you.

**The result describes a position on two continuous dimensions, not a fixed style** — the four quadrants are a presentational convenience, not categories the research found.`,
      },
      anxious: {
        title: "High on Anxiety — Anxious 💭",
        description: `Your answers came out high on **attachment anxiety** and relatively low on avoidance: you want closeness, and you are preoccupied with it being withdrawn.

This shows up in heightened sensitivity to signs of rejection, in repeated reassurance-seeking, and in escalating during conflict rather than withdrawing — that is, you move closer when the other person moves away, the opposite of what the facing pattern does.

The most important thing to say here: needing reassurance is not a flaw, and the goal is not to get rid of it. The goal is **separating the feeling from the behaviour**. There is a large difference between stating what you feel and testing the other person: "I felt some distance between us today" is clearer and far cheaper than a string of messages hunting for a signal — and the second usually produces the thing you fear.

What helps in practice: when an impression of rejection arrives, **ask instead of inferring** — a direct question saves days of guessing, and most silence is preoccupation rather than a stance. Delay any written reply sent in a charged moment by ten minutes. And notice the conditions that narrow the gap between feeling and action: exhaustion, lack of sleep, late-night conversations — avoiding them is easier than self-control during them.

**This is a score on a continuous dimension, not an identity.** The evidence says the position changes, and that what moves it most is a stable relationship with a responsive person, and psychotherapy.`,
      },
      avoidant: {
        title: "High on Avoidance — Avoidant 🚪",
        description: `Your answers came out high on **attachment avoidance** and relatively low on anxiety: you are comfortable relying on yourself, and closeness costs you more than it costs others.

This shows up in holding back from disclosing feelings, withdrawing during conflict, preferring to handle things alone — and also, this gets forgotten, in discomfort at being heavily depended on.

The pattern has a genuine strength: you function under pressure without emotionally seizing up, and you do not make consequential decisions in a charged moment.

The cost is that withdrawal reads to the other person as rejection — not the withdrawal itself but its **silence**. Which is why the most effective and least expensive change is saying when you will be back: "I need an hour and then we'll continue" does what no later explanation does.

What helps in practice: stay in the difficult conversation ten minutes past the point where you want it to end — that exact moment is the training ground. And ask for help once with something you could do yourself, to test that asking costs you nothing.

**And if you are with a partner high on anxiety**, the loop itself is the problem rather than either of you: their bid for closeness reads as pressure so your withdrawal increases, and your withdrawal reads as rejection so their bids increase. Breaking it needs a counterintuitive move from both of you at the same time.`,
      },
      fearful: {
        title: "High on Both Anxiety and Avoidance 🌗",
        description: `Your answers came out high on **both dimensions**: you want closeness and fear it at the same time. This is what used to be called fearful or disorganised attachment, and it is entirely possible — because anxiety and avoidance are two separate dimensions, not two ends of one scale.

It shows up in a pattern that looks contradictory from outside and is coherent from inside: you move close strongly then suddenly pull back; you want someone to reassure you and cannot accept reassurance; you miss the relationship and feel relief when it ends. The reason is that your attachment system is calling for closeness while another system warns about its cost — so both signals fire together.

This pattern is often associated with experiences in which the person from whom safety was sought was themselves the source of the distress, so closeness became coupled with danger.

What helps in practice: **start with observation, not repair** — log for two weeks when you moved close, when you pulled back, and what preceded each move; the pattern emerges faster than you expect. And when the urge to withdraw arrives, postpone the decision by one day without cutting off, because the urge usually subsides on its own.

**This quadrant specifically is the one where we recommend a professional.** Not because something is wrong with it, but because handling a conflict of this size is harder than an article or a test can address, and psychotherapy directed at relationships and interaction patterns is among the approaches the evidence most supports. This test is not a diagnostic instrument in any case.`,
      },
    },
  },
};

runQuizI18n(EN, "quizzes batch 1 (en)");
