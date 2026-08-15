const C = {
    elite: {
      slides: 30,
      quizSlides: [20,21,22,23,24,25,26,27,28,29],
      quiz: [
        { q: "A candle's range is 20 pips with a body of 6 and an upper wick of 12. The lower wick must be…",
          options: ["2 pips", "8 pips", "12 pips", "6 pips", "14 pips"], answer: 0,
          explain: "Range = body + upper wick + lower wick → 20 = 6 + 12 + lower → lower = 2. The anatomy is arithmetic: body, upper wick and lower wick must sum exactly to the range. The deeper layer: a candle with almost no lower wick near support is a tell — the rejection that would confirm the level isn't there, and the level's test is still unresolved." },
        { q: "A doji appears after a long rally with an open and close at the same price. The professional's read is…",
          options: ["Nothing yet — the doji is indecision, and its meaning depends on the level it forms at, the wicks' length, and what follows", "A certain top", "A certain continuation", "A sign to double the position", "A pause that always resumes the trend"], answer: 0,
          explain: "The doji is pure indecision — buyers and sellers fought to a draw. Whether that draw becomes a top depends entirely on context: a doji under resistance after exhaustion is a warning; a doji in the middle of a trend is a pause; and the confirmation is what follows the doji, never the doji itself. The deeper layer: the doji is the market holding its breath — the professional reads the breath, then waits for the exhale." },
        { q: "An engulfing pattern's reliability depends most on…",
          options: ["The colour of the candles", "The context — a first candle that is exhausted (small, near a level, after a long move) and a second candle that closes beyond the first's full range, with volume confirming", "The number of wicks", "The timeframe alone", "The size of the first candle's shadow"], answer: 1,
          explain: "An engulfing candle is a transfer of control — the second candle's body swallows the first's entirely. Its power comes from the context: an exhausted first candle (the move running out of fuel) and a second candle that not only covers the range but closes beyond it, ideally with volume. The deeper layer: the same engulfing candle at the top of a trend and in the middle of a range are different instruments — the shape is the vocabulary, the context is the sentence." },
        { q: "Long upper wicks under resistance at the end of an uptrend repeatedly form. This accumulation of evidence says…",
          options: ["The buyers are winning", "Sellers are rejecting every rally attempt at the level — supply is defending the ceiling, and each long wick is a failed test", "The market is broken", "Nothing can be read from wicks", "The sellers are running out of supply"], answer: 1,
          explain: "Repeated long upper wicks under a resistance are the sellers' signature: price is pushed up, then rejected back down, each time — the supply at the level is absorbing every attempt. The deeper layer: one wick is noise, a series of wicks at the same level is a story — the ceiling is defended, and the pattern that forms (double top, head and shoulders) is the story's conclusion. The professional waits for the series, not the single candle." },
        { q: "A gap in forex between Friday's close and Monday's open most often reflects…",
          options: ["Market manipulation", "News or events that moved the market while it was closed — the gap is the price's honest jump to where the new information priced it", "A broker error", "Random noise with no meaning", "A calculation mistake by the exchange"], answer: 1,
          explain: "Forex gaps happen when the market is closed (weekend) and information arrives — the new session opens where the news priced the market, not where the old session ended. The deeper layer: a gap is the market's admission that the last close was stale — the professional treats gaps as information about what happened while the lights were off, and checks the weekend news before assuming the gap is a pattern signal." },
        { q: "Two identical bullish engulfing candles appear — one at a support level in an uptrend, one mid-range. The first is more meaningful because…",
          options: ["Colour matters more than location", "The level and the trend give the candle its vote — the same shape at a defended support inside an uptrend is a pullback buying signal, while mid-range it is noise with nowhere to go", "The first was drawn first", "Timeframes are identical", "The candles are exactly the same size"], answer: 1,
          explain: "The candle is the vocabulary; the level and the trend are the sentence. An engulfing candle at a support that the trend respects is the buyers taking control at the exact place where control matters; the same candle mid-range has no level to defend and no structure to confirm. The deeper layer: this is why the professional reads the chart before the candle — the shape tells you what happened, the context tells you what it means, and the same shape can be a signal in one place and static in another." },
        { q: "A candle closes strong and bullish at the day's high, but the next session opens flat and stalls. The professional's read is…",
          options: ["The bullish candle is invalidated — the follow-through failed, and the stall means the move's buyers didn't arrive", "The bullish candle is stronger now", "Nothing changed", "Sell immediately", "The stall confirms the bullish candle"], answer: 0,
          explain: "A strong close without follow-through is a story without a second chapter — the buyers who pushed the close didn't return, and the stall marks the move's energy failing. The deeper layer: the candle is a single sentence; the follow-through is the paragraph. The professional treats a candle as a claim, and the next candle as the market's answer — a claim that is never answered is a claim that was never believed, and the stall is the answer that matters more than the claim itself." },
        { q: "The most valuable skill for reading candles is…",
          options: ["Memorising every pattern name", "Reading the candle's context — the level it forms at, the trend it sits in, the wicks it leaves, and the follow-through that answers it", "Using the most candles per screen", "Trading only dojis", "Reading candles on the highest timeframe"], answer: 1,
          explain: "Every candle is a vote, and the vote's meaning lives in the context: the level, the trend, the wicks, the follow-through. Memorising pattern names without reading context is learning vocabulary without learning the language — you can name every shape and still misread every chart. The deeper layer: the professional's edge is not knowing more patterns; it is reading the few patterns they know in their full context — and the trader who reads context can trade with a handful of candles where the pattern-collector drowns in a thousand." },
        { q: "A hammer with a long lower wick forms at support. The confirmation the professional waits for is…",
          options: ["The next candle closing bullish — the rejection proven by follow-through, not by the hammer alone", "Nothing — the hammer is complete", "The hammer's wick retracing fully", "A second hammer", "Volume dropping to zero"], answer: 0,
          explain: "The hammer at support is the claim — the buyers rejected the low. The confirmation is the next candle closing in the buyers' direction, proving the rejection held. The deeper layer: the hammer alone is a photograph of a moment; the follow-through is the market continuing to move after that moment, and only the continuation distinguishes a real reversal from a single candle of hope. The professional buys the hammer only when the market answers it — the claim and the confirmation, never the claim alone." },
        { q: "The candle's real message to the professional is…",
          options: ["The future price", "A record of the crowd's behaviour in that period — who controlled the session, how far they pushed, and what got rejected — which is why the same candle means different things in different places", "The news that caused it", "The broker's fill", "The exact price of the next session's open"], answer: 1,
          explain: "A candle is a behavioural record: the open (where the session began), the high and low (how far the crowd pushed in each direction), the close (who won), and the wicks (what got rejected). Because it records behaviour, its meaning is contextual — the same shape in a trend, at a level, or in a range tells three different stories. The deeper layer: the professional reads the candle as history, not prophecy — the record of what the crowd did is the raw material for what the crowd will do, because behaviour repeats at the same levels in the same conditions." }
      ],
      native: [
        {
          eyebrow: "Elite · The anatomy",
          title: "The Candle as a Behavioural Record",
          lead: "The Standard chapter taught you to name candles. This lane teaches you to read the behaviour behind them — the open as the session's starting opinion, the wicks as the rejected attempts, the close as the verdict, and the anatomy as arithmetic.",
          body: [
            "Every candle is four numbers that tell one story: who started, how far each side pushed, what got rejected, and who won. The anatomy is exact — the range equals the body plus the upper and lower wicks — and the proportions are the behaviour: a small body with long wicks is a fight; a long body with no wicks is a rout; a doji is a draw.",
            "This lane takes the candle apart, piece by piece, and puts it back together inside the context that gives it meaning."
          ],
          bullets: [
            "The anatomy is arithmetic: range = body + upper wick + lower wick",
            "Wicks are the rejected attempts; the body is the winning side's ground",
            "A candle is a record of behaviour, not a prediction of price",
            "The same candle means different things in different contexts"
          ],
          insight: "Name the candle once, read the behaviour forever — the anatomy is the grammar of the chart."
        },
        {
          eyebrow: "Elite · The open",
          title: "The Open — The Session's Starting Opinion",
          lead: "The open is not a line on a chart — it is the crowd's starting opinion, the price at which the previous session's story handed over to the next.",
          body: [
            "Every new session opens where the crowd currently agrees price is worth — the open is the market's handover note. A gap open tells you the news moved the crowd while the market was closed; a flat open tells you nothing changed hands overnight; and the distance between the open and the close is the session's entire contest, compressed into one number.",
            "The deeper layer: the open is where the market commits to a new day, and the professional reads it as the day's first piece of evidence — the open above yesterday's close says the overnight sentiment is bullish, the open below says bearish, and the open that ignores a weekend of news says the news did not matter. The candle's story starts at the open, and the trader who skips the opening line reads the story from the middle."
          ],
          bullets: [
            "The open is the crowd's starting opinion — the handover from the last session",
            "A gap open is the news moving the crowd while the market was closed",
            "The open-to-close distance is the session's contest, compressed",
            "Read the open as the day's first piece of evidence"
          ],
          insight: "The story starts at the open — and the trader who skips the opening line reads the rest of the day from the middle."
        },
        {
          eyebrow: "Elite · The body",
          title: "The Body — The Winning Side's Ground",
          lead: "The body is where the contest was actually won — the ground the winning side held from open to close, and its size tells you how decisive the win was.",
          body: [
            "A long body with small wicks is a rout — one side controlled the session from open to close, and the losers barely fought back. A small body with long wicks is a war — both sides pushed hard, and the winner won by a hair. The body's size, relative to the range, is the session's margin of victory.",
            "The deeper layer: the body is the only part of the candle that represents held ground — the wicks were visited and abandoned, the body was defended. The professional reads the body's proportion to the range (the candle's 'real body ratio') to separate decisive sessions from contested ones: a big body at a breakout says the break was real; a big body at a level's first test says the level may not survive a second test. The body is the winner's territory, and its size is the winner's confidence."
          ],
          bullets: [
            "The body is the ground the winner held from open to close",
            "Long body, short wicks: a rout. Small body, long wicks: a war",
            "The body's proportion to the range is the session's margin of victory",
            "Big bodies at breaks are conviction; big bodies at first tests are invitations"
          ],
          insight: "The body is the winner's territory — and its size is the winner's confidence, measured against the range it conquered."
        },
        {
          eyebrow: "Elite · The wicks",
          title: "The Wicks — The Rejected Attempts",
          lead: "Every wick is a failed expedition — a price that was visited, fought over, and abandoned. The wicks are where the market tells you what it tried and refused.",
          body: [
            "The upper wick is the distance the buyers pushed price before the sellers pushed it back; the lower wick is the sellers' push before the buyers reclaimed it. A long upper wick under resistance is the sellers rejecting each rally; a long lower wick above support is the buyers defending the floor. The wick is the record of the attempt AND the rejection, in one line.",
            "The deeper layer: wicks are the market's honesty — the body can be engineered by a burst of late activity, but the wick shows where price actually went and could not stay. The professional reads the wicks as the levels' tests: a long upper wick under a resistance is the level's defenders proving themselves, a long lower wick at support is the floor's buyers proving themselves — and a series of wicks at the same level is the market's habit, which is the closest thing the chart has to a promise."
          ],
          bullets: [
            "Every wick is an attempt and a rejection, in one line",
            "Upper wicks are the buyers' pushes rejected; lower wicks are the sellers' pushes rejected",
            "A series of wicks at a level is the market's habit",
            "Wicks show where price went and could not stay — the body can be engineered, the wick cannot"
          ],
          insight: "The wick is the market's honesty — the record of where it tried and refused, and the habit it keeps at every level it respects."
        },
        {
          eyebrow: "Elite · The close",
          title: "The Close — The Verdict",
          lead: "The close is the only part of the candle the market has already decided — and the verdict it renders decides how the next session begins.",
          body: [
            "The close is the settlement: after all the pushing and rejecting, this is the price the crowd finally agreed on. A strong close at the high is the buyers ending the session in control; a close that fades from the high is the sellers reasserting at the bell. The close matters more than any other part of the candle because it is the price that carries into the next open.",
            "The deeper layer: the close is the verdict because it is the settlement — the wicks and the body describe the fight, but the close is the outcome that gets carried forward. A candle that closed strong but is followed by a flat open is a verdict the market has already appealed; a candle that closed weak and is followed by a continuation of the weakness is a verdict being enforced. The professional reads the close as the session's last word — and the next session's first evidence."
          ],
          bullets: [
            "The close is the settlement — the price the crowd finally agreed on",
            "A close at the high is control; a close faded from the high is reassertion",
            "The close carries into the next open — it is the only part of the candle that travels",
            "A strong close without follow-through is a verdict the market has appealed"
          ],
          insight: "The close is the session's last word — and the next session's first evidence, carried forward at the open."
        },
        {
          eyebrow: "Elite · The doji",
          title: "The Doji — The Market Holding Its Breath",
          lead: "A doji is pure indecision — the open and close at the same price, a draw in a contest where nobody won. Its meaning is entirely a question of what comes next.",
          body: [
            "When the open and close are equal, the session ended where it began — the buyers and sellers fought and cancelled each other out. Whether that draw is a top, a pause or a spring depends on the context: a doji under resistance after a long rally is the rally's fuel running out; a doji in the middle of a trend is the trend catching its breath; a doji at support is the market waiting to see who blinks.",
            "The deeper layer: the doji is the market holding its breath — and the professional's job is to wait for the exhale, never to guess its direction from the doji alone. The long-legged doji (long wicks both sides) is the most honest — both sides pushed hard and both were rejected — and the gravestone doji at a top is the sellers' last stand made visible. The doji is not a signal; it is a silence, and the trader who respects the silence reads the next candle with full attention."
          ],
          bullets: [
            "The doji is a draw — the session ended where it began",
            "Its meaning is entirely contextual: top, pause or spring",
            "The long-legged doji is the most honest — both pushes rejected",
            "The doji is a silence — respect it, and read the exhale"
          ],
          insight: "The doji is the market holding its breath — and the trader who waits for the exhale instead of guessing it reads the next candle correctly."
        },
        {
          eyebrow: "Elite · The engulfing",
          title: "The Engulfing — Control Transferred",
          lead: "An engulfing candle is a transfer of control — the second candle's body swallows the first's entirely, and the market changes hands in a single session.",
          body: [
            "For a bearish engulfing, the second candle's body must fully cover the first candle's body — not just the range — and it should appear after an exhausted move. The coverage is the point: the sellers didn't just win the session, they erased the previous session's entire ground. The bigger the first candle's exhaustion (small body, near a level, after a long move), the more meaningful the transfer.",
            "The deeper layer: the engulfing is the market's most theatrical transfer of control — it announces the change in one candle instead of many. The professional reads it with two guards: context (an engulfing at a level with the trend's permission is a signal; mid-range it is noise) and confirmation (the next candle should continue the new direction). The shape is the announcement; the follow-through is the enforcement — and the trader who trades the announcement without waiting for the enforcement buys the transfer that never happened."
          ],
          bullets: [
            "The second body must cover the first body — the ground is erased",
            "An exhausted first candle makes the transfer meaningful",
            "Context decides: at a level with permission it is a signal; mid-range it is noise",
            "The shape is the announcement; the follow-through is the enforcement"
          ],
          insight: "The engulfing announces the transfer in one candle — and the trader who waits for the enforcement buys transfers that actually happened."
        },
        {
          eyebrow: "Elite · The hammer",
          title: "The Hammer — The Rejection Made Visible",
          lead: "The hammer is the buyers' rejection frozen in a candle — the long lower wick is the fall that was refused, and the small body is the ground the buyers defended.",
          body: [
            "A hammer at support: the sellers pushed price far down, and the buyers pushed it back to near the open — the long lower wick records the rejected fall, and the small body records the reclaimed ground. The hammer's message is one of defence, not attack: the buyers did not win the session; they refused to lose it. That is why the hammer is a warning of a possible bottom, not a guarantee of one.",
            "The deeper layer: the hammer is a photograph of a moment — and the professional treats photographs as evidence, not as outcomes. The confirmation is the next candle closing in the buyers' direction, proving the rejection held. The hammer at support in an uptrend (a pullback being defended) is the strongest version; the hammer mid-range is a candle with nowhere to go. The rejection is the claim; the follow-through is the proof — and the trader who buys the claim without the proof is buying hope with a wick."
          ],
          bullets: [
            "The long lower wick is the fall that was refused",
            "The hammer is defence, not attack — the buyers refused to lose",
            "The hammer is a warning of a possible bottom, not a guarantee",
            "The claim is the rejection; the proof is the next candle's follow-through"
          ],
          insight: "The hammer is the rejection frozen in a candle — and the rejection is only a claim until the next session enforces it."
        },
        {
          eyebrow: "Elite · The context",
          title: "The Candle in Context — Vocabulary, Not Prophecy",
          lead: "The same candle is a signal in one place and static in another — because the candle is the vocabulary, and the level, the trend and the follow-through are the sentence.",
          body: [
            "A bullish engulfing at a defended support inside an uptrend is a pullback buying signal; the identical candle mid-range is noise with nowhere to go. A doji under resistance after exhaustion is a top warning; the same doji in the middle of a trend is a pause. The candle describes what happened; the context decides what it means — and the trader who reads candles without context is reading vocabulary without grammar.",
            "The deeper layer: this is the single most important lesson in candle reading, and it is why the professional studies the chart before the candle: the level (where is price?), the trend (which phase is running?), and the follow-through (did the market answer the candle?). Three questions turn a shape into a signal. The pattern-collector who memorises fifty shapes without the three questions will be beaten by the trader who knows five shapes and reads them inside their full sentence — because the market pays comprehension, not collection."
          ],
          bullets: [
            "The candle is the vocabulary; the level, trend and follow-through are the sentence",
            "The identical candle is a signal in one place and static in another",
            "Three questions: where is price, which phase is running, did the market answer?",
            "The market pays comprehension, not collection"
          ],
          insight: "Five candles read in context beat fifty memorised without it — the market pays the trader who reads the sentence, not the one who collects the words."
        },
        {
          eyebrow: "Elite · The session",
          title: "Session Candles — The Timeframe's Accent",
          lead: "The same market produces different candles in different sessions — because the participants change with the clock, and the candle is the participant's handwriting.",
          body: [
            "The London open's candles are fast, wide and decisive — the institutional flow arriving. The Asian session's candles are slower and thinner — the quiet handover. The New York close's candles are the settlement — position books squaring, the day's story being written. The same trend produces different candles in each session, and the professional reads the candle WITH the session clock, not against it.",
            "The deeper layer: session awareness is context you can schedule — the professional knows that the breakout at the London open is a different instrument than the same shape at the Asian close, because the liquidity underneath is different. A hammer at the Asian close is the quiet market's indecision; the same hammer at the London open is the institutional flow rejecting a level. The candle is the participant's handwriting — and the professional reads the handwriting of the participants who are actually in the room."
          ],
          bullets: [
            "London opens fast and wide; Asia is slow and thin; New York closes the story",
            "The candle is the participant's handwriting — read who is in the room",
            "Session awareness is context you can schedule",
            "The same shape at a different session is a different instrument"
          ],
          insight: "The clock changes the participants, and the participants change the candle — read the session before you read the shape."
        },
        {
          eyebrow: "Elite · The series",
          title: "Candles in Series — The Story, Not the Frame",
          lead: "One candle is a frame; a series of candles is the film. The market's real message is written across many candles, and the professional reads the film, not the frame.",
          body: [
            "The single candle tells you about one session; the series tells you about the war — higher closes building the uptrend, shrinking bodies signalling exhaustion, wicks stacking under a resistance telling the story of a defended level. The patterns you already know — double tops, head and shoulders, triangles — are series of candles compressed into one readable shape, and their power comes from the series, not any single frame.",
            "The deeper layer: the series is where behaviour becomes visible — one long wick is noise, three long wicks at the same level is a habit, and the habit is the closest thing the chart has to a promise. The professional reads the series the way a doctor reads a pulse — not by the strength of any single beat but by the rhythm's health across many. The candle asks the question; the series answers it — and the trader who reads frame by frame is surprised by every turn the film takes."
          ],
          bullets: [
            "One candle is a frame; a series of candles is the film",
            "Shrinking bodies, stacking wicks — the series tells the story of exhaustion",
            "Patterns are series compressed into one readable shape",
            "The series answers the question the single candle asks"
          ],
          insight: "The market's real message is written across many candles — and the trader who reads only the frame misses the film."
        },
        {
          eyebrow: "Elite · The gap",
          title: "Gaps — The Market's Honest Jump",
          lead: "A gap is not a glitch — it is the market's admission that the last close was stale, and the price jumped to where the new information actually priced it.",
          body: [
            "Forex gaps are rare but real: the market closes Friday, news arrives, and Monday opens where the news priced the market — not where Friday ended. The gap is the honest jump between the stale close and the new reality. The professional reads the gap as information about what happened while the lights were off, and checks the weekend's news before assuming the gap is a pattern signal.",
            "The deeper layer: the gap is the market's most direct communication — it skips the negotiation and states the new price. The gap's message is the direction and the size: a large gap tells you the news was large, and the follow-through (does the gap hold or fill?) tells you whether the news will last. The professional treats the gap as the first candle of the new story — the level it leaves behind becomes the new support or resistance, and the way price treats that level is the market's verdict on the news."
          ],
          bullets: [
            "The gap is the market's honest jump from the stale close to the new reality",
            "Read the gap as information about what happened while the lights were off",
            "The gap's size tells you the news's size",
            "The level the gap leaves behind becomes the new support or resistance"
          ],
          insight: "The gap skips the negotiation and states the new price — and the way the market treats the level it left behind is the verdict on the news."
        },
        {
          eyebrow: "Elite · The market's memory",
          title: "Levels and the Candle's Recollection",
          lead: "Price returns to the levels where candles left their mark — because the candles recorded the crowd's behaviour there, and behaviour at the same level tends to repeat.",
          body: [
            "A level where the market reversed three times has three candles' worth of memory: the wicks that recorded the rejection, the bodies that confirmed the defence, the series that told the story. When price returns to that level, the market's memory is already written — the traders who defended it remember, the traders who were stopped remember, and the behaviour tends to repeat at the level that carries the history.",
            "The deeper layer: this is why the professional studies the candles that formed a level before trading it — the level is only as strong as the candles that made it. A level defended with small bodies and long rejecting wicks is a level the market cares about; a level reached once with a single thin candle is a level with no memory. The candle is the level's witness — and the trader who reads the witness before trading the level is reading the market's own case file."
          ],
          bullets: [
            "Levels carry the memory of the candles that formed them",
            "Three rejections at a level is a habit — behaviour tends to repeat there",
            "The level is only as strong as the candles that made it",
            "The candle is the level's witness — read the case file before trading the level"
          ],
          insight: "Price returns to the levels where candles left their mark — and the trader who reads the witness before the trade reads the market's own case file."
        },
        {
          eyebrow: "Elite · The structure",
          title: "Candles and Structure — The Two-Language Chart",
          lead: "The candle and the structure speak the same market in two languages — and the professional reads both, because each one catches what the other misses.",
          body: [
            "The structure (swings, higher highs, higher lows) tells you the trend's direction and health; the candle tells you the contest within each swing — who pushed, who rejected, who won. A bullish structure with weakening candles is a trend losing its fuel; a ranging structure with strong breakout candles is a trend about to begin. The two languages confirm and contradict, and the contradiction is the information.",
            "The deeper layer: the professional uses the structure to set the context and the candle to time the entry — the structure says 'we are in an uptrend at support', the candle says 'and the buyers just rejected the level with a hammer and follow-through'. The structure is the map; the candle is the moment; and the trader who reads only one language is half-blind — the structure without the candle enters too early, and the candle without the structure enters without a context to trust."
          ],
          bullets: [
            "The structure tells the direction; the candle tells the contest",
            "A bullish structure with weakening candles is a trend losing fuel",
            "The structure is the map; the candle is the moment",
            "Each language catches what the other misses — read both"
          ],
          insight: "The structure sets the context and the candle times the entry — and the trader who reads only one language enters with half the evidence."
        },
        {
          eyebrow: "Elite · The conviction",
          title: "The Long Wicked Series — Supply's Signature",
          lead: "Repeated long upper wicks at the same level are not bad luck — they are a defended ceiling, and the series is the sellers' signature.",
          body: [
            "When price rallies to a level and is rejected with a long upper wick, then rallies again and is rejected again with another long wick, the series is telling you the supply at the level is real: the sellers are absorbing every attempt. One wick is noise; the series is a story — and the story usually concludes with a pattern (double top, head and shoulders) and a break that finally ends the contest.",
            "The deeper layer: the professional treats the series of wicks as evidence that the level is being defended with intent — and trades the defence rather than the hope. The pattern that forms is the story's conclusion; the break of the level with follow-through is the end of the defence. The trader who waits for the series (instead of trading the first wick) sees the defence before it concludes; the trader who waits for the break sees the end. Both are correct — the difference is whether you enter with the defence's permission or after its defeat."
          ],
          bullets: [
            "Repeated long upper wicks at a level are a defended ceiling",
            "One wick is noise; the series is a story",
            "The pattern that forms is the story's conclusion",
            "Trade the defence with its permission, or after its defeat — know which you are doing"
          ],
          insight: "The long wicked series is the sellers' signature — and the trader who reads the signature sees the defence before it concludes."
        },
        {
          eyebrow: "Elite · The counter",
          title: "The Counter-Signal — When the Candle Contradicts",
          lead: "The most expensive candle is the one that looks like a signal and is the opposite — and the professional's defence is the contradiction itself.",
          body: [
            "A bullish engulfing at a resistance that the trend has respected all day is a trap wearing a signal's clothes — the shape says buyers, the context says sellers, and the contradiction is the truth. The candle that contradicts the structure, the level and the trend is the market's most expensive offer, because it looks like everything the beginner wants and is the opposite of everything the professional needs.",
            "The deeper layer: the professional treats contradictions as the market's honesty — when the candle disagrees with the context, the context is usually right, because the context is built from many candles while the signal is built from one. The rule: never trade a candle against the structure, the level and the trend all at once; the single candle is the weakest evidence on the chart, and the trader who lets one candle outvote the entire structure is the trader the one candle was designed to catch."
          ],
          bullets: [
            "The candle that contradicts the context is the market's most expensive offer",
            "The context is many candles; the signal is one — the many usually win",
            "Never trade one candle against the structure, the level and the trend at once",
            "Contradictions are the market's honesty — read them as such"
          ],
          insight: "The most expensive candle is the one that looks like a signal and is the opposite — and the contradiction, read honestly, is the defence."
        },
        {
          eyebrow: "Elite · The decision",
          title: "The Candle's Final Question",
          lead: "Every candle, read completely, answers one question — and the question is not 'what will price do' but 'who is in control, and did the market agree?'",
          body: [
            "Read the candle completely and you have its whole story: the open told you where the session began, the body told you who won and by how much, the wicks told you what was tried and rejected, the close told you the settlement, and the follow-through told you whether the market agreed. The final question — who is in control, and did the market agree — is the only question that survives contact with a live chart.",
            "The deeper layer: this is the candle's discipline — every candle is a vote, and the professional collects the votes until the evidence aligns: the level, the trend, the session, the series and the follow-through all pointing the same way. The candle is not a coin to be flipped on every frame; it is a witness to be questioned until it agrees with the structure. The trader who demands the full agreement trades rarely and profitably; the trader who trades every candle trades often and pays for the privilege."
          ],
          bullets: [
            "Who is in control, and did the market agree — the candle's only question",
            "The open, body, wicks, close and follow-through are the full testimony",
            "Collect the votes until the evidence aligns",
            "Trade the full agreement rarely — and profitably"
          ],
          insight: "The candle is a witness to be questioned until it agrees with the structure — and the trader who demands the agreement is the trader the market pays."
        },
        {
          eyebrow: "Elite · The evidence chain",
          title: "The Evidence Chain — Candle, Level, Trend, Confirmation",
          lead: "No candle trades alone — the professional's entry is the moment a chain of evidence completes, and the candle is only one link in it.",
          body: [
            "The evidence chain has four links: the level (price is at a place the market has defended), the trend (the phase agrees with the direction), the candle (the shape records the behaviour at the level), and the confirmation (the follow-through proves the shape's claim). When all four links are present, the entry is not a gamble — it is the evidence chain completed. When any link is missing, the entry is the missing link's guess.",
            "The deeper layer: the chain is why the professional trades rarely and with conviction — the four-link entry is rare, and the trader who waits for it collects the rare moments when the whole chart agrees. The trader who enters on the candle alone (three links missing) is trading the weakest evidence on the chart; the trader who waits for the chain is trading the strongest agreement the chart can offer. The candle is the visible link; the other three are the ones that decide whether the candle was ever a signal at all."
          ],
          bullets: [
            "Four links: level, trend, candle, confirmation",
            "The completed chain is the rare, high-conviction entry",
            "The candle is the visible link — the other three decide if it was ever a signal",
            "Missing links are guesses wearing a signal's clothes"
          ],
          insight: "No candle trades alone — the professional's entry is the moment the whole chain completes, and the candle is only the visible link."
        },
        {
          kind: "pause",
          eyebrow: "Elite · Breathe",
          title: "Reset Before the Test",
          lead: "You've just taken the candle apart — the open's opinion, the body's ground, the wicks' rejections, the close's verdict, the doji's silence, the engulfing's transfer, the hammer's defence, the session's accent, the series' film, the gap's honesty, the level's memory, the two languages, the supply's signature and the counter-signal. Close your eyes for one breath — in for four, out for four — and let the anatomy settle.",
          body: [
            "The next ten questions are the Elite gate: anatomy arithmetic, doji context, engulfing reliability, wick series, gaps, follow-through, and the candle's final question. They assume you can read the behaviour behind the shapes, not just name them. Take the breath. Then prove it."
          ]
        },
        null, null, null, null, null, null, null, null, null, null,
        {
          kind: "close",
          eyebrow: "Elite chapter complete",
          title: "You Read the Behaviour",
          body: [
            "You entered as a collector of candle names and leave as a reader of candle behaviour: the open's opinion, the body's territory, the wicks' rejected expeditions, the close's settlement, the doji's held breath, the engulfing's transferred control, the hammer's refused fall, the session's accent, the series' film, the gap's honest jump, the level's memory, the two languages, the supply's signature and the final question that every candle answers.",
            "This is the Elite difference: not harder shapes, but the behaviour behind the shapes. You've earned the anatomy. Finish the gate, and the Summit continues in Chapter 5's Elite lane."
          ]
        }
      ]
    }
};
module.exports = C;