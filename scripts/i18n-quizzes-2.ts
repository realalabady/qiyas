/**
 * English for the burnout, procrastination and emotional intelligence quizzes.
 *
 * Positional against scripts/add-quizzes-2.ts; counts are asserted before any
 * write. The two score_based quizzes use the frequency scale, the EI quiz the
 * agreement scale.
 *
 * Usage:
 *   node --experimental-strip-types scripts/i18n-quizzes-2.ts [--apply]
 */

import { runQuizI18n, type QuizEn, type QuizQuestionEn } from "./_i18n-lib.ts";

const S = "https://www.al-maarefah.com";

const FREQ = ["Does not apply to me at all", "Sometimes", "Often", "Almost always"];
const AGREE = [
  "Does not apply to me at all",
  "Applies to me slightly",
  "Applies to me somewhat",
  "Applies to me a lot",
  "Applies to me completely",
];

const f = (text: string): QuizQuestionEn => ({ text, answers: FREQ });
const a = (text: string): QuizQuestionEn => ({ text, answers: AGREE });

const EN: Record<string, QuizEn> = {
  "مقياس-الاحتراق-الوظيفي": {
    title: "Burnout Scale: The Three Symptoms, Not Tiredness Alone",
    description:
      "Fifteen questions across the three dimensions of burnout: energy depletion, mental distance, and a reduced sense of efficacy. With what the evidence says about its cause and what helps.",
    seoTitle: "Burnout scale - professional exhaustion test - burnout",
    seoDescription:
      "Measure your level of burnout across its three dimensions. The World Health Organization classifies it as an occupational phenomenon rather than a medical condition, and the evidence says the fix lies in conditions more than in the person.",
    longDescription: `# What does this test measure?

The word "burned out" gets used for any kind of tiredness at work, but the term has a specific meaning in research. The World Health Organization entered it in the International Classification of Diseases, ICD-11, as an **occupational phenomenon** resulting from chronic workplace stress that has not been successfully managed — and stated explicitly that it is **not a medical condition**, and that it describes work-related phenomena exclusively.

Burnout has **three dimensions, not one**, and this is the most overlooked point:

* **Energy depletion** — exhaustion that short rest does not repair.
* **Mental distance** — withdrawing emotionally from the work and the people in it: sarcasm, distance, the people you serve becoming cases rather than persons. This is the most distinctive symptom, and the least likely to be noticed in yourself.
* **Reduced sense of efficacy** — a feeling that you are no longer performing well and are making no difference.

So the test asks about all three, not about tiredness alone.

# How to answer

Answer for how things have been over the **last four weeks** of your work specifically — not your life as a whole, and not the worst period you have been through. If you are on leave now, answer for how it was before.

# The cause usually isn't you

This deserves saying before you see your result. The dominant model in this research — the **job demands–resources** model — holds that burnout arises from an imbalance between what is asked of you and what is available to you: how much control you have over how you work, support, clarity of role, recognition, and fairness in distribution. Which means hard work with high control and good support may burn nobody out, while fewer hours with no control and no recognition may burn someone out quickly.

A meta-analysis of controlled trials reviewed what actually reduces burnout, comparing individual-directed interventions — mindfulness and stress-management training — with **organisational** interventions that change the work itself. Both produce improvement, and **the organisational ones have the larger effect**. Putting the whole burden of fixing a structural problem onto you is part of the problem.

# The limits of this test

* **It is not a validated instrument and not a diagnosis.** The measure used in research has published forms and reference samples; this is a short test giving an indication worth attending to, not a verdict.
* **It does not distinguish burnout from depression.** Burnout is tied to the work context and usually eases as that context changes; depression extends across life as a whole. The symptoms partly overlap, and the distinction is not one to make yourself.

# Read more

For early signs, the difference between stress, burnout and depression, and what you can practically ask for, see: [Burnout: three symptoms, and one cause that usually isn't you](${S}/articles/%D8%A7%D9%84%D8%A7%D8%AD%D8%AA%D8%B1%D8%A7%D9%82-%D8%A7%D9%84%D9%88%D8%B8%D9%8A%D9%81%D9%8A-%D8%A7%D8%B9%D8%B1%D8%A7%D8%B6%D9%87-%D9%88%D9%83%D9%8A%D9%81-%D8%AA%D8%AA%D8%B9%D8%A7%D9%85%D9%84-%D9%85%D8%B9%D9%87)`,
    questions: [
      f("I feel my energy is drained by the end of the working day."),
      f("I wake up tired even after enough hours of sleep."),
      f("Just thinking about the next working day tires me."),
      f("The weekend does not restore my energy."),
      f("I feel physical strain — head, stomach or muscles — connected to work."),

      f("I have lost interest in work I genuinely used to care about."),
      f("I have become more sarcastic or cynical about my work and the people in it."),
      f("I deal with the people I serve — customers, patients or students — mechanically."),
      f("My patience with colleagues is less than it was."),
      f("I do the minimum required and no more."),

      f("I feel I am no longer doing my job well."),
      f("I doubt my effort at work has any effect."),
      f("I find it hard to concentrate on tasks that used to be easy for me."),
      f("I cut what restores my energy — exercise, seeing people — from my schedule before any work commitment."),
      f("I answer work messages during my time off and find that normal."),
    ],
    results: {
      none: {
        title: "No Notable Indicators (0 – 11) 🟢",
        description: `Your answers showed no indicators of burnout in this period. You meet work pressure like everybody else, you recover afterwards, and no cumulative effect has started.

This balance is rarely an accident. Something concrete usually stands behind it in your situation: how much control you have over how you work, support from a manager and colleagues, clarity in your role, or real boundaries between work and after it. The useful thing is knowing **which of these is protecting you specifically**, because what you cannot name you cannot protect when your circumstances change.

What most often costs people this balance is not a crisis but a gradual creep: an extra task accepted, then an hour of sleep given up, then a night-time notification becoming normal. The accumulation is not noticed for weeks.

So write in two lines what is keeping your energy steady now, and make it a benchmark to return to if you are offered a new role or your manager changes. And watch one early indicator — your sleep quality, or your willingness to withdraw from social plans — because it gives warning well before exhaustion does.

**This is a snapshot of this month, not a fixed description of you**, and this test is not a diagnostic instrument.`,
      },
      early: {
        title: "Early Indicators (12 – 22) 🟡",
        description: `Your answers point to the beginnings of burnout: there is real pressure, some symptoms have appeared, but you still recover after rest.

This is the stage where intervention is easy and noticing is hard — because each symptom looks ordinary on its own: slightly later sleep, patience running out faster than usual, a work notification answered at night. None of them seems enough to call for a change, and together they are.

What helps in practice, ordered by return:

* **Identify the single source.** Ask about last week: which commitment did you come out of more drained than any other? The answer is usually clear and uncomfortable.
* **Recover the hour of sleep before anything else** — the most energy returned for the least effort.
* **Decline one unnecessary commitment.** Not a radical fix, but declining once makes the next time easier.
* **Disconnect properly.** One notification at night cancels out an entire evening.

Note that five of this test's questions are about **mental distance** rather than tiredness. If that is where your score came from specifically — the sarcasm, the mechanical handling of people — it is more telling than the exhaustion, and deserves attention before it deepens.`,
      },
      moderate: {
        title: "Moderate Burnout (23 – 33) 🟠",
        description: `Your answers point to burnout at a moderate level: the symptoms are no longer temporary, short rest no longer suffices, and there is likely an effect on how you deal with people at work and on your sense of your own competence.

At this level small advice is not enough — and the problem is usually not your time management but the balance of demands and resources. So ask yourself about resources rather than hours: do you control how you work? do you have real support? is your role clear? is the distribution fair? does what you do align with what you consider important? That last question — **a mismatch in values** — is among the most powerful factors and the least noticed.

What actually helps:

* **Ask for a specific change, not general support.** "I'm exhausted" produces no decision; "I need this project pushed three weeks" produces one. Put it to someone with the authority.
* **Target control before hours.** If reducing is not available, look at the order of tasks, fewer meetings, and hours that do not get interrupted.
* **Don't wait for a holiday to resolve it.** You will improve, and things will revert in two weeks if nothing changes. Use it to decide what you will ask for.

**And if loss of interest extends to what you used to enjoy outside work**, or sleep disturbance persists, these may be symptoms of depression rather than burnout — and that distinction is not one to make yourself. Seek assessment from a professional.`,
      },
      high: {
        title: "High Burnout (34 – 45) 🔴",
        description: `Your answers came out at a high level across all three dimensions: exhaustion that rest does not repair, visible mental distance, and a diminished sense of efficacy. This warrants serious handling now, not after the current stretch of work ends.

We say this plainly: **the problem at this level is not your capacity to endure.** The evidence indicates that what helps most is a change in the work itself — its volume, the control you have over it, or how it is distributed — rather than more individual effort. Individual stress-management programmes produce short-term improvement that fades if the conditions stay as they are.

What actually helps:

* **Write down specifically what can be dropped, postponed or delegated over two weeks**, and talk to whoever has influence over your load — not to someone who only listens.
* **Give sleep priority over everything else.** It is the first thing sacrificed and the fastest thing to deepen the problem.
* **Tell one person you trust what you are going through.** Mental distance pushes toward isolation, and isolation deepens it.

**And seek assessment from a mental health professional.** This test diagnoses nothing, and a score at this level is reason enough for a professional opinion — particularly alongside persistent sleep disturbance, loss of interest extending beyond work, or a sense of hopelessness or futility.

If thoughts of harming yourself arise, seek urgent help immediately from a professional or an emergency service in your country. That is not something to postpone.`,
      },
    },
  },

  "مستوى-التسويف-لديك": {
    title: "How Much Do You Procrastinate? And What Is Behind It?",
    description:
      "Twelve questions measuring how much you put tasks off, and a result explaining why — because procrastination is not a time-management problem but an escape from a feeling, and each cause has a different remedy.",
    seoTitle: "Procrastination test - level of delay - how to stop procrastinating",
    seoDescription:
      "Procrastination test: find your level of task delay and the reason behind it. Built on what the most comprehensive meta-analysis in the field found — that procrastination is mood regulation, not poor time management.",
    longDescription: `# What does this test measure?

The usual advice for procrastination is tools: task lists, time blocking, a new app. Anyone who has tried them knows they work for a week and are then abandoned — because the diagnosis is wrong.

The most comprehensive meta-analysis in the field, pooling hundreds of studies, found results revealing for what they ruled out: procrastination is **unrelated to intelligence**, almost entirely; it is **weakly related** to knowledge of time-management skills; and it is **strongly related** to impulsiveness, to low confidence in one's ability to complete the task, and to aversion to the task itself.

The clearest formulation of what happens: procrastination is **prioritising short-term mood repair**. You approach the task and it generates a negative feeling — anxiety, boredom, or confusion because it is not well defined — so you turn away, and the feeling disappears immediately. That relief is a reward, and a reward reinforces the behaviour that produced it.

So this test does not measure the amount of delay alone; it asks about the **cause** — because each cause has a different remedy.

# How to answer

Answer for your usual behaviour over recent months, at work, in study or in your personal tasks. Do not count a single week of exceptional pressure.

# What the evidence says about "performing under pressure"

There is a common belief that leaving things to the last minute produces better work. A study followed students across a full semester to test this, and found procrastinators reported **less** stress at the start and **more** stress and physical symptoms by the end, and submitted work that received **lower** grades. The relief is real — but borrowed.

# The limits of this test

It is not a validated instrument and not a diagnosis, but an indicator to help you name what is happening. And if the delay is chronic and spans areas of your life, accompanied since childhood by persistent difficulty starting tasks, organising them and estimating time, it may relate to a condition warranting professional assessment such as attention deficit hyperactivity disorder — a possibility worth examining rather than treating with more self-blame.

# Read more

For the equation explaining exactly when you put things off, and five causes each with a different remedy, see: [Procrastination is not a time-management problem](${S}/articles/%D8%A7%D9%84%D8%AA%D8%B3%D9%88%D9%8A%D9%81-%D9%84%D9%85%D8%A7%D8%B0%D8%A7-%D9%86%D8%A4%D8%AC%D9%84-%D9%88%D9%83%D9%8A%D9%81-%D9%86%D8%AA%D9%88%D9%82%D9%81)`,
    questions: [
      f("I put important tasks off until close to their deadline."),
      f("I do less important tasks to avoid the one I should be starting."),
      f("I tell myself I will start when I am in the right mood."),
      f("I open my phone or another tab the moment I go to begin."),
      f("I feel relief immediately when I decide to postpone a task."),
      f("I do not know where to start, so I postpone starting altogether."),
      f("I delay because I fear the result will be less than what is expected of me."),
      f("I wait for conditions to be right or more information to arrive before starting."),
      f("I blame myself after delaying, then delay again next time as well."),
      f("I put off things concerning my health — a doctor's appointment, exercise, a check-up."),
      f("I submit work I know is below what I can do because time ran out."),
      f("I make detailed plans and then do not follow them."),
    ],
    results: {
      low: {
        title: "Low Procrastination (0 – 8) 🟢",
        description: `Your answers indicate you usually start what you intend to do on time. You postpone sometimes — everybody does — but delay is not a pattern for you.

It is useful to know what protects you, because it is usually structure rather than willpower. Someone who starts on time generally has one of these: an external deadline they are accountable for, a fixed routine that does not require a decision each time, or a way of breaking work into clear steps. Knowing which one works for you helps when your circumstances change.

What deserves your attention is the other end: someone who does not postpone may start things that are not worth starting. Delay is sometimes information rather than a fault — a signal that the task holds no value for you, or is not yours, or matters less than assumed. So ask before completing: should this have been done at all?

Watch the opposite direction too: starting immediately on everything that arrives makes your schedule the property of whoever asks rather than of what matters. A deliberate twenty-four hour delay before accepting a new commitment is not procrastination; it is judgement.`,
      },
      mild: {
        title: "Mild Procrastination (9 – 17) 🟡",
        description: `Your answers indicate delay that happens regularly without disabling you: you finish in the end, at a cost in stress more than in the result.

What helps here is identifying **which cause** sits behind your delay, since it is not one problem:

* **Task aversion** (dull, repetitive) → cut it into short time-boxed sessions, or tie it to something enjoyable.
* **Ambiguity** (I don't know where to start) → the first task is not the work but the clarification: write the first three steps.
* **Fear of judgement** → lower the standard for the first draft explicitly.
* **Distraction and impulsiveness** → treat the environment, not the willpower: physically move the phone away.

The single most effective and cheapest intervention: **shrink the first step until it is silly** — not "write the report" but "open the file and write one sentence". The point is not the output but getting past the moment of starting, which is where the resistance sits. What usually happens after the first sentence is that continuing becomes easier than stopping.

Add to it **specifying exactly when and where**: "If it is nine o'clock and I am at my desk, I will open the file." That formula has strong research support for turning intention into behaviour, because it moves the decision out of the moment of weakness and into the moment of planning.`,
      },
      moderate: {
        title: "Moderate Procrastination (18 – 26) 🟠",
        description: `Your answers indicate delay that genuinely affects your results: you submit work below what you can do, or pay a cost in stress near deadlines, or the loop extends to matters concerning your health.

At this level the **loop** itself deserves attention, because it is what sustains the problem: you delay, the bad feeling disappears immediately, you blame yourself, the feeling attached to the task gets worse, and escaping it becomes more likely next time. Which is why self-flagellation is not a solution — it is fuel for the loop.

That means treating yourself decently here is not indulgence; it breaks the reinforcement mechanism, and this is what the evidence points to.

What helps in practice, in order:

* **Separate clarification from execution.** Set aside one session in which you do nothing but break tasks into concrete steps. Ambiguity is a negative feeling escaped the same way difficulty is.
* **Create real intermediate deadlines** — ones another person sees. The distance of the deadline is what lowers your desire, and shortening it raises it.
* **Start with the part you are good at**, not the hardest, because confidence in your ability raises the odds of continuing more than enthusiasm does.
* **Write in one line what you are escaping** before you postpone. Naming the feeling lowers its intensity, and sometimes reveals the task is not the problem.`,
      },
      high: {
        title: "High Procrastination (27 – 36) 🔴",
        description: `Your answers came out at a high level: delay is an extended pattern, it affects your results and your state of mind, and it likely extends to important matters concerning your health or your future.

The first thing worth saying: this is **not laziness**, and not evidence of lacking ability. The evidence is clear that procrastination is unrelated to intelligence, and strongly related to impulsiveness, to fear of failure and to low confidence in one's ability to complete things. Many chronic procrastinators work very hard — on tasks other than the one being put off.

At this level, tools alone will not be enough, and starting from the heaviest thing will fail. So start from the smallest possible:

* **One two-minute step**, every day, on the most-postponed task. The goal is not progress but breaking the pairing between the task and the bad feeling.
* **One person who asks you about progress** weekly. External accountability is among the strongest things that work when self-regulation is low.
* **Stop the self-blame explicitly.** It is the single thing that most deepens the loop, and it produces no starting.

**And there is a possibility worth examining.** If the delay is chronic and spans areas of your life, accompanied since childhood by persistent difficulty starting tasks, organising them and estimating time, it may relate to a condition warranting professional assessment — such as attention deficit hyperactivity disorder. This is not a diagnosis to take from a test, but it is a possibility worth having examined rather than treating with more trying and failing.

And if the delay comes with a persistent sense of hopelessness or a general loss of interest, that is an independent reason to seek a psychological assessment.`,
      },
    },
  },

  "اختبار-الذكاء-العاطفي": {
    title: "Emotional Intelligence Test: Which of the Four Skills Is Strongest?",
    description:
      "Sixteen questions across the four branches in the original definition of emotional intelligence — perceiving, using, understanding and regulating — instead of a single number with no measurement meaning.",
    seoTitle: "Emotional intelligence test - EQ - emotional skills",
    seoDescription:
      "Emotional intelligence test across the four branches: perceiving emotion, using it, understanding it and regulating it. With a frank explanation of what a self-report actually measures — your view of your skills, not your skills.",
    longDescription: `# What does this test measure?

The term "emotional intelligence" appeared in its academic form in 1990 with a narrow, specific definition: the ability to **perceive** emotions, **use** them in thinking, **understand** them, and **regulate** them. Popular treatments then widened it until it included motivation, optimism and people skills — and that widening is the source of most of the confusion, because it mixed an ability with personality traits.

This test returns to the four original branches, and tells you **which is strongest in how you describe yourself**:

* **Perceiving emotion** — noticing what you feel and what others feel, distinguishing anger from fear from exhaustion rather than "not okay".
* **Using emotion** — putting your state to work rather than fighting it, choosing the task that fits the current mood.
* **Understanding emotion** — knowing where a feeling came from and where it is going: that irritation is often disguised fear, that intensity fades with time without intervention.
* **Regulating emotion** — acting by choice rather than impulse, in yourself and with others.

These are four distinct skills, not one quantity. Someone can be excellent at reading others and poor at regulating themselves — this is common, and vanishes entirely into a number called an "emotional quotient".

# What this test actually measures — frankly

This is a **self-report**, as nearly every free emotional intelligence test is. Which means one thing directly: **it measures your opinion of your skills, not your skills.**

Real ability tests work quite differently: they show you a face and ask what emotion it displays, or a situation and ask the most effective response, and score by the consensus of a large sample or by expert judgement. The two kinds do not correlate strongly with each other — a serious problem for a concept supposed to be one thing.

Your view of yourself is not worthless information, since it influences your behaviour. But it is not what it appears to be. And it is a known irony that someone lacking a skill is usually less able to notice they lack it.

# And the famous figure?

It is often repeated that emotional intelligence accounts for 80% of success. **That figure has no basis in any published study.** What the meta-analyses found is less exciting: ability tests showed a weak relationship with job performance, and self-report questionnaires showed a stronger one, much of which disappears once personality traits and cognitive ability are controlled. The effect is stronger in work whose core is dealing with people, and weak or absent elsewhere.

Weak evidence for the **tests** does not mean weak evidence for **training** the specific skills: naming an emotion, reappraisal, and listening are all learnable.

# Read more

For the field's evidence, and the critique that holds the concept itself invalid, see: [Emotional intelligence: what the research supports](${S}/articles/%D8%A7%D9%84%D8%B0%D9%83%D8%A7%D8%A1-%D8%A7%D9%84%D8%B9%D8%A7%D8%B7%D9%81%D9%8A-%D9%85%D8%A7-%D9%8A%D8%AB%D8%A8%D8%AA%D9%87-%D8%A7%D9%84%D8%A8%D8%AD%D8%AB)`,
    questions: [
      a("I can name what I feel with a specific word rather than a general description."),
      a("I notice a change in the mood of the person in front of me before they say it."),
      a("I pay attention to the physical signs of my own emotion — tension in the shoulders or stomach."),
      a("I distinguish anger from fear from exhaustion when they feel similar to me."),

      a("I choose which task to work on according to my mood."),
      a("I make use of a low mood for work that needs close checking."),
      a("I use my enthusiasm when it arrives for what needs energy."),
      a("I postpone important decisions until my state has settled."),

      a("I usually know what triggered my feeling, not merely that I feel it."),
      a("I recognise that my irritation at one situation may be caused by an earlier one."),
      a("I anticipate how someone will react before I say something sensitive to them."),
      a("I know the intensity of a feeling will fade with time even if it is strong now."),

      a("I can postpone my response until I have calmed down rather than replying at once."),
      a("I change my interpretation of a situation rather than suppressing what I feel."),
      a("I stay in a difficult conversation without withdrawing or escalating."),
      a("I help someone who is upset to settle without becoming upset myself."),
    ],
    results: {
      perceive: {
        title: "Strongest Skill: Perceiving Emotion 👁️",
        description: `**Perceiving emotion** came out strongest of the four branches in how you describe yourself: you notice what you feel and what those around you feel, you distinguish similar emotions, and you pick up physical signals before they become obvious.

This branch is the foundation of the other three, because what you do not notice you cannot understand or regulate. Its practical value is that you catch that something is not right — in yourself, in a relationship, in a team — before it is announced.

The cost is that more input reaches you than reaches others, which means what does not concern you reaches you too. That includes a tendency to read silence or a short reply as a personal stance, when in most cases it is preoccupation.

What is worth developing for you is the opposite branch: **regulation**. Fine-grained noticing without the ability to act by choice means you feel everything and have nothing to do with it. The cheapest skill here: name the feeling in one word before you respond — naming alone lowers its intensity.

**And remember this is a self-report:** the result says perceiving is your strongest branch in **your own view of yourself**, not that you are high on it compared with other people. The useful test here is a different one: ask two people who know you and feel safe being honest.`,
      },
      use: {
        title: "Strongest Skill: Using Emotion 🔧",
        description: `**Using emotion** came out strongest in how you describe yourself: you put your state to work rather than fighting it, choosing work that suits the current mood and postponing what does not.

This is the least famous branch and the most practical. Most people wait for the mood that suits the task; you choose the task that suits the mood — and the difference in output is large. It is consistent with what is observed in research: a low mood is associated with closer attention to detail, a high one with generating more ideas. Every state is good for something.

The likely cost is that flexibility in choosing can turn into disguised delay: "I'm not in the mood for this task" becomes an excuse if there is no deadline governing it. And the right mood does not usually arrive before starting — it arrives after.

What is worth developing for you is **understanding emotion**: knowing where the state came from rather than treating it as a given. Someone who knows their low mood is caused by lack of sleep rather than failure at work behaves entirely differently.

**This is a self-report** measuring your opinion of your skills: the result says this branch is your strongest, not that you are high on it compared with others.`,
      },
      understand: {
        title: "Strongest Skill: Understanding Emotion 🧩",
        description: `**Understanding emotion** came out strongest in how you describe yourself: you know where a feeling came from and where it is going, you recognise that irritation at one situation may be caused by an earlier one, and you anticipate how someone will react before saying something sensitive.

This is the most complex of the four branches, because it requires a model of how emotions work rather than merely a sense of them. It shows up in your not taking a feeling at face value: you know irritation is often disguised fear, that sudden sadness may be accumulation rather than an incident, and that the intensity of any feeling will fade with time without intervention — that last piece of knowledge alone prevents a great many bad decisions.

The cost is that understanding can become a substitute for acting: analysing a situation precisely and then doing nothing, or explaining to an upset person the source of their upset at a moment when they do not want analysis. So ask first: do you want a view, or do you want to be heard?

What is worth developing for you is **perceiving** in the moment: understanding works after the event, noticing works during it.

**And this is a self-report** — it measures your estimate of your skills, not the skills themselves. One irony is that confidence in a skill usually rises faster than the skill.`,
      },
      manage: {
        title: "Strongest Skill: Regulating Emotion 🎚️",
        description: `**Regulating emotion** came out strongest in how you describe yourself: you can postpone a response until you have calmed down, stay in a difficult conversation without withdrawing or escalating, and help an upset person settle without becoming upset yourself.

This is the branch people are measured on in practice, because it is the only one visible to others. The distance between feeling and action is its core — not feeling less, but choosing what you do with what you feel.

It is worth knowing you are probably using the more effective method: your answers point to **reappraisal** — changing your interpretation of the situation — rather than suppression. The difference is well established in research: suppression consumes cognitive effort and does not reduce the feeling, while reappraisal genuinely reduces it.

The cost that deserves your attention is that the ability to settle becomes a problem when it is used to avoid. Someone who absorbs everything may postpone saying what bothers them until it accumulates, or become the person who holds everyone and is held by nobody. The question that separates them: after the situation settles, was its cause addressed or did it merely pass?

What is worth developing for you is **perceiving**: noticing your emotion precisely rather than only controlling it — because control without noticing can be suppression that looks like calm.

**And this is a self-report** measuring your opinion of your skills, not your skills.`,
      },
    },
  },
};

runQuizI18n(EN, "quizzes batch 2 (en)");
