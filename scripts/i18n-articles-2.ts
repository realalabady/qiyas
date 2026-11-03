/**
 * English for the second three November 2026 articles.
 *
 * Hand-written — see _i18n-lib.ts for why these are not machine-translated.
 *
 * Usage:
 *   node --experimental-strip-types scripts/i18n-articles-2.ts [--apply]
 */

import { runArticleI18n, type ArticleEn } from "./_i18n-lib.ts";

const S = "https://www.al-maarefah.com";

const EN: Record<string, ArticleEn> = {
  "الذكاء-العاطفي-ما-يثبته-البحث": {
    title: "Emotional Intelligence: What the Research Supports, and What It Doesn't",
    excerpt:
      "Emotional intelligence has been said to account for 80% of success. The figure has no source. What the meta-analyses actually found, and why researchers disagree about the concept itself.",
    faq: [
      {
        question: "Is emotional intelligence more important than cognitive ability for success?",
        answer:
          "No, on the available evidence. Meta-analyses find that cognitive ability and conscientiousness predict job performance more strongly than emotional intelligence does. The claim that it accounts for 80% of success has no basis in any published study.",
      },
      {
        question: "What is the difference between ability and self-report tests of emotional intelligence?",
        answer:
          "An ability test such as the MSCEIT poses problems that have better and worse answers, so it measures a skill. A self-report asks your opinion of your own skills, and it predicts performance more strongly — but because it is largely measuring personality traits rather than an emotional skill.",
      },
      {
        question: "Can emotional intelligence be developed?",
        answer:
          "The specific skills grouped under the heading — naming an emotion, regulating it, listening — are trainable, and training programmes show moderate improvement. Raising an \"emotional quotient\" as a single quantity is not an idea with a clear measurement meaning.",
      },
    ],
    content: `"Emotional intelligence" has become one of the most present terms in how we talk about work and relationships. A figure travels with it: that it accounts for 80% of success, while cognitive ability accounts for only 20%.

That figure has no source in any published study. This article is about the distance between what the research said and what reached the public.

# The concept as first proposed

The term appeared in its academic form in a paper by [Salovey and Mayer (1990)](https://journals.sagepub.com/doi/10.2190/DUGG-P24E-52WK-6CDG), who defined it narrowly and specifically: the ability to **perceive** emotions, **understand** them, **use** them in thinking, and **regulate** them.

Note that this is a definition of an **ability** — something you can be better or worse at, measured by problems with more and less correct answers, like an intelligence test.

Then **Daniel Goleman**'s 1995 book carried the term to a wide audience, and widened it on the way: it came to include motivation, persistence, empathy, people skills and optimism. That widening is the source of most of the confusion that followed, because it mixed an ability with personality traits.

# Two different measures carrying the same name

Having two definitions produced two entirely different kinds of instrument, and this is the heart of the matter.

**Ability tests.** The best known is the **MSCEIT**, which works like a cognitive test: you are shown a face and asked what emotion it displays, or a situation and asked the most effective way to handle it. Scoring relies on the consensus of a large sample or on expert judgement.

**Self-report questionnaires.** These ask you about yourself: "I understand other people's feelings easily" — agree or disagree. This is the far more common form, and it is essentially all you find in free online tests.

The two do not correlate strongly with each other. Someone scoring high on one does not necessarily score high on the other — a serious problem for a concept supposed to be one thing.

# What did the meta-analyses find?

Here the picture gets clearer, and less exciting than advertised.

[Joseph and Newman (2010)](https://psycnet.apa.org/record/2010-00343-004) pooled the available studies in a meta-analysis examining the relationship between emotional intelligence and job performance. The result came in two halves:

* **Ability** tests showed a weak relationship with performance, and a very weak one after controlling for cognitive ability and personality traits.
* **Self-report** questionnaires showed a stronger relationship — but the same analysis found that much of it disappears once the Big Five and cognitive ability are controlled. That is, they are largely measuring what existing instruments already measured.

[O'Boyle and colleagues (2011)](https://onlinelibrary.wiley.com/doi/10.1002/job.714), in another meta-analysis, found a small amount of predictive value over and above personality and intelligence — present, but small.

Another important result in Joseph and Newman: the effect depends on the job. The relationship is stronger in work requiring **emotional labour** — customer service, nursing, teaching, sales — and weak or absent in technical work whose core is not dealing with people. That is sensible, and a long way from "80% of success".

# The radical critique

Some researchers went further. [Locke (2005)](https://onlinelibrary.wiley.com/doi/10.1002/job.318) published a paper titled "Why emotional intelligence is an invalid concept", arguing that the concept expanded until it lost its meaning: if it includes motivation, persistence, empathy and communication skills, it is not a kind of intelligence but a basket holding everything desirable in a person. And what describes everything measures nothing.

That is a sound structural critique, even if it does not deny that the specific skills inside the basket are real and measurable individually.

# The four branches, and what each means in practice

The original definition deserves unpacking, because it is the part carrying actionable content. [Mayer, Salovey and Caruso (2008)](https://doi.org/10.1037/0003-066X.63.6.503) returned to specifying it as four branches, ordered simplest to most complex:

**Perceiving emotion.** Noticing what you feel and what others feel. Less obvious than it sounds: many people notice that they are "not okay" without distinguishing anger from fear from exhaustion — and the three call for different responses.

**Using emotion in thinking.** Putting your state to work instead of fighting it. A low mood is associated with closer attention to detail, a high one with generating more ideas — so choosing the task that fits the state beats waiting for a particular state.

**Understanding emotion.** Knowing where a feeling came from and where it is going: that irritation is often disguised fear, that sudden sadness may be accumulation rather than an incident, that intensity fades with time without intervention.

**Regulating emotion.** Acting by choice rather than impulse, in yourself and with others.

Note that these are four distinct skills, not one quantity. Someone can be excellent at reading others and poor at regulating themselves — this is common, and vanishes entirely into a single number called an "emotional quotient".

# So why has the term stayed popular?

A fair question: if the evidence is this guarded, what explains the reach?

Because the term solves a real problem in language. Before it, there was no single word covering "someone good at handling people and controlling themselves", and workplaces needed one. It filled a lexical gap, and that alone is enough for popularity.

And because it is sellable. A relatively fixed personality trait cannot be trained into people in a two-day workshop; a "skill" can. [Locke (2005)](https://onlinelibrary.wiley.com/doi/10.1002/job.318) noted this dimension explicitly in his critique.

A practical distinction is needed here: weak evidence for emotional intelligence **tests** as a hiring instrument does not mean weak evidence for **training** specific emotional skills. The first tries to measure an ill-defined quantity; the second targets a particular behaviour — a large difference.

# What remains true and useful

Setting aside the large heading and looking at the components, some things are well established:

**Naming an emotion lowers its intensity.** One of the most repeated findings in emotion regulation research, and the cheapest intervention available: saying "I'm annoyed because…" instead of acting out of the annoyance.

**Reappraisal beats suppression.** Changing your interpretation of a situation is more useful than hiding what you feel. [Gross (1998)](https://psycnet.apa.org/record/1998-10886-003) established this distinction in his framework for emotion regulation, and it has recurred since: suppression consumes cognitive effort and does not reduce the feeling.

**Listening is a learnable behavioural skill.** It does not require a special ability, but specific habits: not interrupting, asking before advising, paraphrasing back to check.

The practical difference between this and "developing your emotional intelligence" is the difference between a goal you can act on and one where you never know when you have arrived.

# How to read an emotional intelligence test online

Nearly all of them are self-report. Which means one thing directly: **they measure your opinion of your skills, not your skills.**

That is not worthless information — your self-estimate does influence your behaviour. But it is not what it appears to be. And it is a known irony that someone lacking a skill is usually less able to notice they lack it, which holds for emotional skills as much as any other.

The useful test here is a different one, and needs no questionnaire: ask two people who know you closely and feel safe being honest. "When did you feel I wasn't hearing you?" gets you information no scale will.

For emotion regulation in one specific situation, see: [How to handle anger](${S}/articles/%D9%83%D9%8A%D9%81-%D8%AA%D8%AA%D8%B9%D8%A7%D9%85%D9%84-%D9%85%D8%B9-%D8%A7%D9%84%D8%BA%D8%B6%D8%A8)

⸻

# Sources

* Salovey, P., & Mayer, J. D. (1990). [Emotional intelligence](https://journals.sagepub.com/doi/10.2190/DUGG-P24E-52WK-6CDG). *Imagination, Cognition and Personality*, 9(3), 185–211.
* Joseph, D. L., & Newman, D. A. (2010). [Emotional intelligence: An integrative meta-analysis and cascading model](https://psycnet.apa.org/record/2010-00343-004). *Journal of Applied Psychology*, 95(1), 54–78.
* O'Boyle, E. H., et al. (2011). [The relation between emotional intelligence and job performance: A meta-analysis](https://onlinelibrary.wiley.com/doi/10.1002/job.714). *Journal of Organizational Behavior*, 32(5), 788–818.
* Locke, E. A. (2005). [Why emotional intelligence is an invalid concept](https://onlinelibrary.wiley.com/doi/10.1002/job.318). *Journal of Organizational Behavior*, 26(4), 425–431.
* Gross, J. J. (1998). [The emerging field of emotion regulation: An integrative review](https://psycnet.apa.org/record/1998-10886-003). *Review of General Psychology*, 2(3), 271–299.
* Van Rooy, D. L., & Viswesvaran, C. (2004). [Emotional intelligence: A meta-analytic investigation of predictive validity and nomological net](https://doi.org/10.1016/S0001-8791%2803%2900076-9). *Journal of Vocational Behavior*, 65(1), 71–95.
* Mayer, J. D., Salovey, P., & Caruso, D. R. (2008). [Emotional intelligence: New ability or eclectic traits?](https://doi.org/10.1037/0003-066X.63.6.503) *American Psychologist*, 63(6), 503–517.`,
  },

  "الاحتراق-الوظيفي-اعراضه-وكيف-تتعامل-معه": {
    title: "Burnout: Three Symptoms, and One Cause That Usually Isn't You",
    excerpt:
      "The WHO classifies burnout as an occupational phenomenon, not a medical condition, and the evidence says what helps is changing the conditions more than changing the person. The three symptoms, and what actually works.",
    faq: [
      {
        question: "Is burnout an illness?",
        answer:
          "No. The World Health Organization classifies it in ICD-11 as an occupational phenomenon under code QD85, and states explicitly that it is not a medical condition. It is described by its work context rather than as a disorder in the person.",
      },
      {
        question: "What is the difference between burnout and depression?",
        answer:
          "Burnout is tied to the work context and usually eases as that context changes, whereas depression extends across all areas of life and comes with a general loss of interest. The distinction is not always clean and some symptoms overlap, so assessment by a professional is advisable where there is doubt.",
      },
      {
        question: "Does a holiday fix burnout?",
        answer:
          "It relieves symptoms temporarily and does not address the cause. Reviews find the effect returns quickly on going back to the same environment with the same load, unless something changes in the amount of work or the control you have over it.",
      },
    ],
    content: `The word "burned out" now gets used for any kind of tiredness at work. But the term has a specific meaning in research, and knowing it helps, because it changes what you should do.

# The definition, and what its classification says

The World Health Organization entered burnout in the International Classification of Diseases, [ICD-11 under code QD85](https://icd.who.int/browse/2024-01/mms/en#129180281), describing it as an **occupational phenomenon** resulting from chronic workplace stress that has not been successfully managed. It states explicitly that burnout is **not a medical condition**, and that the term is used to describe work-related phenomena exclusively — not other areas of life.

That classification is not a procedural detail. It says the problem is described by its circumstances rather than as a disorder in the person — and that relocates where the solution sits.

# The three symptoms

The working definition came out of the work of **Christina Maslach**, who with a colleague developed the first measure of burnout in [Maslach and Jackson (1981)](https://onlinelibrary.wiley.com/doi/10.1002/job.4030020205). It has three dimensions, not one, and this is the most overlooked point:

**Energy depletion.** Exhaustion that short rest does not repair. This is the symptom everyone knows, and on its own it is not enough.

**Mental distance, or cynicism.** Withdrawing emotionally from the work and the people in it: sarcasm, distance, the people you serve becoming cases rather than persons. This is the most distinctive symptom of burnout, and the one you are least likely to notice in yourself.

**Reduced sense of efficacy.** A feeling that you are no longer performing well, that you make no difference, that your effort has no effect.

[Maslach, Schaufeli and Leiter (2001)](https://www.annualreviews.org/doi/10.1146/annurev.psych.52.1.397) reviewed decades of this research in a reference review, concluding that the three dimensions usually develop in that order: depletion starts, distance arrives as a way of coping with it, and reduced efficacy follows both.

# The cause: not simply too much work

Burnout is most often assumed to be the result of long hours. The evidence says hours are one factor among several, and not the strongest.

[Demerouti and colleagues (2001)](https://psycnet.apa.org/record/2001-16970-012) proposed the **job demands–resources** model, which became the dominant framework: burnout arises from an imbalance between what is asked of you and what is available to you. Demands include workload, time pressure and emotional load; resources include how much control you have over how you work, support from your manager and colleagues, clarity of role, recognition, and fairness in how things are distributed.

In practice this means hard work with high control and good support may burn nobody out, while fewer hours with no control and no recognition may burn someone out quickly. Maslach and colleagues identified six areas of mismatch between a person and their job: workload, control, reward, community, fairness, and values — and that **a mismatch in values** is among the most powerful and the least noticed.

# Burnout, stress and depression are three different things

The three get used interchangeably, and the differences are practical rather than verbal.

**Stress** is a response to a present demand. It is normal, temporary, and ends when its cause does. It can be useful: it raises attention and prompts preparation.

**Burnout** is the result of chronic unresolved stress, and its distinguishing mark is not tiredness but **distance** — losing interest in work you used to care about. It stays tied to the work context: someone burned out at work usually recovers their energy in the other areas of their life.

**Depression** extends across life as a whole: it includes loss of interest in what used to be enjoyable outside work too, usually comes with disturbed sleep and appetite, and may bring a sense of worthlessness or hopelessness.

The distinction is not always sharp and the symptoms partly overlap, which is why ambiguous cases are not a matter for personal judgement.

It helps to know burnout has an opposite described in the research: **work engagement**, measured by [Schaufeli and colleagues (2002)](https://doi.org/10.1023/A:1015630930326) on three dimensions mirroring burnout's — vigour, dedication and absorption. The use of that framing is that the goal becomes clearer: not merely "not to burn out", but to recover something you used to have.

# Early signs that are easy to dismiss

The three symptoms show up late. What usually precedes them gets explained away:

* **Boundaries eroding quietly.** Answering work messages at night becomes normal, then becomes expected.
* **Flattening with people.** Noticing your patience with customers or patients or students is less than it was — then noticing you had not noticed.
* **What restores energy gets cut first.** Exercise, seeing people, the doctor — these leave the calendar before any work commitment does.
* **New internal dialogue.** "What's the point?", "nobody will notice the difference" — this is the beginning of reduced efficacy.
* **Sunday feels different.** Dread of the week starting before the week starts.

# What actually works

Here comes the finding that deserves stating plainly, because it runs against most of what is published on the subject.

[Panagioti and colleagues (2017)](https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2588814) reviewed controlled trials of what reduces burnout in physicians in a meta-analysis, comparing **individual-directed** interventions — mindfulness training, stress management, coping skills — with **organisational** interventions that change the work itself, such as reducing shift hours or redistributing tasks. The result was that both produce improvement, and that **the organisational interventions have the larger effect**.

A review by [Awa and colleagues (2010)](https://doi.org/10.1016/j.pec.2009.04.008) reached a consistent conclusion: individual-directed programmes produce short-term improvement that fades, and programmes combining individual with organisational change are the ones whose effect lasts.

This has a direct consequence: if you are burned out, advice about meditation and enough sleep is correct but insufficient, and putting the whole burden of fixing a structural problem onto you is part of the problem.

# What you can do

Not everything is out of your hands, though. The following is ordered by what the evidence supports:

**Ask for a specific change, not general support.** "I'm exhausted" produces no change; "I need this project dropped or pushed three weeks" produces a decision. Identify one actionable request and put it to someone with the authority.

**Target control before hours.** If reducing the work is not available, look at what you can control: the order of tasks, fewer meetings, hours that do not get interrupted. Control is among the strongest resources in the model.

**Disconnect properly.** Boundaries that are not enforced do not work. One work notification at night cancels out an entire evening.

**Don't wait for a holiday to resolve it.** You will feel better, and things will revert within two weeks if nothing at work has changed. Use it to decide what you are going to ask for, not as a substitute for asking.

**And check the warning signs.** If loss of interest extends to what you enjoyed outside work, or sleep disturbance persists, or a sense of hopelessness or futility arrives, these may be symptoms of depression rather than burnout — and that distinction is not one to make yourself. Seek assessment from a mental health professional.

For dealing with depletion before it reaches this point, see: [The importance of good sleep](${S}/articles/%D8%A7%D9%87%D9%85%D9%8A%D8%A9-%D8%A7%D9%84%D9%86%D9%88%D9%85-%D8%A7%D9%84%D8%AC%D9%8A%D8%AF-%D9%88%D8%AA%D8%A7%D8%AB%D9%8A%D8%B1%D9%87-%D8%B9%D9%84%D9%89-%D8%A7%D9%84%D8%B5%D8%AD%D8%A9)

⸻

# Sources

* World Health Organization. [ICD-11: QD85 Burnout](https://icd.who.int/browse/2024-01/mms/en#129180281). *International Classification of Diseases, 11th Revision*.
* Maslach, C., & Jackson, S. E. (1981). [The measurement of experienced burnout](https://onlinelibrary.wiley.com/doi/10.1002/job.4030020205). *Journal of Occupational Behaviour*, 2(2), 99–113.
* Maslach, C., Schaufeli, W. B., & Leiter, M. P. (2001). [Job burnout](https://www.annualreviews.org/doi/10.1146/annurev.psych.52.1.397). *Annual Review of Psychology*, 52, 397–422.
* Demerouti, E., Bakker, A. B., Nachreiner, F., & Schaufeli, W. B. (2001). [The job demands-resources model of burnout](https://psycnet.apa.org/record/2001-16970-012). *Journal of Applied Psychology*, 86(3), 499–512.
* Panagioti, M., et al. (2017). [Controlled Interventions to Reduce Burnout in Physicians](https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2588814). *JAMA Internal Medicine*, 177(2), 195–205.
* Awa, W. L., Plaumann, M., & Walter, U. (2010). [Burnout prevention: A review of intervention programs](https://doi.org/10.1016/j.pec.2009.04.008). *Patient Education and Counseling*, 78(2), 184–190.
* Schaufeli, W. B., Salanova, M., González-Romá, V., & Bakker, A. B. (2002). [The measurement of engagement and burnout](https://doi.org/10.1023/A:1015630930326). *Journal of Happiness Studies*, 3, 71–92.`,
  },

  "التسويف-لماذا-نؤجل-وكيف-نتوقف": {
    title: "Procrastination Is Not a Time-Management Problem",
    excerpt:
      "The largest meta-analysis of procrastination found it is unrelated to intelligence, barely related to time management, and strongly related to something else: wanting to escape a bad feeling right now. That changes what works.",
    faq: [
      {
        question: "Is procrastination a sign of laziness?",
        answer:
          "No. A large meta-analysis found procrastination is unrelated to intelligence and strongly related to impulsiveness, low conscientiousness and fear of failure. Many procrastinators work very hard — on tasks other than the one being put off.",
      },
      {
        question: "Does leaving things to the last minute improve performance?",
        answer:
          "No, according to longitudinal studies. One study followed students across a semester and found procrastinators submitted lower-graded work and reported more stress and physical symptoms by the end — the early relief came at the expense of the end.",
      },
      {
        question: "What is the quickest intervention that works against procrastination?",
        answer:
          "Shrinking the first step until it is trivial, and tying it to a specific time and place. The \"exactly when and where will I do this\" formula has strong research support for turning an intention into behaviour.",
      },
    ],
    content: `The usual advice for procrastination is tools: task lists, time blocking, a new app. Anyone who has tried them knows they work for a week and are then abandoned.

The reason is that the diagnosis is wrong. Procrastination is not an inability to organise time — someone who procrastinates usually knows exactly what should be done and when.

# What the research found

The most comprehensive review in the field is a meta-analysis by [Steel (2007)](https://psycnet.apa.org/record/2006-23058-004), which pooled hundreds of studies to establish what procrastination is actually associated with. The results were revealing for what they ruled out:

* **Unrelated to intelligence** — almost entirely.
* **Weakly related** to knowledge of time-management skills.
* **Strongly related** to impulsiveness, to low conscientiousness, to low confidence in one's ability to complete the task, and to aversion to the task itself.

Impulsiveness is the key. It is the tendency to prefer a present reward over a delayed one — an accurate description of the moment of procrastination: the task pays out in a week, the phone pays out now.

# Procrastination as mood regulation

The clearest formulation of this came from [Sirois and Pychyl (2013)](https://compass.onlinelibrary.wiley.com/doi/10.1111/spc3.12011): procrastination is not poor time management but **prioritising short-term mood repair**.

The sequence runs like this. You approach the task, and it generates a negative feeling — anxiety about failing, or boredom, or confusion because it is not well defined, or resistance because it is dull. You turn away from it, and **the negative feeling disappears immediately**. That immediate relief is a reward, and a reward reinforces the behaviour that produced it. So the brain learns: turning away brings relief.

Two things that looked contradictory now make sense. The first is that a procrastinator may work very hard — but on a different task, because what is required is escape from *this* task, not from work. The second is that advice about tools does not help: a tool organises time, and the problem is a feeling.

# An equation for exactly when you put things off

[Steel and König (2006)](https://doi.org/10.5465/amr.2006.22527462) proposed a framework unifying theories of motivation, which they called **temporal motivation theory**, and it is the clearest account of the timing of procrastination. In outline: your desire to do a task now rises with the **value** you place on completing it and your **expectancy** of succeeding, and falls with how **distant** the deadline is and how **impulsive** you are.

This explains several things that look unrelated:

* **Why do we work on the last night?** Because the distance to the deadline became zero, so desire rose suddenly. Neither the task nor your ability changed; only time did.
* **Why is it hard to start a task we doubt we can do?** Because expectancy of success is low, and the equation multiplies by it. Which is why raising confidence with one small successful step moves more than raising enthusiasm does.
* **Why do we procrastinate more on a boring task than a hard one?** Because value is low, not because cost is high.

The use of the equation is that it tells you **which lever to pull**. If the obstacle is expectancy of failure, shrinking the task helps. If it is the distance of the deadline, create real intermediate ones. If it is value, tie the task to something that genuinely matters to you — or admit it does not and drop it.

# When does it become costly?

There is a common belief that last-minute pressure produces better work. [Tice and Baumeister (1997)](https://journals.sagepub.com/doi/10.1111/j.1467-9280.1997.tb00460.x) followed students across a full semester to test this. The result came in two parts: procrastinators reported **less stress early in the semester**, then **more** stress and more physical symptoms by its end, and submitted work that received lower grades.

So the relief is real — but borrowed.

Reviews by [Sirois](https://doi.org/10.1016/j.paid.2006.11.003) link chronic procrastination to worse health outcomes, explained partly by the postponement of health behaviours themselves: the check-up, the treatment, the exercise.

# Five reasons for delay, each with a different remedy

The recurring mistake is treating procrastination as one problem. More precisely, ask: what feeling am I escaping?

* **Task aversion** (dull, repetitive) → tie it to something enjoyable, or cut it into short time-boxed sessions.
* **Ambiguity** (I don't know where to start) → the first task is not the work but the clarification: write the steps.
* **Fear of failure or judgement** → lower the standard for the first draft explicitly.
* **Low confidence in your ability** → start with the part you are good at, not the hardest.
* **Impulsiveness and distraction** → treat the environment, not the willpower: physically move the phone away.

One case deserves mention: if the delay is chronic and spans areas of your life, accompanied since childhood by persistent difficulty starting tasks, organising them and estimating time, it may relate to a condition warranting professional assessment such as attention deficit hyperactivity disorder. This is not a diagnosis to take from an article, but it is a possibility worth examining rather than treating with more self-blame.

# What works, and why

If the cause is escape from a feeling, the solution targets the feeling or the threshold to start — not the schedule.

**Shrink the first step until it is silly.** Not "write the chapter" but "open the file and write one sentence". The point is not the output but getting past the moment of starting, which is where the resistance sits. What usually happens after the first sentence is that continuing becomes easier than stopping.

**Specify exactly when and where.** This is the **implementation intentions** formula: "If it is nine in the morning and I am at my desk, I will open the file." [Gollwitzer and Sheeran (2006)](https://doi.org/10.1016/S0065-2601%2806%2938002-1), in a meta-analysis of around a hundred studies, found this formula produces a substantial effect on turning intention into behaviour, because it moves the decision out of the moment of weakness and into the moment of planning.

**Treat ambiguity before motivation.** An undefined task generates confusion, and confusion is a negative feeling to be escaped. If the task is "finish the project", you do not know what to do in the next minute — and the first step here is writing, not working: what are the first three concrete steps?

**Challenge the excuse as it appears.** "I'll do it when I'm ready" is the most common, and the right mood does not arrive before starting — it arrives after, if it arrives.

**And lower the cost of getting it wrong.** Fear of producing something bad is among the strongest drivers of delay. [Rozental and Carlbring (2014)](https://www.scirp.org/journal/paperinformation?paperid=51370) reviewed the available interventions, among which dealing with perfectionism and self-expectations stands out. The practical rule: allow the first draft to be bad on purpose, because revising is easier than starting from blank.

**And don't add self-punishment.** Beating yourself up after a delay increases the negative feeling attached to the task, which increases the escape next time — which is what sustains the loop. Treating yourself decently here is not indulgence; it breaks the reinforcement mechanism.

For more on building systems that reduce your reliance on willpower, see: [How to build habits that last](${S}/articles/-%D9%83%D9%8A%D9%81-%D8%AA%D8%A8%D9%86%D9%8A-%D8%B9%D8%A7%D8%AF%D8%A7%D8%AA-%D8%AA%D8%AF%D9%88%D9%85%D8%9F-%D8%AF%D9%84%D9%8A%D9%84-%D8%B9%D9%85%D9%84%D9%8A-%D9%85%D9%86-%D8%B9%D9%84%D9%85-%D8%A7%D9%84%D9%86%D9%81%D8%B3)

And if fear of failure specifically is what stops you, that is the subject of another article: [Why are we afraid of failure?](${S}/articles/-%D9%84%D9%85%D8%A7%D8%B0%D8%A7-%D9%86%D8%AE%D8%A7%D9%81-%D9%85%D9%86-%D8%A7%D9%84%D9%81%D8%B4%D9%84%D8%9F-%D9%88%D9%85%D8%A7-%D8%A7%D9%84%D8%B0%D9%8A-%D9%8A%D9%85%D9%86%D8%B9%D9%86%D8%A7-%D9%85%D9%86-%D8%A7%D9%84%D9%85%D8%AD%D8%A7%D9%88%D9%84%D8%A9%D8%9F)

⸻

# Sources

* Steel, P. (2007). [The nature of procrastination: A meta-analytic and theoretical review of quintessential self-regulatory failure](https://psycnet.apa.org/record/2006-23058-004). *Psychological Bulletin*, 133(1), 65–94.
* Sirois, F., & Pychyl, T. (2013). [Procrastination and the priority of short-term mood regulation](https://compass.onlinelibrary.wiley.com/doi/10.1111/spc3.12011). *Social and Personality Psychology Compass*, 7(2), 115–127.
* Tice, D. M., & Baumeister, R. F. (1997). [Longitudinal study of procrastination, performance, stress, and health](https://journals.sagepub.com/doi/10.1111/j.1467-9280.1997.tb00460.x). *Psychological Science*, 8(6), 454–458.
* Gollwitzer, P. M., & Sheeran, P. (2006). [Implementation intentions and goal achievement: A meta-analysis](https://doi.org/10.1016/S0065-2601%2806%2938002-1). *Advances in Experimental Social Psychology*, 38, 69–119.
* Sirois, F. M. (2007). ["I'll look after my health, later": A replication and extension of the procrastination–health model](https://doi.org/10.1016/j.paid.2006.11.003). *Personality and Individual Differences*, 43(1), 15–26.
* Rozental, A., & Carlbring, P. (2014). [Understanding and treating procrastination](https://www.scirp.org/journal/paperinformation?paperid=51370). *Psychology*, 5(13), 1488–1502.
* Steel, P., & König, C. J. (2006). [Integrating theories of motivation](https://doi.org/10.5465/amr.2006.22527462). *Academy of Management Review*, 31(4), 889–913.`,
  },
};

runArticleI18n(EN, "articles batch 2 (en)");
