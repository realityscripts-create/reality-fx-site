# CHAPTER FORGE STANDARD — Reality FX OS

> **Teach → Demonstrate → Challenge → Assess → Explain → Verify.**
> The standard for every chapter, every lane, from this day forward.
> Set by the Founder, 13 August 2026. Codified so no future forge drifts.

A chapter is not a collection of slides that need to be filled with information.
It is a **learning experience**. If a chapter can be described as "generated to
fill a slide count", it is not finished. Every chapter must feel intentional,
premium, educational and consistent with the chapters already established —
and must visibly deepen as the tier rises: **Standard teaches, Challenging
extends, Elite is the deepest material in the institution.**

---

## 1 · TEACH — the material carries its weight

- Slides **progress logically**: vocabulary → mechanics → context → the trade.
- Every concept is **explained clearly, then shown at work** — never asserted.
- No unnecessary repetition or filler. If two slides say the same thing, merge them.
- Depth is genuine: rich explanations, real examples, scenarios, charts where
  they serve the concept. Word count and depth matter — they are how the
  institution demonstrates substance from the outside.
- Native slide anatomy (the house structure every slide keeps):
  `eyebrow` (lane · topic), `title`, `lead`, `body`, `bullets`, `insight`.
  - `lead` — one crisp paragraph that opens the slide's idea.
  - `body` — the substance; the teaching itself.
  - `insight` — the closing takeaway, in the Academy's voice.
- **Tier depth rule:** Challenging contains everything Standard has plus its own
  additions; Elite adds further. Elite carries the most information, the bravest
  trade suggestions, the psychology of real trades. A student entering Elite
  must feel they have stepped into a different world.

## 2 · DEMONSTRATE — show it working, don't just say it

- Scenarios, drills, examples, replay-style walkthroughs and real-life trading
  situations (the psychological, literal and mental side of the trade).
- A demonstration must **show the concept working** — a worked calculation, a
  narrated market situation, a before/after, a decision under pressure.
- Practical behaviour belongs in the demanding/elite lanes: what the trader
  should expect, focus on, and do while the trade is live — patience under
  stress, what "probability is on your side" means when the trade goes against
  you, what to anticipate in a breakout vs a fake-out vs a reversal setup.

## 3 · CHALLENGE — questions that test the concept

- Every assessment **tests the concept actually taught** — never a rewording
  that can be passed by pattern-matching the slide.
- Challenging lane: 4 options, one answer, and the wrong options are **honest
  traps** (plausible misconceptions), not absurd decoys.
- Elite lane: **5 options** — that is the standard throughout (per Founder,
  "elite gets 5 option questions, that should be the standard throughout").
- Questions escalate: recall → apply → judge. The last questions of a chapter
  should make the student think like a trader, not like a note-taker.

## 4 · ASSESS — the machine must be able to judge ability

- `quizSlides` list must match the actual quiz entries exactly.
- Every quiz entry: `{ q, options, answer, explain }`.
- The assessment spread is deliberate — a chapter's quizzes are distributed so
  the student is measured along the way, not only at the end.
- Difficulty increases with tier: Challenging assessments are harder than
  Standard, Elite harder still. The material must justify the harder questions.

## 5 · EXPLAIN — every answer teaches

- **Every** quiz entry carries a non-empty `explain` — no exceptions.
- The explain **first answers the question plainly**, then goes deeper: the
  "deeper layer" passage that turns a correct guess into understanding and a
  wrong answer into the lesson. (The house style — "The deeper layer:" — is
  the recommended vehicle, not a mandated phrase.)
- A one-line restatement of the answer is a fail. If the explain cannot add
  insight, the question itself is too shallow to ship.

## 6 · VERIFY — the finished chapter is proven, not assumed

Before a chapter is accepted, all of these must pass:

1. **Structural check** — `.freebuff/tools/check-chapters.pl` reports ALL
   chapters verified: braces balanced, `quizSlides` matches quiz entries,
   `slides` matches the native array (including nulls/pause/close slots).
2. **Explain check** — every quiz entry has a substantive `explain`
   (non-empty, more than a restatement).
3. **Load check** — the chapter opens inside the OS (`#/map` → chapter), all
   slides navigate forward/back, the last slide returns to the Journey.
4. **Assessment check** — every quiz question answers and grades; wrong
   answers show the explain; the pass/retake flow works.
5. **Regression check** — the new material has not broken existing chapters:
   full audit (`audit-regression.pl`) is ALL GREEN, both System A trees
   identical, single OS stamp.
6. **Visual check** — the chapter is clean across screen sizes: typography,
   spacing and layout match the OS design system; nothing kisses, overflows
   or shifts between slides.

The audit counts slides, questions and assessments per chapter and per lane —
the machine reports the totals so the institution always knows its true size.
Never sell the course short: totals must include **every** slide ever created.

---

## The loop (permanent operating mode)

**Build → Test → Audit → Find → Fix → Verify → Report.**

- Don't hide problems — find them. A bug caught during a forge is the testing
  working; a bug caught by a student is the institution paying for it.
- Each new chapter raises the same questions as every other change: does it
  work on its own? Does it work with the rest of the OS? Does it break
  anything already working? Is it secure? Does it hold up on mobile?
- When a forge is complete, report: slide count, question count, per-lane
  split, verification results, and anything the testing flushed out.

*Signed — the Forge Standard, Reality FX Academy. Every chapter from here on
is held to it.*
