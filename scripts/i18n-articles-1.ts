/**
 * English for the first three November 2026 articles.
 *
 * Written by hand, not run through src/lib/translate.ts — see _i18n-lib.ts for
 * why machine translation is the wrong tool for this particular site.
 *
 * Usage:
 *   node --experimental-strip-types scripts/i18n-articles-1.ts [--apply]
 */

import { runArticleI18n, type ArticleEn } from "./_i18n-lib.ts";

const S = "https://www.al-maarefah.com";

const EN: Record<string, ArticleEn> = {
  "نموذج-العوامل-الخمسة-الكبرى": {
    title: "The Big Five: The Personality Model Researchers Actually Use",
    excerpt:
      "Most popular personality tests have no research behind them. The Big Five is the exception: how it was extracted from language itself, what it genuinely predicts, and what it cannot tell you about you.",
    faq: [
      {
        question: "What is the difference between the Big Five and Myers-Briggs?",
        answer:
          "The Big Five are continuous dimensions that measure degree, they were derived statistically from an analysis of thousands of trait words, and their reliability and internal consistency are acceptable. Myers-Briggs sorts people into sixteen discrete types, a substantial share of people get a different type on retest a few weeks later, and the evidence that it predicts job performance is weak.",
      },
      {
        question: "Do personality traits change with age?",
        answer:
          "Yes, and predictably. A meta-analysis of longitudinal studies found that people rise in conscientiousness and agreeableness and fall in neuroticism through midlife. Traits are relatively stable in the short run and genuinely changeable over the long one.",
      },
      {
        question: "Which of the five predicts success at work?",
        answer:
          "Conscientiousness is the strongest and the most consistent across job types, according to a meta-analysis covering many studies. Extraversion helps in roles built on influencing other people, such as sales and management — not in every role.",
      },
    ],
    content: `Take ten personality tests online and you will get ten different languages for describing yourself: animal types, colours, four temperaments, sixteen types labelled with four letters. Not one of them is what researchers use.

What they use is a single model called the **Big Five**. It is neither the newest nor the most appealing, but it is the one that has survived testing — and that difference is what this article is about.

# Where did the five come from?

Nobody sat down and decided personality has five dimensions. The number came out of language.

In the middle of the twentieth century, researchers started from a simple premise: if a difference between people matters, language will have made a word for it. So they pulled thousands of descriptive adjectives out of the dictionary, had large numbers of people rate themselves on them, and applied **factor analysis** — a statistical method that looks for traits that move together.

The adjectives clustered into five bundles. Someone who calls themselves organised usually also calls themselves disciplined, careful and dependable; someone who calls themselves anxious also calls themselves tense, pessimistic and quick to react. That same five-way clustering reappeared in independent studies, across different languages and cultures, and through different measurement instruments — documented by [Goldberg (1990)](https://psycnet.apa.org/record/1990-03639-001) and then by [McCrae and Costa (1987)](https://psycnet.apa.org/record/1987-11558-001), who found that how a person rates themselves agrees with how people who know them rate them, on the same five factors.

That last point matters: the model was not imposed on the data. It emerged from it.

# The five, and what each one means

The usual mnemonic is OCEAN. Each factor is a **continuous dimension**, not a box: people spread along it the way they spread along height, and most sit in the middle.

**Openness to experience.** A pull toward novelty, abstract ideas, art and variety. High scorers are curious and chafe at routine; low scorers are practical and prefer the familiar and the proven.

**Conscientiousness.** Organisation, follow-through, delayed gratification, finishing what you started. This factor matters most in practice, as below.

**Extraversion.** How much energy you draw from social interaction and outside stimulation. Being low on it is not shyness and not social anxiety — those are a different factor entirely.

**Agreeableness.** Cooperation, trust in others, empathy, a preference for harmony. People low on it are more sceptical, more competitive, and less reluctant to confront.

**Neuroticism.** The sensitivity of your emotional system: how much stress affects you, and how quickly worry and upset arrive. Being low on it is called emotional stability.

# What the model actually predicts

This is the paragraph that separates a scientific model from a marketing one: stating what it predicts and what it does not, with numbers.

**At work.** A well-known meta-analysis by [Barrick and Mount (1991)](https://onlinelibrary.wiley.com/doi/10.1111/j.1744-6570.1991.tb00688.x) found that conscientiousness predicted job performance in every occupational group they examined, and that it was the only factor that did. Extraversion predicted performance in roles whose core is influencing people — sales and management — and not in others.

**In life.** [Roberts and colleagues (2007)](https://journals.sagepub.com/doi/10.1111/j.1745-6916.2007.00047.x) compared the predictive power of traits against socioeconomic status and cognitive ability, on three outcomes: longevity, divorce, and occupational attainment. They found that traits — conscientiousness above all — competed with and on some outcomes exceeded both. That is a striking result: a trait measured with a short questionnaire tells you more about your odds of divorce than your family's income does.

**And the effect sizes are moderate, not deterministic.** This is the caveat that usually drops out of popular write-ups. The correlations here explain part of the variation between people, not all of it. Knowing someone's traits improves your estimate of their behaviour over the long run; it does not let you predict what they will do tomorrow.

# Three things people get wrong

**First: they are not types.** There is no "extravert" and no "introvert"; there is a position on a continuum. Splitting a continuum in two at the midpoint throws away information and exaggerates the gap between two people separated by a single question.

**Second: they are not fixed.** [Roberts and colleagues (2006)](https://psycnet.apa.org/record/2006-00644-001), in a meta-analysis of longitudinal studies, found that average trait levels shift predictably with age: conscientiousness and agreeableness rise, neuroticism falls, and most of the movement happens in the twenties and thirties. Personality is fairly stable across a year and genuinely changeable across twenty.

**Third: they are not a complete description.** The five are descriptive. They say *how much* of each trait you have, not *why*. They say nothing about your values, your skills, what you have lived through, or what you want from your life — and those shape your behaviour no less.

# How to judge a test against this standard

The model becomes practically useful when you use it as a yardstick for whatever is put in front of you. Three questions are enough:

* **Does it score degrees, or put you in a box?** Degrees are closer to reality.
* **Does it state its reliability?** That is: if you retook it in a month, would you expect the same result? A test that does not know the answer is not measuring a trait.
* **Does it state what it cannot tell you?** A serious instrument limits itself.

By that standard the **Myers-Briggs Type Indicator**, the best known personality test in workplaces, stumbles. [Pittenger (2005)](https://psycnet.apa.org/record/2005-12145-002) reviewed its evidence and concluded that a substantial share of people get a different type when they retake it weeks later, that the four dimensions are not independent as assumed, and that evidence for predicting job performance is weak. The structural problem is that it imposes a hard cut on a continuum: someone near the midpoint gets pushed to one side, and the gap between them and their neighbour looks total when it is one question wide.

The same standard applies, frankly, to many popular tests — including some on this site. Colour tests, animal types and love languages are common presentation devices, not validated psychological instruments, and we say so on their own result pages. Their value is that they open a door to thinking about yourself, not that they measure you.

# If you want a result that means something

The Big Five item pool known as **IPIP** is freely available to the public, was built specifically as an open alternative to commercial inventories, and lives at the [IPIP site](https://ipip.ori.org/). There is also **BFI-2**, developed by [Soto and John (2017)](https://psycnet.apa.org/record/2016-49473-001), one of the most widely used short forms in research.

Whatever you use, the benefit does not come from the score. It comes from the question the score raises. Knowing your conscientiousness is low changes nothing; knowing that this is why external structure — deadlines, reminders, a partner who asks how it is going — works better for you than relying on willpower changes something.

For more on how traits form in the first place, between heredity and environment, see our article: [How personality is formed](${S}/articles/%D9%83%D9%8A%D9%81-%D8%AA%D8%AA%D9%83%D9%88%D9%86-%D8%A7%D9%84%D8%B4%D8%AE%D8%B5%D9%8A%D8%A9)

⸻

# Sources

* Goldberg, L. R. (1990). [An alternative "description of personality": The Big-Five factor structure](https://psycnet.apa.org/record/1990-03639-001). *Journal of Personality and Social Psychology*, 59(6), 1216–1229.
* McCrae, R. R., & Costa, P. T. (1987). [Validation of the five-factor model of personality across instruments and observers](https://psycnet.apa.org/record/1987-11558-001). *Journal of Personality and Social Psychology*, 52(1), 81–90.
* Barrick, M. R., & Mount, M. K. (1991). [The Big Five personality dimensions and job performance: A meta-analysis](https://onlinelibrary.wiley.com/doi/10.1111/j.1744-6570.1991.tb00688.x). *Personnel Psychology*, 44(1), 1–26.
* Roberts, B. W., Kuncel, N. R., Shiner, R., Caspi, A., & Goldberg, L. R. (2007). [The Power of Personality](https://journals.sagepub.com/doi/10.1111/j.1745-6916.2007.00047.x). *Perspectives on Psychological Science*, 2(4), 313–345.
* Roberts, B. W., Walton, K. E., & Viechtbauer, W. (2006). [Patterns of mean-level change in personality traits across the life course](https://psycnet.apa.org/record/2006-00644-001). *Psychological Bulletin*, 132(1), 1–25.
* Pittenger, D. J. (2005). [Cautionary comments regarding the Myers-Briggs Type Indicator](https://psycnet.apa.org/record/2005-12145-002). *Consulting Psychology Journal*, 57(3), 210–221.
* Soto, C. J., & John, O. P. (2017). [The next Big Five Inventory (BFI-2)](https://psycnet.apa.org/record/2016-49473-001). *Journal of Personality and Social Psychology*, 113(1), 117–143.
* Goldberg, L. R., et al. [International Personality Item Pool (IPIP)](https://ipip.ori.org/).`,
  },

  "انماط-التعلق-في-العلاقات": {
    title:
      "Attachment Styles: What the Research Actually Says About Secure, Anxious and Avoidant",
    excerpt:
      "The idea of attachment styles spread further than the research behind it. Where it came from, what evidence links it to adult relationships, and why researchers reject sorting people into four boxes.",
    faq: [
      {
        question: "Can an attachment style change?",
        answer:
          "Yes, though not easily. A meta-analysis found the link between childhood and adult attachment is real but moderate in strength, meaning change is both possible and common. What drives it most is a long, stable relationship with a responsive person, and psychotherapy.",
      },
      {
        question: "Can someone be anxious and avoidant at the same time?",
        answer:
          "Yes. Anxiety and avoidance are two separate dimensions, not two ends of one scale, so both can be high at once — which is what used to be called fearful or disorganised attachment.",
      },
      {
        question: "Are attachment styles a validated measure like the Big Five?",
        answer:
          "The two dimensions — anxiety and avoidance — have well-studied instruments such as the ECR, with acceptable psychometric properties. Sorting people into four named styles is a presentational simplification of those two dimensions, not a classification the data support.",
      },
    ],
    content: `"My style is anxious and his is avoidant" has become a common sentence. The trouble is that it carries less precision than it sounds: attachment styles do have real research behind them, but the picture that spread — four boxes people get sorted into — is not what the research found.

# Where the idea started

It started with children, not with couples.

In the 1960s the British psychiatrist **John Bowlby** argued in [Attachment and Loss](https://www.taylorfrancis.com/books/mono/10.4324/9780429482571/attachment) that a child's need to stay close to a caregiver is not a learned behaviour aimed at getting food, but a behavioural system in its own right that evolved because it keeps the child alive. And that out of repeated experience with that caregiver the child builds an internal model: when I need someone, does anyone come?

Then **Mary Ainsworth** supplied the experimental evidence. In a procedure that came to be called the Strange Situation, described in [Patterns of Attachment (1978)](https://www.taylorfrancis.com/books/mono/10.4324/9780203758045/patterns-attachment), she observed children around their first year separated from their mothers in a room and then reunited. What mattered was not how much the child cried at separation but **what the child did on reunion** — and there distinct patterns appeared: children who sought closeness, settled, and went back to playing; children who were hard to settle and stayed upset and clinging; and children who ignored the return and carried on playing even though their physiological stress markers were elevated.

# How it moved to adult relationships

The decisive step came from [Hazan and Shaver (1987)](https://psycnet.apa.org/record/1987-20498-001), who proposed that adult romantic love also operates as an attachment system: the partner becomes the person from whom safety is sought in distress.

They published a short questionnaire in a newspaper and found that responses distributed across three descriptions in proportions similar to how children distributed in Ainsworth's work. That paper launched an entire field, and most of what you read about attachment today is built on it.

But measurement moved on considerably afterwards, and this is the part that usually drops out of popular accounts.

# The research does not see four boxes, it sees two dimensions

When researchers applied statistical analysis to attachment questionnaires, they did not find discrete categories. They found **two continuous dimensions**, as set out by [Brennan and colleagues (1998)](https://psycnet.apa.org/record/1998-07137-003) and then refined by [Fraley and colleagues (2000)](https://psycnet.apa.org/record/2000-13324-013) in the ECR and its revised form:

* **Attachment anxiety** — how preoccupied you are with being left, or with the other person caring less than you do.
* **Attachment avoidance** — how uncomfortable closeness and dependence make you, and how much you lean toward emotional self-sufficiency.

The four familiar styles are nothing more than the quadrants of this two-dimensional space: low on both is "secure"; high anxiety and low avoidance is "anxious"; low anxiety and high avoidance is "avoidant"; high on both is "fearful" or "disorganised".

The difference is practical, not academic. When the data are tested directly for whether attachment is categorical or continuous — as [Fraley and Waller (1998)](https://psycnet.apa.org/record/1998-07137-004) did — the answer points to continuous. Which means someone who falls near a dividing line gets classified completely differently for a tiny difference in score, and that saying "I am avoidant" converts a position on a scale into an identity that does not carry that precision.

# What each dimension is associated with

**High anxiety** is associated with repeated reassurance-seeking, heightened sensitivity to signs of rejection, escalating during conflict rather than withdrawing, and reading ambiguity — an unanswered message, a flat tone — in the worst available direction.

**High avoidance** is associated with holding back from disclosing feelings, withdrawing during conflict, preferring to handle things alone, and discomfort at depending on anyone — and also, this gets forgotten, discomfort at being depended on.

**Low on both** is associated with what is called security: being able to ask for support when you need it and to give it, and to tolerate conflict without it becoming a threat to the relationship.

[Mikulincer and Shaver (2007)](https://www.guilford.com/books/Attachment-in-Adulthood/Mikulincer-Shaver/9781462533817) review the field's evidence at book length, the broadest treatment of the subject.

A caveat is required here: most of these associations are moderate in size and drawn from questionnaires people fill in about themselves. They describe **patterns on average**. They do not predict what a particular person will do in a particular argument.

# Can the pattern change?

This is the most practical question, and the answer is yes — with a condition.

[Fraley (2002)](https://journals.sagepub.com/doi/10.1207/S15327957PSPR0602_03) examined in a meta-analysis how stable attachment is from childhood to adulthood, and found a real but moderate association. That means two things at once: the effect of early experience is not erased, and a great many people do change.

What is associated with movement toward security is, above all, **a stable long relationship with a responsive person** — that is, repeated experience that contradicts the old expectation. Psychotherapy as well, particularly work that targets relationships and interaction patterns.

What does not produce change: knowing the name of your style. That deserves saying plainly, because using the label as a final explanation — "I'm avoidant, that's just how I am" — converts a description into an exemption from trying, which is the opposite of what the research says.

# What to do with this

**If your anxiety is high:** the goal is not to stop needing reassurance, but to separate the feeling from the behaviour. When an impression of rejection arrives, state it clearly instead of testing for it — "I felt some distance between us today" is clearer and far cheaper than a string of messages hunting for a signal.

**If your avoidance is high:** the hardest and most effective step is staying in the difficult conversation ten minutes past the point where you want it to end. And if you genuinely need to withdraw, say when you will be back — it is silent withdrawal that raises the other person's anxiety, not withdrawal itself.

**And if you are in the most common pattern** — one pursuing, one withdrawing — the loop itself is the problem, not either of you. A bid for closeness reads as pressure, so withdrawal increases; withdrawal reads as rejection, so bids increase. Breaking it requires both people to move in the direction that feels least natural to them, at the same time.

For the difference between attachment, love and infatuation — which get conflated often — see our article: [The difference between love, attachment and infatuation](${S}/articles/%D8%A7%D9%84%D9%81%D8%B1%D9%82-%D8%A8%D9%8A%D9%86-%D8%A7%D9%84%D8%AD%D8%A8-%D9%88%D8%A7%D9%84%D8%AA%D8%B9%D9%84%D9%82-%D9%88%D8%A7%D9%84%D8%A7%D8%B9%D8%AC%D8%A7%D8%A8)

⸻

# Sources

* Bowlby, J. (1969). [Attachment and Loss, Vol. 1: Attachment](https://www.taylorfrancis.com/books/mono/10.4324/9780429482571/attachment). Basic Books.
* Ainsworth, M. D. S., Blehar, M. C., Waters, E., & Wall, S. (1978). [Patterns of Attachment](https://www.taylorfrancis.com/books/mono/10.4324/9780203758045/patterns-attachment). Erlbaum.
* Hazan, C., & Shaver, P. (1987). [Romantic love conceptualized as an attachment process](https://psycnet.apa.org/record/1987-20498-001). *Journal of Personality and Social Psychology*, 52(3), 511–524.
* Brennan, K. A., Clark, C. L., & Shaver, P. R. (1998). [Self-report measurement of adult attachment: An integrative overview](https://psycnet.apa.org/record/1998-07137-003). In *Attachment Theory and Close Relationships*. Guilford.
* Fraley, R. C., Waller, N. G., & Brennan, K. A. (2000). [An item response theory analysis of self-report measures of adult attachment](https://psycnet.apa.org/record/2000-13324-013). *Journal of Personality and Social Psychology*, 78(2), 350–365.
* Fraley, R. C., & Waller, N. G. (1998). [Adult attachment patterns: A test of the typological model](https://psycnet.apa.org/record/1998-07137-004). In *Attachment Theory and Close Relationships*. Guilford.
* Fraley, R. C. (2002). [Attachment stability from infancy to adulthood](https://journals.sagepub.com/doi/10.1207/S15327957PSPR0602_03). *Personality and Social Psychology Review*, 6(2), 123–151.
* Mikulincer, M., & Shaver, P. R. (2007). [Attachment in Adulthood](https://www.guilford.com/books/Attachment-in-Adulthood/Mikulincer-Shaver/9781462533817). Guilford Press.`,
  },

  "لماذا-تبدو-نتائج-اختبارات-الشخصية-دقيقة": {
    title: "Why Does a Personality Test Result Feel So Accurate? The Barnum Effect",
    excerpt:
      "In 1948 a university lecturer handed his students the same personality description, and each of them rated its accuracy about themselves at four out of five. This is why any test result feels like it was written about you specifically.",
    faq: [
      {
        question: "What is the Barnum effect?",
        answer:
          "The tendency to accept a vague, general description as accurate and specific to you. It is named after the American showman Phineas Barnum, and its first experimental demonstration was Bertram Forer's 1948 classroom study.",
      },
      {
        question: "Does that mean all personality tests are worthless?",
        answer:
          "No. Well-studied instruments such as Big Five inventories show stability on retest and predict real life outcomes. But entertainment tests rely on general wording and flattery rather than measurement, and the Barnum effect explains why their results still feel convincing.",
      },
      {
        question: "How can I tell a real description from a general statement?",
        answer:
          "Read the result and ask: does this apply to most people? Does it also describe my opposite? Does it say anything that could turn out to be wrong? A description that excludes nobody is measuring nothing.",
      },
    ],
    content: `In 1948 the psychologist **Bertram Forer** ran a simple experiment on his students. He gave them a personality test, returned to each one an analysis he said was based on their answers, and asked them to rate how accurate it was.

The average rating was **4.3 out of 5**.

He then told them that the analysis every one of them had received was word for word identical — thirteen statements he had assembled from an astrology book in a newsstand. The study was published as [The fallacy of personal validation](https://psycnet.apa.org/record/1950-02308-001), and became one of the best known demonstrations in psychology.

This article is about why it worked — and still works today, on the results of tests you may have taken on this very site a few minutes ago.

# What was in the text?

Some of Forer's statements:

* "You have a need for other people to like and admire you, and yet you tend to be critical of yourself."
* "You have a great deal of unused capacity which you have not turned to your advantage."
* "At times you have serious doubts as to whether you have made the right decision."
* "You prefer a certain amount of change and variety and become dissatisfied when hemmed in by restrictions."

Read them again with a critical eye. Every one of them shares a single property: **it cannot be wrong**.

Who does not want to be liked? Who does not criticise themselves? "At times" is enough to make a statement true if the thing has happened once in your life. And "unused capacity" is a compliment nobody declines.

# Four mechanisms that make it work

**Two-sided wording.** The statement carries a quality and its opposite together — "sociable, but you need time to yourself". Anyone finds themselves in one half, and reads the other half as added precision: "true, I'm both!"

**Elastic quantifiers.** "At times", "in some situations", "may", "tend to" — each one makes the statement true at any frequency above zero.

**Flattery.** [Snyder and colleagues (1977)](https://psycnet.apa.org/record/1977-22196-001), reviewing this effect, found people accept positive descriptions of themselves far more readily than negative ones, whatever their accuracy. A result telling you that you are a creative leader will be accepted; one telling you that you are indecisive and shallow will be examined critically.

**The authority of the source.** [Rosen (1975)](https://psycnet.apa.org/record/1975-26061-001) showed that acceptance of the same description rises when it is said to come from an expert or a scientific instrument. This is the work done by the word "test", by a percentage, and by a chart: they add no information, they add confidence.

[Dickson and Kelly (1985)](https://journals.sagepub.com/doi/10.2466/pr0.1985.57.2.367) reviewed the accumulated literature on the effect and found it replicates consistently, and strengthens when the person is told the analysis was prepared for them personally, when its content is positive, and when it comes from an authoritative source.

# Taking a real result apart, line by line

It becomes clearer with an example. Take this passage, of the kind you read in personality test results:

> "You are a natural leader, but at times you need to withdraw and reorganise your thoughts. Others see you as confident, and yet you have moments of doubt nobody knows about. You value deep relationships more than numerous ones."

Three sentences, containing every device:

* **"A natural leader … you need to withdraw"** — a quality and its opposite in one sentence. People who take initiative find themselves at the start; people who hold back find themselves at the end.
* **"Others see you as confident, and yet you have moments of doubt"** — it describes a gap between the outside and the inside. Nearly every human being knows that gap, because nobody can see inside anybody else.
* **"Nobody knows about"** — this creates the sense of something revealed to you specifically. That is the core of the trick: there is nothing new in the information, the novelty is in the feeling that it is a secret.
* **"Deep relationships more than numerous ones"** — who picks the opposite? Nobody says of themselves that they prefer many shallow relationships.

There is not **one falsifiable statement** in those three sentences. That is the test: a description that cannot be wrong cannot be right in any useful sense.

# When the effect moves into real decisions

If it stayed within entertainment it would be a theoretical discussion. It does not stay there.

[Logue and colleagues (1992)](https://doi.org/10.1037/0735-7028.23.3.226) documented a version of this inside clinical practice itself: they examined a list of traits attributed to "adult children of alcoholics" — a common description in popular books — and found that people whose parents were not alcoholics recognised themselves in those traits to the same degree. The description was not describing a group; it was describing human beings.

The effect on practical decisions is direct. When a personality test is used to compose a team or steer a course of study, an employee's acceptance of their result reads as confirmation that the instrument is valid — when it may be nothing but the Barnum effect doing exactly what it does. This is precisely why researchers insist on reliability, discrimination and prediction: because people's satisfaction with a result is not evidence that it is correct, and may be evidence of the reverse.

# What this does not mean

The Barnum effect is not evidence that measuring personality is impossible. That is a common error in the other direction.

The difference between a Barnum description and a real measure is testable, on three criteria:

**Reliability.** If you retook the test in a month, would you get the same result? Well-studied Big Five inventories show high stability. A result that moves with your mood is not measuring a trait.

**Discrimination.** Does the measure actually distinguish two people, or hand everyone a similar description? Forer's text gets 4.3 from everybody — and that is evidence of its failure, not its success.

**Prediction.** Does the score relate to anything outside the questionnaire? Conscientiousness scores relate to job performance and other life outcomes in meta-analyses. A colour type relates to nothing, because it was never tested.

# How to read a result from now on

Three questions, ten seconds:

**Does it apply to most people?** If so, it says nothing about you. Test this by reading a result that is *not* yours from the same test — if you find yourself in that one too, you have your answer.

**Does it rule anything out?** A useful description says what you are not. One that describes you as all good things has measured nothing.

**Where did it come from?** Does the test say what it is built on, how reliable it is, and what it cannot tell you? A serious instrument limits itself; an entertainment one sells certainty.

# And why write this on a quiz site?

Because honesty here is more useful than silence, and because the tests on this site are subject to these criteria like any other.

Our colour, animal-type and love-language tests are common presentation devices, not validated psychological instruments — and that is written on their own result pages, not only here. What they are genuinely good for is being a way into thinking about yourself: a question that prompts an observation, or a description you find yourself objecting to, which tells you why. That is not nothing — but it is not measurement.

The difference between someone enjoying a test while knowing what it is, and someone building a decision on its result, is the difference between a useful activity and real harm. The Barnum effect is why the second happens so often.

To understand what well-studied personality tests actually measure, see: [The Big Five](${S}/articles/%D9%86%D9%85%D9%88%D8%B0%D8%AC-%D8%A7%D9%84%D8%B9%D9%88%D8%A7%D9%85%D9%84-%D8%A7%D9%84%D8%AE%D9%85%D8%B3%D8%A9-%D8%A7%D9%84%D9%83%D8%A8%D8%B1%D9%89)

⸻

# Sources

* Forer, B. R. (1949). [The fallacy of personal validation: A classroom demonstration of gullibility](https://psycnet.apa.org/record/1950-02308-001). *Journal of Abnormal and Social Psychology*, 44(1), 118–123.
* Snyder, C. R., Shenkel, R. J., & Lowery, C. R. (1977). [Acceptance of personality interpretations: The "Barnum effect" and beyond](https://psycnet.apa.org/record/1977-22196-001). *Journal of Consulting and Clinical Psychology*, 45(1), 104–114.
* Rosen, G. M. (1975). [Effects of source prestige on subjects' acceptance of the Barnum effect](https://psycnet.apa.org/record/1975-26061-001). *Journal of Consulting and Clinical Psychology*, 43(1), 95.
* Dickson, D. H., & Kelly, I. W. (1985). [The "Barnum effect" in personality assessment: A review of the literature](https://journals.sagepub.com/doi/10.2466/pr0.1985.57.2.367). *Psychological Reports*, 57(1), 367–382.
* Furnham, A., & Schofield, S. (1987). [Accepting personality test feedback: A review of the Barnum effect](https://link.springer.com/article/10.1007/BF01063435). *Current Psychological Research & Reviews*, 6(2), 162–178.
* Logue, M. B., Sher, K. J., & Frensch, P. A. (1992). [Purported characteristics of adult children of alcoholics: A possible "Barnum effect"](https://doi.org/10.1037/0735-7028.23.3.226). *Professional Psychology: Research and Practice*, 23(3), 226–232.`,
  },
};

runArticleI18n(EN, "articles batch 1 (en)");
