const C = {
    elite: {
      slides: 30,
      quizSlides: [20,21,22,23,24,25,26,27,28,29],
      quiz: [
        { q: "A trendline's authority is earned by…",
          options: ["How straight it looks", "The market's touches — one touch is a guess, two a sketch, three or more with clean bounces a working structure, and each bounce is the market voting that the line matters", "How many people draw it", "The news behind it", "How steep it is"], answer: 1,
          explain: "The line is only a trendline if the market respects it — each touch and bounce is a vote, and the authority is the votes, never the drawing. The deeper layer: the amateur draws lines to fit the hope; the professional lets the touches build the line and redraws when the votes stop coming — the oversteep line breaks on the first normal pullback, and the line's angle must match the market's actual pace." },
        { q: "A pattern's edge comes from…",
          options: ["Certainty the pattern must resolve as drawn", "The probabilistic tilt — the shape resolves in the favoured direction more often than not, and the professional trades the tilt with the break confirming, the retest entering and the stop respecting the other side", "The pattern's popularity", "The timeframe alone", "The pattern's size"], answer: 1,
          explain: "The pattern is a habit with a historical bias, never a promise — the same shape fails a percentage of the time, and the edge lives in the aggregate, not the individual. The deeper layer: one pattern trade can fail and still be the right decision, because the decision is judged by the distribution — the professional trades the tilt with three guards: the break confirms the direction, the retest provides the entry, and the stop respects that this time might be the other side." },
        { q: "The measured move of a pattern projects…",
          options: ["The exact future price to the pip", "A target zone — the pattern's height projected from the breakout level (the head-and-shoulders' depth from the neckline, the flag's pole, the range's height), giving the trade an objective the management can use", "The stop distance", "The exact reversal point", "The volume needed"], answer: 1,
          explain: "The measured move is the pattern's arithmetic: the setup's height projected from the breakout — the objective the trade is managed toward. The deeper layer: the measured move is a zone, not a promise — the price may overshoot or fall short, and the professional treats it as the management's target, with the trail and the partials doing the exit work rather than the projection being worshipped as the exact top or bottom." },
        { q: "Two independent lines of evidence at a level are worth more than five echoes because…",
          options: ["More is always better", "Independence is the value — the structure and the volume are separate worlds of evidence, while five indicators from the same candles are one vote repeated, and the independent voices multiply conviction while the echoes only amplify the same one", "Echoes are stronger", "The level cares about the count", "The indicators matter most"], answer: 1,
          explain: "Confluence is the alignment of independent evidence — the structure, the volume, the levels, the sentiment, each a separate world of evidence, and the level where the worlds agree is the level most likely to hold. The deeper layer: the echo is the amateur's version — five indicators from the same price history are five echoes of one vote, and counting them as five confirmations is multiplying the noise. Two weak independent voices beat five echoes of the same one, because the independence is the information." },
        { q: "The raw break of a level is…",
          options: ["The signal to enter immediately", "A claim, not a proof — the market often returns to retest the flipped level, and the professional waits for the retest that holds (or fails) to decide whether the break was real", "Always a fakeout", "The end of the move", "Only valid on daily charts"], answer: 1,
          explain: "The break announces the direction; the retest proves it — and the two-step is the market's own confirmation protocol. The deeper layer: the entry at the retest has the tight stop beyond the flipped level and the market's proof behind it, while the entry at the raw break buys the announcement without the confirmation — and the announcement is where the fakeouts live. The break is the rumour; the retest is the fact." },
        { q: "A wick through your trendline is…",
          options: ["A break — close immediately", "A test, not a violation — the line stays valid until price closes through with follow-through, and the rejected probe is actually a strong vote FOR the line's strength", "A stronger signal than a close", "Proof the line is wrong", "Only a signal on the daily"], answer: 1,
          explain: "The wick is the market's probe — the stab through the line that gets pulled back, which is a test of the line, not a violation of it. The deeper layer: the wick-vs-close distinction is the market's filter for the impatient — the probe stops out the trigger-happy and lets the structure prove itself, and a line that survives repeated stabs is a line the market cares about. The close with follow-through is the real hand-off; the wick is the noise, and judging a line by its wicks is how the market shakes out the impatient." },
        { q: "The value zone and the entry trigger…",
          options: ["Are the same thing", "Answer different questions — the zone is WHERE the trade should be taken (price cheap relative to the move), the trigger is WHEN (the visual clue the level is working), and conflating them is how traders enter early and get stopped by the level's first probe", "Are both about timing", "Are both about location", "Are unnecessary"], answer: 1,
          explain: "Value is the location; the trigger is the timing — price reaching the zone is not permission to enter, and the trigger (the rejection candle, the retest bounce, the breakout close) is the evidence the level is working right now. The deeper layer: the amateur enters at the level early and gets stopped by the zone's first test; the professional accepts a slightly worse price for a much better probability — the level AND the trigger, both respected, and the trade that honours both is the trade that survives the level's tests." },
        { q: "The same bullish pattern means different things in different phases because…",
          options: ["Patterns are random", "The phase decides the pattern's meaning — the continuation pattern inside a mark-up is the trend's fuel, while the same pattern at the end of a long move is the reversal's setup, and the context outranks the shape", "The phase does not matter", "Only the pattern matters", "The news decides"], answer: 1,
          explain: "The pattern describes the crowd's local behaviour; the phase (the cycle) decides what that behaviour means — the same shape is a continuation inside the mark-up and a reversal at the top, because the context is the paragraph the sentence lives in. The deeper layer: this is where the Academy's chapters connect — the pattern is a sentence and the cycle is its paragraph, and the trader who reads the paragraph before the shape trades the pattern's meaning instead of its costume." },
        { q: "The professional's technical edge is ultimately…",
          options: ["Predicting the exact turns", "Probability management — reading the crowd's behaviour with the bias, confirming with the structure, entering with the trigger, sizing for the worst case and managing with the plan, because the chart is a language, not a crystal ball", "More indicators", "Faster clicks", "The best drawing tools"], answer: 1,
          explain: "The chart is a probability language: it tells you what the crowd is doing and where behaviour historically stalls, and it never tells you the future with certainty. The deeper layer: the professional's edge is the whole process — the bias from the structure, the confirmation from the trigger, the risk from the size, the exit from the plan — executed repeatedly, because the language's edge lives in the aggregate, and the trader who demands certainty from a probability language is the market's reliable customer." },
        { q: "The chart identity is…",
          options: ["Drawing the most lines", "The trader who reads the chart as the crowd's fingerprint — the structure, the patterns, the confluence and the plan all read with evidence, and the discipline of waiting for the alignment before every trade", "Trusting the first pattern you see", "Trading every level", "Ignoring the structure"], answer: 1,
          explain: "The chart identity is the mature relationship with the language: the structure first, the pattern as the probability, the confluence as the independent voices, the plan as the decision made before the emotion — and the patience to wait for the alignment the whole chart offers. The deeper layer: thirteen chapters of tools, and the final skill is the discipline to use them only when they align — the trader who waits for the agreement and follows the plan is the trader the language eventually pays." }
      ],
      native: [
        {
          eyebrow: "Elite · The language",
          title: "The Chart as the Crowd's Fingerprint",
          lead: "The Standard chapter taught you the technical vocabulary. This lane opens the mathematics and the discipline behind it — the trendline's earned authority, the pattern's probability, the measured move, the confluence of independent voices, and the plan that turns the language into a trade.",
          body: [
            "The chart works because price discounts everything — the candles are the crowd's behaviour made visible, and behaviour repeats because the psychology behind it repeats. The language is learned once and spoken on every market, every timeframe, every day.",
            "This lane teaches you to speak it with evidence — the probability, the confirmation, the management — so that the language serves the discipline, never the other way around."
          ],
          bullets: [
            "The chart is the crowd's fingerprint — price discounts everything, and behaviour repeats",
            "The trendline earns its authority from the market's touches, never the drawing",
            "The pattern is a probability, not a promise — the tilt is traded with the stop",
            "The plan turns the language into a trade — decided before the emotion arrives"
          ],
          insight: "The chart is a language the crowd writes — and the trader who reads it with evidence is the trader the language pays."
        },
        {
          eyebrow: "Elite · The line",
          title: "The Line — Construction and Authority",
          lead: "The trendline is a hypothesis with a construction — the touches, the angle, the redraw — and the construction is what separates the working line from the wishful one.",
          body: [
            "The trendline connects the significant swing points — the lows for the uptrend's support, the highs for the downtrend's resistance — and the line's validity lives in the touches: one touch is a guess, two a sketch, three or more with clean bounces a working structure. The angle matters too: the oversteep line outruns the market's actual pace and breaks on the first normal pullback; the overflat line has no relationship to the swings and carries no information.",
            "The deeper layer: the line is a conversation, not a decree — you draw it, the market votes on it, and the professional redraws when the votes stop coming. The broken line is information about the trend's pace, not an insult to the drawing; the respected line is the trend's skeleton, and the skeleton only works when it matches the body that actually moves. The line's authority is earned from the market, one touch at a time — and the trader who lets the touches build the line is the trader whose lines the market respects."
          ],
          bullets: [
            "The line connects the significant swings — the lows for support, the highs for resistance",
            "One touch is a guess, two a sketch, three with bounces a working structure",
            "The oversteep line breaks on the first normal pullback; the overflat carries nothing",
            "The line's authority is earned from the market, one touch at a time"
          ],
          insight: "The trendline is a hypothesis the market votes on with every touch — and the construction, not the conviction, decides the authority."
        },
        {
          eyebrow: "Elite · The vote",
          title: "The Vote — Touches and Validity",
          lead: "Every touch of the line is the market voting — and the validity is the tally, which is why the professional counts the touches before the line is trusted.",
          body: [
            "The market votes on every line it respects: the touch that bounces is the yes-vote, the touch that breaks through on the close is the no-vote, and the wick that stabs and gets pulled back is the abstention that strengthens the line. The tally is the validity: the three-touch line with clean bounces is the structure the market has adopted; the one-touch line is a guess wearing a line's clothes.",
            "The deeper layer: the vote is the difference between drawing and reading — the amateur draws the line that fits the hope and then argues with the market; the professional reads the tally and lets the market's votes build the structure. The line with the votes behind it is the level the market will respect; the line with none is the level the market will ignore, whatever the drawer's conviction. The validity is the market's tally, never the drawing's beauty — and the trader who counts the votes is the trader whose lines hold."
          ],
          bullets: [
            "Every touch is a vote — the bounce is yes, the close-through is no, the rejected wick strengthens",
            "The three-touch line with clean bounces is the adopted structure",
            "The one-touch line is a guess wearing a line's clothes",
            "The validity is the market's tally, never the drawing's beauty"
          ],
          insight: "The market votes on every line with its touches — and the trader who counts the votes is the trader whose lines hold."
        },
        {
          eyebrow: "Elite · The probe",
          title: "The Wick — The Test vs The Break",
          lead: "The market probes every line it cares about — and the probe that gets rejected is not a violation; it is the line passing its hardest test.",
          body: [
            "The wick through the line is the market's stab — the test that gets pulled back before the close, and the pullback is the market telling you the line matters. The close through with follow-through is the real hand-off; the wick is the noise. A line that survives repeated stabs is a line the market cares about; a line that breaks on the close with follow-through is a line whose era has ended.",
            "The deeper layer: the wick-vs-close distinction is the market's filter for the impatient — the probe stops out the trigger-happy and lets the structure prove itself, and the trader who panics at the wick is the trader the probe was designed to collect. The professional reads the probe as information about the line's health: the rejected stab is a strong vote FOR the line, and the series of rejected stabs at the same line is the defence proving itself before the eventual break. The market does not respect the line — it respects the trader who understands what the line's tests mean."
          ],
          bullets: [
            "The wick is the market's stab — the test that gets pulled back before the close",
            "The close with follow-through is the real hand-off; the wick is the noise",
            "A line that survives repeated stabs is a line the market cares about",
            "The rejected probe is a strong vote FOR the line's strength"
          ],
          insight: "The market probes every line it cares about — and the trader who reads the probes reads the line's health before the break."
        },
        {
          eyebrow: "Elite · The proof",
          title: "The Retest — The Proof of the Break",
          lead: "The break announces the direction and the retest proves it — and the character of the retest is where the true break separates from the fakeout.",
          body: [
            "When a level breaks, the market often returns to test it from the other side — and the retest has two faces. The honest retest arrives quietly, holds the flipped level, and resumes in the breakout's direction — the market confirming it meant the break. The trap arrives fast and loud, stabs back through the flipped level, and leaves the breakout's traders holding the loss — the fakeout in its classic form.",
            "The deeper layer: the retest is where the risk is defined and the conviction is proven — the entry at the honest retest has the tight stop beyond the flipped level and the market's proof behind it. The professional reads the retest's character: does it hold with rejection candles? Does volume confirm the flip? Does the higher timeframe agree with the direction? The retest that answers all three is the entry that minimises drawdown; the retest that answers none is the trap wearing the retest's clothes. The level's flip is the invitation; the retest's character is the acceptance."
          ],
          bullets: [
            "The break announces; the retest proves — the two-step is the confirmation protocol",
            "The honest retest holds the flipped level and resumes the break",
            "The trap stabs back through the level and leaves the breakout's traders holding losses",
            "Read the retest's character — the flip is the invitation, the retest is the acceptance"
          ],
          insight: "The same retest is the safest entry or the classic trap — and the character of the arrival, not the arrival itself, decides which."
        },
        {
          eyebrow: "Elite · The flip",
          title: "Role Reversal — The Level That Changes Sides",
          lead: "The level that caps price from above and then holds it from below has changed sides — and the flip is the market's most honest confirmation.",
          body: [
            "Resistance turning into support is the bullish signature: the sellers who defended the level are gone, and the buyers who broke it are willing to defend it. The break without the flip is just a move; the break with a respected retest is a change of regime. The mirror runs in reverse — support that breaks and then rejects as new resistance is the bearish confirmation, the floor that became a ceiling.",
            "The deeper layer: the flip is meaningful because it shows intent with a price tag — defending a flipped level costs money, and the market that pays it is telling you the regime changed. The professional does not trade the raw break; they wait for the retest that proves the level changed sides, because the retest is where the risk is defined — the stop beyond the flipped level — and the conviction is proven. The break is the rumour; the flip is the fact; and the trader who trades rumours pays for facts they never received."
          ],
          bullets: [
            "Resistance that holds as support is the bullish signature — sellers gone, buyers defending",
            "The break without the flip is just a move; the flip is a change of regime",
            "Defending a flipped level costs money — the market pays when it means it",
            "The break is the rumour; the flip is the fact"
          ],
          insight: "The level that changes sides has told you more than any indicator — and the retest is where the flip gets its receipt."
        },
        {
          eyebrow: "Elite · The probability",
          title: "The Pattern — Probability, Not Promise",
          lead: "A pattern is not a promise — it is a habit with a historical bias, and the professional trades the bias with the break confirming, the retest entering and the stop respecting the other side.",
          body: [
            "The double top resolves bearish more often than not, but it resolves bullish some of the time — the shape summarises the crowd's behaviour, and behaviour is probabilistic, never guaranteed. The same pattern that fails 40% of the time is still tradeable because the 60% pays more than the 40% costs, as long as the stop is respected. The pattern's power is not certainty; it is the tilt.",
            "The deeper layer: this is the sentence most pattern traders never fully believe — the edge lives in the aggregate, not the individual. One pattern trade can fail and still be the right decision, because the decision is judged by the distribution, not the single outcome. The professional trades the shape's bias with three guards: the break confirms the direction, the retest provides the entry, and the stop respects that this time might be the other 40%. The pattern never owes you anything; the process pays you over time — and only the trader who respects both survives long enough to collect."
          ],
          bullets: [
            "A pattern is a habit with a historical bias — never a guarantee",
            "The 60% pays more than the 40% costs, as long as the stop is respected",
            "One pattern trade can fail and still be the right decision",
            "The break confirms, the retest enters, the stop respects the other side"
          ],
          insight: "The pattern's power is the tilt, not the promise — and the process pays the trader who respects both sides."
        },
        {
          eyebrow: "Elite · The objective",
          title: "The Measured Move — The Target Zone",
          lead: "Every pattern has an arithmetic — the setup's height projected from the breakout — and the measured move gives the trade its objective, not its guarantee.",
          body: [
            "The head-and-shoulders' target is the head's depth projected from the neckline; the flag's target is the pole's height; the range's target is the box's height. The measured move is the pattern's projection — the zone the trade is managed toward, the objective that turns the entry into a plan with a destination. The projection is arithmetic; the destination is a zone, not a point.",
            "The deeper layer: the measured move is the management's tool, not the prophet's — the price may overshoot or fall short, and the professional treats the zone as the target with the partials and the trail doing the exit work, rather than worshipping the projection as the exact top or bottom. The objective also marks the risk-reward honesty: the trade whose measured move does not cover the stop's distance (at least twice) is a trade the projection has already rejected. The measured move is the pattern's arithmetic — and the trader who uses it for the management, not the prophecy, is the trader the projection serves."
          ],
          bullets: [
            "The measured move: the pattern's height projected from the breakout level",
            "The head's depth from the neckline, the flag's pole, the range's height — the arithmetic",
            "The destination is a zone, not a point — the price may overshoot or fall short",
            "The projection must cover the stop's distance — or the trade is already rejected"
          ],
          insight: "The measured move gives the trade its objective, not its guarantee — and the trader who uses it for the management, not the prophecy, is the trader the projection serves."
        },
        {
          eyebrow: "Elite · The fakeout",
          title: "The Fakeout — The Two-Sided Answer",
          lead: "Every level is tested before it breaks — and the difference between the test and the true break is decided after the fact, which is why the two-sided entry exists.",
          body: [
            "Breakout reality: not every break breaks. The market lures the trigger-happy through the level, stops them out, and reverses — the fakeout. The honest break is the close with follow-through and the respected retest; the fakeout is the stab that gets pulled back. The problem: at the moment of the break, you cannot know which one you are watching — the market's signature is only legible in hindsight.",
            "The deeper layer: the two-sided entry is the professional's answer to the unanswerable — place a buy-stop above the level and a sell-stop below it, and let the market's true break trigger one while the false one is cancelled. The trade admits what the amateur refuses to: you do not know in advance which break is real, and you do not need to. The machine's elegance is that you get paid for whichever side the market actually picks. The fakeout's real danger was never the fakeout — it was the trader's certainty before the break, and the two-sided entry converts that certainty into patience."
          ],
          bullets: [
            "Not every break breaks — the fakeout is the stab that gets pulled back",
            "At the moment of the break you cannot know which one you are watching",
            "The two-sided entry: both orders at the level, the market picks the side",
            "The fakeout's danger was the certainty before the break — not the fakeout"
          ],
          insight: "The true break is only legible in hindsight — so the professional places both orders and lets the market do the knowing."
        },
        {
          eyebrow: "Elite · The coil",
          title: "The Coil — The Triangle's Compression",
          lead: "A triangle is a coil — lower highs meeting higher lows, energy stored, release coming. The coil does not predict; it prepares.",
          body: [
            "The symmetrical triangle is pure compression: buyers and sellers fighting to a narrowing stalemate until the coil must release. The ascending triangle tilts the contest — resistance holding while higher lows form, the buyers' pressure building underneath. The descending triangle mirrors it — support holding while lower highs form, the sellers' weight pressing down. The compression is the setup; the release is the move; and the direction of the release is the market's decision, not the shape's.",
            "The deeper layer: the triangle's edge is in the context around it, never the shape alone — a coil inside an uptrend that breaks upward with the trend's permission is a continuation; the same coil at the end of a long move breaking down is a reversal. The apex is the deadline: triangles that resolve near the apex often produce weaker moves because the compression has run out of time, while early breaks carry the stored energy. The professional reads the coil as 'energy stored, release coming' — and lets the break, the retest and the higher-timeframe context name the direction."
          ],
          bullets: [
            "The symmetrical triangle is pure compression — energy stored, release coming",
            "Ascending: resistance holding, higher lows building underneath",
            "Descending: support holding, lower highs pressing down",
            "The release direction is the market's decision, named by the break and its context"
          ],
          insight: "The coil does not predict — it prepares — and the professional lets the break and the context name the direction."
        },
        {
          eyebrow: "Elite · The voices",
          title: "The Confluence — The Independent Voices",
          lead: "Not all evidence is equal — independent voices multiply conviction, while echoes repeat a single vote and call it five.",
          body: [
            "Confluence is multiple independent lines of evidence agreeing at the same level — a trendline, a value zone, a pattern neckline, a swing structure all pointing at the same price. Each independent voice is a vote, and the votes multiply rather than add: two weak independent reasons at the same level are worth more than five echoes of the same reason. The echo is the amateur's trap — five indicators all derived from the same price action are one vote dressed up as five.",
            "The deeper layer: the hierarchy of evidence matters as much as the count — structure (swings, levels, patterns) is the market's own record; indicators are derivatives of that record; sentiment and fundamentals are separate worlds. The professional counts the independent voices across those worlds and treats the level where they all speak as the level the market is most likely to respect. Confluence is not more indicators — it is fewer, independent, agreeing — and the level that different reasoning points at is the level worth waiting for."
          ],
          bullets: [
            "Independent voices multiply conviction; echoes repeat a single vote",
            "Two weak independent reasons beat five echoes of the same one",
            "Structure is the market's record; indicators are its derivatives",
            "Confluence is fewer, independent, agreeing — not more indicators"
          ],
          insight: "The level where different reasoning agrees is the level worth waiting for — and the echo dressed in five colours is the level worth skipping."
        },
        {
          eyebrow: "Elite · The hierarchy",
          title: "The Hierarchy — Structure First",
          lead: "The professional's hierarchy is fixed: the structure names the trade, and the indicator confirms it — and the indicator that disagrees with the structure is the indicator that is wrong.",
          body: [
            "The levels, the trend, the cycle — these are the chart's own evidence, the market's record of what it actually did. The indicators are the lenses that make one aspect of that record easier to see. When the two agree, the conviction multiplies; when they disagree, the hierarchy decides: the structure is the evidence, and the indicator is the lens — and the lens that contradicts the evidence is the lens being misread, not the evidence being wrong.",
            "The deeper layer: the hierarchy is the discipline that keeps the tools in their place — the RSI's overbought cannot cancel the intact trend, the divergence cannot override the respected support, the squeeze cannot replace the drawn levels. The professional reads the indicator as the structure's corroboration: the signal that agrees with the levels and the trend is the signal worth taking, and the signal that fights them is the signal worth skipping, whatever the number says. The structure first is not a rule against the tools — it is the rule that makes them useful, and the trader who keeps the order reads the chart in full."
          ],
          bullets: [
            "The structure names the trade; the indicator confirms it",
            "The disagreement is decided by the hierarchy — the evidence outranks the lens",
            "The indicator that fights the structure is the signal worth skipping",
            "Structure first is the rule that makes the tools useful"
          ],
          insight: "The hierarchy is the discipline that keeps the lenses in their place — and the trader who keeps the order reads the chart in full."
        },
        {
          eyebrow: "Elite · The where and when",
          title: "The Value and the Trigger",
          lead: "The zone tells you WHERE to trade; the trigger tells you WHEN. Conflating them is how traders enter early and get stopped by the level's first probe.",
          body: [
            "The value zone is the area where price is cheap relative to the move — the support in an uptrend, the resistance in a downtrend, the pattern's measured target. The trigger is the visual clue that the level is actually working right now — the rejection candle, the retest bounce, the breakout close. Reaching the zone is not permission to enter; the zone is where the trade SHOULD be taken if the market confirms, and the trigger is the confirmation.",
            "The deeper layer: the amateur conflates the two and enters at the level early, only to get stopped by the zone's first probe — price reaches the value, the trader jumps in, and the level's test (the wick, the shakeout) takes the stop before the real move. The professional accepts a slightly worse price for a much better probability: the level AND the trigger, the where and the when, both respected. The zone sets the stage; the trigger raises the curtain; and the trade that honours both is the trade that survives the level's tests — the trade that honours only the zone is the trade the zone was testing."
          ],
          bullets: [
            "The value zone is WHERE — cheap relative to the move",
            "The trigger is WHEN — the visual clue the level is working",
            "Entering at the zone without the trigger is how the level's first probe takes your stop",
            "A slightly worse price for a much better probability is the professional's trade"
          ],
          insight: "The zone sets the stage and the trigger raises the curtain — and the trade that honours both survives the level's tests."
        },
        {
          eyebrow: "Elite · The paragraph",
          title: "The Phase — The Pattern's Context",
          lead: "The same pattern means different things in different phases — because the phase is the paragraph the pattern's sentence lives in, and the context decides the meaning.",
          body: [
            "The continuation pattern inside a mark-up is the trend's fuel — the pattern's direction agrees with the phase, and the meaning is continuation. The same pattern at the end of a long move is the reversal's setup — the phase is aging, and the pattern's direction is the counter-trend warning. The triangle, the flag, the head and shoulders — every shape is a sentence, and the phase is the paragraph that decides what the sentence means.",
            "The deeper layer: this is where the Academy's chapters connect — the cycle (Chapter 11) and the chart (Chapter 13) read the same price in two languages, and the professional reads both: the pattern tells you the crowd's local behaviour, the phase tells you what that behaviour means. The buy signal inside the distribution is a counter-trend trade; the same signal inside the mark-up is a continuation — same candle, opposite meaning, decided by the paragraph. The trader who skips the phase trades the shape blind, and the trader who reads the paragraph trades the shape with its meaning."
          ],
          bullets: [
            "The pattern is a sentence; the phase is the paragraph",
            "The continuation inside a mark-up is fuel; the same shape at the top is the reversal's setup",
            "The cycle and the chart read the same price in two languages",
            "The context decides the meaning — the trader who skips the phase trades blind"
          ],
          insight: "The pattern is a sentence and the phase is its paragraph — and the trader who reads the paragraph trades the shape with its meaning."
        },
        {
          eyebrow: "Elite · The plan",
          title: "The Four Lines — The Plan",
          lead: "The chart suggests; the plan decides. Bias, value, trigger and management — the four lines that turn a pattern into a position.",
          body: [
            "The professional's plan has four lines before the order exists: the bias (the direction the structure and higher timeframe favour), the value (the zone where the trade should be taken), the trigger (the visual clue that the level is working), and the management (the stop, the target, and what happens if the market disagrees). Drawn before the entry, the four lines are the trade's constitution; drawn during the trade, they are the trader's excuses.",
            "The deeper layer: the four lines exist to make the decision before the emotion does — the moment price reaches the zone, the amateur is deciding whether to enter; the professional already decided, and the trigger is the only remaining question. The plan's real power is not the direction it picks but the questions it answers in advance: where am I wrong (the stop), where do I get paid (the target), and what do I do if the market changes its mind (the plan for the plan). The chart is the market's suggestion; the plan is the trader's answer — and the trader with the answer before the question arrives is the trader who never has to improvise under pressure."
          ],
          bullets: [
            "Four lines: bias, value, trigger, management — drawn before the order exists",
            "The plan exists so the decision is made before the emotion arrives",
            "Where am I wrong, where do I get paid, what if the market changes its mind",
            "The chart is the suggestion; the plan is the answer"
          ],
          insight: "The plan is the trade's constitution — drawn before the emotion arrives, and never rewritten while the trade is open."
        },
        {
          eyebrow: "Elite · The record",
          title: "The Journal — The Technical Record",
          lead: "The chart teaches through review — and the review only works if the journal records what the chart actually showed, before the outcome edited the memory.",
          body: [
            "The technical journal entry records the setup before it resolves: the condition (trend or range), the level (the value zone), the trigger (which clue fired), the confluence (which independent voices agreed), the stop and target (where the thesis was wrong and where it got paid), and the screenshot of the entry. Written before the outcome, the record is honest; written after, it is hindsight wearing a lab coat.",
            "The deeper layer: the journal is where technical analysis becomes a science instead of a hobby — because patterns only reveal their true bias across many recorded entries, and the review is the only place the bias becomes visible. The professional reviews the batch, not the single trade: which conditions did the pattern actually pay in? Which levels produced the cleanest retests? Which confluence made the difference? The pattern's edge is invisible in one trade and unmistakable in fifty — and the journal is the only instrument that can see fifty. The chart teaches anyone who watches; the journal teaches the trader who records."
          ],
          bullets: [
            "Record the setup before it resolves — condition, level, trigger, confluence, stop, target",
            "Written after the outcome, the entry is hindsight wearing a lab coat",
            "The pattern's bias is invisible in one trade and unmistakable in fifty",
            "The chart teaches anyone who watches; the journal teaches the trader who records"
          ],
          insight: "The journal is the only instrument that can see fifty trades at once — and the pattern's true bias lives in the fifty, never the one."
        },
        {
          eyebrow: "Elite · The identity",
          title: "The Chart Identity",
          lead: "After the language, the lines, the patterns and the plan — the only thing that survives contact with a live market is the trader who reads the chart as the crowd's fingerprint and waits for the alignment.",
          body: [
            "The market does not care how many patterns you can name, how precisely you draw your levels, or how certain you feel about a direction. It cares what you do when the level is tested, when the fakeout sweeps the break, when the phase turns against the pattern, when the trigger never fires — and the trader who reads the chart as the crowd's fingerprint, who waits for the alignment of the structure, the pattern, the confluence and the plan, is the one the language eventually pays.",
            "The deeper layer: this is the capstone of the whole Academy — thirteen chapters of tools, and the final skill is the discipline to use them only when they align and to follow the plan when they do. The trader who needs the chart to move in their favour is the market's customer; the trader who reads the crowd's fingerprint and stands on the quiet side of the alignment — the side where the evidence agrees — is the one the machine rewards. The chart has been recording the crowd since the first candle was drawn, and it will record it long after every chart in this academy is forgotten — the only question is whether you learn to read the fingerprint or keep getting read by the crowd."
          ],
          bullets: [
            "The market rewards the trader who waits for the alignment",
            "Read the chart as the crowd's fingerprint — the structure, the pattern, the confluence, the plan",
            "The final skill is the discipline to use the tools only when they align",
            "Learn to read the fingerprint — or keep getting read by the crowd"
          ],
          insight: "The chart has recorded the crowd since the first candle — and the only question is whether you read the fingerprint or get read by the crowd."
        },
        {
          eyebrow: "Elite · The discipline",
          title: "The Discipline of the Chart",
          lead: "Every tool in this chapter is a language — and like every language, it speaks to the trader who reads it calmly and lies to the trader who demands it predict.",
          body: [
            "Technical analysis is a probability language, not a crystal ball — it tells you what the crowd is doing and where behaviour historically stalls, and it never tells you the future with certainty. The trader who demands prediction from the chart will find it — in every pattern, every level, every indicator that 'confirms' what they already wanted — and will pay for that confirmation with the losses the market reserves for certainty. The trader who reads the language calmly accepts the probability and manages the risk.",
            "The deeper layer: this is the chapter's final test, and it is not technical — it is psychological. The discipline of the chart is waiting for the alignment (the condition, the level, the trigger, the confluence all agreeing), and then following the plan without editing it mid-trade. The market's greatest weapon against the technical trader is boredom — the impatience that turns 'the pattern is not there yet' into 'close enough'. The trader who can wait for the chart's sentence to complete, and then obey it, is the trader the language actually serves — the trader who skips the waiting trades the alphabet and calls it reading."
          ],
          bullets: [
            "TA is a probability language, never a crystal ball",
            "The trader who demands prediction will find confirmation — and pay for it",
            "The discipline is waiting for the alignment, then following the plan without editing",
            "The market's weapon against the technical trader is boredom"
          ],
          insight: "The language speaks to the trader who reads it calmly — and lies to the trader who demands it predict."
        },
        {
          kind: "pause",
          eyebrow: "Elite · Breathe",
          title: "Reset Before the Test",
          lead: "You've just opened the language's machinery — the line's construction, the touches' tally, the wick's test, the retest's proof, the flip's receipt, the pattern's probability, the measured move, the fakeout's two-sided answer, the coil, the independent voices, the hierarchy, the where and the when, the phase's paragraph, the plan's four lines and the journal's honesty. Close your eyes for one breath — in for four, out for four — and let the language settle.",
          body: [
            "The next ten questions are the Elite gate: the trendline's tally, the pattern's bias, the measured move, the confluence of voices, the break and the retest, the value and the trigger, and the chart identity. They assume you can read the language, not just the names. Take the breath. Then prove it."
          ]
        },
        null, null, null, null, null, null, null, null, null, null,
        {
          kind: "close",
          eyebrow: "Elite chapter complete",
          title: "You Speak the Language",
          body: [
            "You entered as a collector of chart names and leave as a speaker of the language: the line's construction, the touches' tally, the wick's test, the retest's proof, the flip's receipt, the pattern's probability, the measured move, the fakeout's two-sided answer, the coil, the independent voices, the hierarchy, the where and the when, the phase's paragraph, the plan's four lines and the journal's honesty.",
            "This is the Elite difference: not more chart tools, but the language they are all written in. You've earned the capstone. Finish the gate, and the Academy's thirteen chapters are yours — every lane, every tier, complete."
          ]
        }
      ]
    }
};
module.exports = C;