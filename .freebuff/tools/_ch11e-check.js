const C = {
    elite: {
      slides: 30,
      quizSlides: [20,21,22,23,24,25,26,27,28,29],
      quiz: [
        { q: "The market cycle's four phases, in order, are…",
          options: ["Mark-up, mark-down, accumulation, distribution", "Accumulation, mark-up, distribution, mark-down — the quiet build, the trend, the quiet top, the punishment, and then the cycle resets", "Distribution, accumulation, mark-down, mark-up", "Mark-down, mark-up, distribution, accumulation", "Accumulation, distribution, mark-up, mark-down"], answer: 1,
          explain: "The cycle is the market's heartbeat: accumulation builds quietly at the bottom, mark-up trends with the institutions, distribution quietly sells at the top, and mark-down punishes the latecomers — then the cycle resets into the next accumulation. The deeper layer: naming the four phases in order is the first skill, and reading which phase is running is the second — the professional's whole cycle discipline is knowing where in the heartbeat price stands." },
        { q: "The difference between a bottom range and a top range is decided by…",
          options: ["The shape alone", "Volume and position — accumulation absorbs selling (volume thins as price stalls near the low) while distribution absorbs buying (volume builds as price stalls near the high), and the larger cycle's position decides the rest", "The colour of the candles", "The news", "The timeframe"], answer: 1,
          explain: "Both accumulation and distribution are ranges — the same shape, opposite intent. The volume tells you which hand is loading: thinning volume near the low is the selling exhausting, building volume at the high is the buying being absorbed. The deeper layer: the range is a neutral photograph, and only the volume and the position in the larger cycle tell you whether the hand is accumulating or distributing — which is why the same range can fool two traders completely." },
        { q: "A spring is…",
          options: ["A fast, sharp break below the accumulation range that immediately reverses and closes back inside — the false breakdown that stops the weak and loads the final cheap shares", "The start of mark-down", "A random spike", "Always a genuine breakdown", "A sign the range has failed"], answer: 0,
          explain: "The spring is the market's last lie before the truth: a sharp jab below the range's low that instantly reverses — stopping out the last longs, shaking the weak, and loading the final shares for the hand that is accumulating. The deeper layer: the spring is distinguishable from a genuine breakdown by its character — the fast, volume-heavy jab that closes back inside versus the slow grinding loss of the level — and the professional treats the spring as confirmation that the range was real. The shakeout is not the bottom failing; it is the bottom being finished." },
        { q: "The blow-off top is most dangerous because…",
          options: ["It is quiet", "It feels like confirmation — the parabolic price, the record volume, the euphoric news all say 'buy now or miss it', and the trader who obeys buys exactly when the last buyers have arrived", "It is slow", "It never happens", "It always leads to a higher top"], answer: 1,
          explain: "The blow-off is the cycle's most seductive trap: it feels like the strongest moment of the whole move, and it is the weakest — the vertical finale is the last buyers arriving at once, and once they are in, there is no one left in front of price. The deeper layer: the professional reads the blow-off as the signal to protect — lighten, tighten, never add into verticality — because the fall after a blow-off is usually faster than the rise that preceded it, and the candle that says 'buy now or miss it' is the market's farewell." },
        { q: "Capitulation is the cycle's reset because…",
          options: ["It is a quiet, orderly decline", "It is the final panic flush that exhausts the last sellers — record volume, maximum doom, then often a fast reversal, because once the last seller has sold there is no supply left in front of price", "It marks the exact bottom to the pip", "It only happens in crypto", "It is the start of the longest phase"], answer: 1,
          explain: "Capitulation is the emotional climax of mark-down: panic volume, gaps, maximum doom, the last holders finally surrendering — and once the last seller has sold, the next cycle's accumulation can begin. The deeper layer: capitulation is a zone, not a point — catching the exact low is gambling, but recognising the volume climax and the exhaustion means watching for the accumulation structure to form and entering with the cycle's permission. The trader who knows capitulation is coming is not surprised when it arrives." },
        { q: "The best news in a cycle reliably arrives…",
          options: ["At the bottom", "Near the top, and the worst near the bottom — because sentiment and price move together and headlines follow the move, the euphoric story is the confirmation the last buyer needed", "Randomly", "Only after the reversal", "Exactly in the middle of the phase"], answer: 1,
          explain: "The best stories arrive at the top and the worst at the bottom — not because news causes the turns, but because headlines are written after the move, and the euphoria is the crowd's emotion at the peak. The deeper layer: this is why trading the news is so dangerous — the headline that feels like a reason to buy is often the confirmation the last buyer needed at the exact top. The professional treats the news as a catalyst inside the cycle, never the direction — the cycle sets the direction, and the headline just tells you where the crowd's attention is, which is usually where the move is ending." },
        { q: "The cycle's phases nest because…",
          options: ["They don't nest", "Big cycles contain smaller ones at every scale — the weekly mark-up contains daily pullbacks and ranges, which contain their own hourly and 5-minute mini-cycles, like Russian dolls", "The market is random", "Nesting only happens in stocks", "Only the daily chart has a cycle"], answer: 1,
          explain: "The four phases run at every scale: the weekly mark-up contains daily pullbacks, which contain hourly ranges, which contain their own mini-cycles — the same heartbeat at every timeframe. The deeper layer: the nesting is the key to multi-timeframe trading — the larger cycle gives the context, the smaller cycle gives the entry, and the two answer different questions: a buy signal inside a larger distribution is a counter-trend trade, while the same signal inside a larger mark-up is a pullback entry — same candle, opposite meaning, decided by the nesting." },
        { q: "Phase-aware risk management means…",
          options: ["The same size in every phase", "Sizing by the phase — wide stops and full size in the fresh trend, tighter risk near the top and through distribution, minimal exposure in mark-down — because the phase sets how much room the market will give you", "Never trading", "Doubling down in mark-down", "Using the tightest stop in every phase"], answer: 1,
          explain: "Every phase has its own volatility and its own honesty: the fresh mark-up gives the trend room to run (wider stops, larger size), the top and distribution chop and reverse (tighter risk, smaller size), and mark-down punishes the brave (minimal exposure). The deeper layer: risk management is phase-aware because the market's behaviour is phase-dependent — the same stop distance that is reasonable in a fresh trend is reckless in a blow-off, and the professional lets the phase set the risk envelope and the structure set the levels, never the reverse." },
        { q: "The cycle's greatest wealth transfers happen at the transitions because…",
          options: ["Transitions are random", "The phase changes are where the crowd's emotions are furthest from the market's reality — buying the bottom of despair and selling the top of euphoria — and every transition moves money from the emotional majority to the prepared minority", "Transitions are slow", "Transitions never happen", "Transitions are equally profitable for everyone"], answer: 1,
          explain: "The transitions — accumulation into mark-up, mark-up into distribution — are where the crowd's emotion and the market's reality are furthest apart: the bottom feels like the end of the world and is the beginning, the top feels like forever and is the end. The deeper layer: the cycle does not predict prices — it predicts where the emotional majority will be wrong, and therefore where the wealth will move. The professional's job at every transition is to be on the side of the phase that is beginning, not the one that is ending — because the crowd is always celebrating the ending phase and mourning the beginning one." },
        { q: "The cycle identity is…",
          options: ["Predicting the exact turns", "The trader who reads the phase from the evidence — structure, volume, sentiment, transitions — and sizes and positions by the phase, never the feeling, because the cycle is a psychological clock and the trader who reads it is never surprised", "Ignoring the cycle", "Trading every phase the same", "Trusting the news for the phase"], answer: 1,
          explain: "The cycle identity is the discipline of reading the phase from evidence instead of feeling: the four questions — where is price, what is volume doing, what is sentiment saying, what are the transitions doing — answered with evidence, and the phase's answer setting the risk envelope and the position. The deeper layer: the cycle is a psychological clock, not a prediction machine — it does not tell you the exact turn, it tells you where the crowd is likely wrong, and the trader who reads the clock with evidence is the trader the transitions pay instead of collect." }
      ],
      native: [
        {
          eyebrow: "Elite · The clock",
          title: "The Cycle Clock",
          lead: "The Standard chapter taught you to name the four phases. This lane opens the machinery behind them — the volume fingerprints, the spring and the blow-off, the nesting of cycles, the sentiment mirror and the transitions where the market's real wealth moves.",
          body: [
            "The cycle is the market's heartbeat: accumulation, mark-up, distribution, mark-down — the same four phases at every scale, driven by the same psychology: the crowd forgetting, the institutions positioning, the transitions transferring the wealth.",
            "This lane teaches you to read the clock with evidence — the volume, the sentiment, the transitions — so that the phase is named by the market's own record, never by the feeling."
          ],
          bullets: [
            "The four phases: accumulation, mark-up, distribution, mark-down — then the reset",
            "The same range is accumulation or distribution — the volume tells you which hand",
            "The best news arrives at the top and the worst at the bottom — headlines follow the move",
            "The transitions are where the wealth moves — from the emotional majority to the prepared minority"
          ],
          insight: "The cycle is the market's heartbeat — and the trader who reads the clock with evidence is the trader the transitions pay."
        },
        {
          eyebrow: "Elite · The memory",
          title: "The Memory of Money",
          lead: "The cycle repeats because the people in it do not remember the last time — and the ones who do remember are the ones who profit.",
          body: [
            "Markets do not repeat the same events; they repeat the same emotions. Each cycle brings a new generation certain that 'this time is different' — the bottom feels uniquely hopeless, the top uniquely justified — and the certainty is exactly what lets the same four phases play out, decade after decade, on every chart and every timeframe.",
            "The deeper layer: institutional memory is the cycle's fuel and its reward — the crowd forgets the last mark-down by the next mark-up's peak, and the professional remembers, which is what lets them buy the despair and sell the euphoria while everyone else does the opposite. The cycle is not a mechanical prediction machine; it is a psychological clock, and the trader who understands why it repeats is the trader who stops being surprised by it. The market's memory is not in the charts — it is in the humans who forgot."
          ],
          bullets: [
            "The cycle repeats because the crowd forgets — 'this time is different' is the tell",
            "Markets repeat emotions, never identical events",
            "Institutional memory is the professional's edge — remember what the crowd forgets",
            "The cycle is a psychological clock, not a prediction machine"
          ],
          insight: "The market's memory lives in the humans who forgot the last time — and the professional's edge is remembering it."
        },
        {
          eyebrow: "Elite · The prints",
          title: "Accumulation's Fingerprints",
          lead: "Accumulation is a quiet crime scene — the loading happens where nobody is looking, and the evidence is in the volume.",
          body: [
            "A range at the bottom is not automatically accumulation — it is a range until the volume proves otherwise. The fingerprints: volume drying up as price stalls near the low (the selling exhausting), the occasional sharp down-spike that gets immediately bought back (the shakeout), and price refusing to make new lows on bad news (the hand holding the floor). The loading is patient and invisible; the prints are in the tape.",
            "The deeper layer: this is why the professional studies volume with the same seriousness as price — the range's shape tells you what happened, the volume tells you who did it. Accumulation's defining trait is that the smart money is willing to hold price steady while absorbing the final despair — and that willingness is visible only to the trader who reads the volume behind the candles. The range is the room; the volume is the hand moving inside it — and the trader who reads both reads the loading before the mark-up announces it."
          ],
          bullets: [
            "A bottom range is just a range until the volume proves the intent",
            "The prints: volume thinning at the lows, sharp dips bought back, price refusing new lows",
            "The shape shows what happened; the volume shows who did it",
            "The range is the room; the volume is the hand moving inside it"
          ],
          insight: "Accumulation is a quiet crime scene — and the volume is the evidence that names the hand behind the range."
        },
        {
          eyebrow: "Elite · The spring",
          title: "The Spring — The Final Shakeout",
          lead: "Just before mark-up begins, accumulation often delivers one last terror — the spring that throws the weak off before the trend loads.",
          body: [
            "The spring is a fast, sharp break below the accumulation range's low that immediately reverses and closes back inside — a false breakdown that stops out the last longs, shakes the weak, and lets the accumulating hand pick up the final cheap shares before the real move up. It is the market's last test of the bottom, and it is engineered by the very hands doing the accumulating.",
            "The deeper layer: the spring is a lie told with conviction — price genuinely breaks the level, the stops trigger, the despair peaks, and then the reversal is just as violent. The professional knows the difference between the spring (a fast, volume-heavy jab below the range that closes back inside) and a genuine breakdown (a slow, grinding loss of the level with follow-through) — and treats the spring as confirmation that the range was real. The shakeout is not a sign the bottom failed; it is the sign the bottom was being finished."
          ],
          bullets: [
            "The spring: sharp false break below the range, instantly reversed",
            "It stops out the weak and loads the final cheap shares",
            "Springs are engineered by the hands doing the accumulating",
            "A slow grinding loss of the level is a real breakdown, not a spring"
          ],
          insight: "The spring is the market's last lie before the truth — a false breakdown that proves the bottom was real."
        },
        {
          eyebrow: "Elite · The trend",
          title: "Mark-Up — The Ladder of Waves",
          lead: "The rise looks like one smooth line from outside — inside, it is a ladder of waves, each one a test of the phase's health.",
          body: [
            "Mark-up does not climb in a straight line — it advances in waves: a push higher, a pullback, a higher low, another push. Each wave is a test: do the pullbacks hold the higher lows? Does volume support the pushes and thin on the dips? Does the sentiment keep improving without reaching euphoria? The answers tell you whether the phase is healthy or aging.",
            "The deeper layer: the professional reads mark-up the way a doctor reads a pulse — not by the strength of any single beat but by the rhythm's health across many. A pullback that holds structure is breathing; a pullback that breaks the higher lows is the first sign the phase is tiring; volume that fades on the pushes is the engine losing fuel. The trend does not end at the top — it ends when its internal structure stops confirming it, and the trader who watches the waves instead of the headlines sees the aging long before the turn."
          ],
          bullets: [
            "Mark-up climbs in waves — push, pullback, higher low, push",
            "Pullbacks that hold the higher lows are the phase breathing",
            "Volume fading on the pushes is the engine losing fuel",
            "The trend ends when its internal structure stops confirming it"
          ],
          insight: "Read the trend like a pulse — not by one beat but by the rhythm's health across many."
        },
        {
          eyebrow: "Elite · The finale",
          title: "The Blow-Off's Seduction",
          lead: "The vertical finale feels like the strongest moment of the whole move. It is the weakest — the last buyers arriving at once.",
          body: [
            "A blow-off top is the cycle's final act: price goes parabolic, volume explodes, the news is euphoric, and everyone who has been watching finally joins. It feels like the trend's greatest triumph — and it is, in one sense: the trend is ending at its most convincing. The vertical surge is the last possible buyers arriving in a rush, and once they are in, there is no one left in front of price.",
            "The deeper layer: the blow-off is the market's most seductive trap because it feels like confirmation — the parabolic candle says 'buy now or miss it forever', and the trader who obeys buys exactly when the fuel runs out. The professional reads the blow-off as the signal to protect: lighten positions, tighten stops, never add into verticality. If they trade the reversal, they do it small and against the extreme — because the top is only confirmed after the fall begins, and the fall after a blow-off is usually faster than the rise that preceded it."
          ],
          bullets: [
            "The blow-off is the last buyers arriving at once — fuel exhausted",
            "Parabolic price + record volume + euphoric news = the finale",
            "It feels like confirmation and is the opposite of it",
            "Protect into verticality; never add; small if you fade the top"
          ],
          insight: "The candle that feels like 'buy now or miss it' is the market's farewell — the last fuel burning at once."
        },
        {
          eyebrow: "Elite · The quiet top",
          title: "Distribution's Hidden Hand",
          lead: "The quiet top is not a pause — it is a hand selling into the remaining strength, and the chart shows only the stall.",
          body: [
            "Distribution is the mirror of accumulation: a range at the top where the smart money sells into the strength while the crowd still believes. The shape is the same as a bottom range, but the intent is opposite — instead of absorbing selling, the distribution range absorbs buying, and the volume tells the story: heavy volume on the rallies that fail, lighter on the dips that get bought back by a public that cannot believe the top is real.",
            "The deeper layer: distribution works because it does not look like selling — price is still near the highs, the news is still good, and the exits look like 'taking a breather' rather than 'leaving the building'. The professional reads the range's intent the same way they read accumulation's: volume on the failed rallies, the pattern's position in the larger cycle, and the first sign of the exit — the break of the range's low. The top is not announced; it is distributed, and the trader who reads the hand behind the range exits with the smart money instead of after it."
          ],
          bullets: [
            "Distribution is accumulation's mirror — selling into the strength",
            "The range's intent is in the volume: heavy on failed rallies",
            "Exits look like breathers — that is the point",
            "The break of the range's low is the first honest announcement"
          ],
          insight: "The top is not announced — it is distributed, and the hand behind the range tells the story the headlines will not."
        },
        {
          eyebrow: "Elite · The punishment",
          title: "Mark-Down — The Costly Lesson",
          lead: "Mark-down is the cycle's punishment phase — the decline that charges the crowd for the euphoria, and the denial that makes it so expensive.",
          body: [
            "Mark-down is the fall after the distribution's quiet top: the trend reverses, the latecomers who bought the blow-off hold their losses, and the decline is punctuated by rallies that look like recoveries and fail — each one a trap for the hopeful. The phase is powered by denial: holders refuse to accept the loss, average down into the falling knife, and hope for a recovery that keeps not coming.",
            "The deeper layer: mark-down is where psychology does its most expensive work — the pain of realising the loss is so strong that traders pay a fortune in continuing losses to avoid it. The professional's mark-down job is the opposite: protect capital, refuse the averaging-down reflex, and watch for the bottom patterns — the double bottoms, the inverse head-and-shoulders, the capitulation volume — to re-enter only when the next accumulation actually forms. Mark-down is the phase that separates the traders who understand the cycle from the ones who pay for it."
          ],
          bullets: [
            "Mark-down is the decline that charges the crowd for the euphoria",
            "The failed recovery rallies are traps for the hopeful",
            "The phase is powered by denial — the averaging-down reflex",
            "Protect capital, refuse the reflex, watch for the next accumulation"
          ],
          insight: "Mark-down is where psychology does its most expensive work — and the professional's job is to refuse the reflex and wait for the reset."
        },
        {
          eyebrow: "Elite · The reset",
          title: "Capitulation — The Exhaustion",
          lead: "Capitulation is the cycle's emotional climax — the final panic flush that exhausts the last sellers, and the exhaustion is the reset's beginning.",
          body: [
            "Capitulation arrives at the deepest point of mark-down: panic volume, gap downs, maximum doom, and the last holders finally surrendering. The selling is exhausted because the sellers have sold — once the last holder gives up, there is no supply left in front of price, which is why capitulation so often marks the zone where the next accumulation begins. The panic that feels like the end is the beginning's announcement.",
            "The deeper layer: capitulation is a zone, not a point — catching the exact low is gambling, but recognising the volume climax and the exhaustion means watching for the accumulation structure to form and entering with the cycle's permission. The professional does not buy the panic; they wait for the panic's aftermath — the volume drying, the range forming, the first signs of the hand loading — and the entry with the permission is the entry with the cycle's backing. The trader who knows capitulation is coming is not surprised when it arrives — and the trader who is not surprised is the trader who is ready for the reset."
          ],
          bullets: [
            "Capitulation: panic volume, gap downs, maximum doom — the last sellers surrendering",
            "Once the last seller has sold, there is no supply left in front of price",
            "Capitulation is a zone, not a point — catching the exact low is gambling",
            "Wait for the aftermath — the accumulation structure, the cycle's permission"
          ],
          insight: "The panic that feels like the end is the beginning's announcement — and the trader who waits for the aftermath buys the reset with permission."
        },
        {
          eyebrow: "Elite · The nest",
          title: "The Nest — Cycles Within Cycles",
          lead: "The four phases run at every scale — the weekly mark-up contains daily pullbacks, which contain hourly ranges — and the nesting is the key to multi-timeframe reading.",
          body: [
            "The weekly mark-up contains daily pullbacks and ranges, which contain their own hourly and 5-minute mini-cycles — the same heartbeat at every scale, like Russian dolls. The nesting means every chart is several cycles at once, and the phase you name depends on the timeframe you are reading: the daily chart in mark-up is inside a weekly chart in distribution, which is inside a monthly chart in mark-up — three phases, three answers, all true at once.",
            "The deeper layer: the nesting is the key to multi-timeframe trading — the larger cycle gives the context, the smaller cycle gives the entry, and the two answer different questions: a buy signal inside a larger distribution is a counter-trend trade; the same signal inside a larger mark-up is a pullback entry — same candle, opposite meaning, decided by the nesting. The professional reads the higher timeframe for the phase and the lower for the entry, and the two readings are never the same question — the context decides the meaning, and the entry decides the price."
          ],
          bullets: [
            "The four phases run at every scale — the same heartbeat, Russian-doll nesting",
            "The phase you name depends on the timeframe you are reading",
            "The higher timeframe gives the context; the lower gives the entry",
            "Same signal, opposite meaning — decided by the nesting"
          ],
          insight: "Every chart is several cycles at once — and the trader who reads the nesting reads the context and the entry as two different questions."
        },
        {
          eyebrow: "Elite · The mirror",
          title: "The Sentiment Mirror",
          lead: "Sentiment is a rear-view mirror — it shows the past's emotions, not the future's direction, and the extremes are the contrarian warnings.",
          body: [
            "The sentiment surveys, the news headlines, the crowd's mood — all of them describe where the market has been, not where it is going: the euphoria at the top is the crowd's emotion after the long rise, the despair at the bottom is the emotion after the long fall. Sentiment is a rear-view mirror because it is written after the move — and the professional reads the mirror's extremes as the contrarian warnings: the universal optimism is the top's companion, the universal despair is the bottom's.",
            "The deeper layer: the mirror's value is in its extremes — when the crowd is unanimously bullish, the buyers are already in and the fuel is spent; when the crowd is unanimously bearish, the sellers are exhausted and the fuel is returning. The professional does not trade against the crowd for fun — they read the extremes as the cycle's confirmation: the euphoria that follows the blow-off, the despair that precedes the capitulation, and the mirror's extremes as the evidence the phase is turning. The mirror shows the past; the professional uses the past's extremes to read the present's position in the cycle."
          ],
          bullets: [
            "Sentiment is written after the move — a rear-view mirror, not a headlight",
            "The euphoria at the top and the despair at the bottom are the crowd's past",
            "The extremes are the contrarian warnings — the universal mood is the phase's companion",
            "Read the mirror's extremes as the evidence the phase is turning"
          ],
          insight: "Sentiment shows the past's emotions — and the trader who reads the extremes reads the phase's position in the cycle."
        },
        {
          eyebrow: "Elite · The catalyst",
          title: "The News at the Turns",
          lead: "The news is a catalyst inside the cycle, never its direction — and the best headline reliably arrives at the top because it is written after the move.",
          body: [
            "News announces record earnings the same week a stock tops; the bailout arrives near the bottom; the downgrade lands after the fall. The pattern is not coincidence — sentiment and price move together, and the headlines are written after the move, which is why the best news reliably arrives near the top and the worst near the bottom. The news is the cycle's weather; the phase is the climate — and the weather follows the climate, not the reverse.",
            "The deeper layer: this is why trading the news is so dangerous — the headline that feels like a reason to buy is often the confirmation the last buyer needed at the exact top, and the headline that feels like the end of the world is the capitulation's announcement. The professional treats the news as a catalyst that can accelerate a phase, never as the direction: the cycle — the structure, the volume, the sentiment — sets the direction, and the headline just tells you where the crowd's attention is, which is usually where the move is ending."
          ],
          bullets: [
            "The best news arrives at the top and the worst at the bottom — headlines follow the move",
            "The news is the cycle's weather; the phase is the climate",
            "The headline that feels like a reason to buy is often the last buyer's confirmation",
            "The cycle sets the direction; the news just marks where the crowd's attention is"
          ],
          insight: "The news is a catalyst inside the cycle, never its direction — and the headline tells you where the attention is, which is usually where the move ends."
        },
        {
          eyebrow: "Elite · The envelope",
          title: "Phase-Aware Risk",
          lead: "Every phase has its own volatility and its own honesty — and the professional lets the phase set the risk envelope, and the structure set the levels.",
          body: [
            "The fresh mark-up gives the trend room to run — the wider stops and larger size work because the phase is honest. The top and the distribution chop and reverse — the tighter risk and smaller size protect the account from the whipsaw. The mark-down punishes the brave — the minimal exposure or none keeps the account alive for the reset. The same strategy in the wrong phase is a different strategy entirely, and the phase sets the envelope the strategy lives in.",
            "The deeper layer: risk management is phase-aware because the market's behaviour is phase-dependent — the same stop distance that is reasonable in a fresh trend is reckless in a blow-off, and the same size that is fine in accumulation is fatal in distribution. The professional reads the phase before sizing: the envelope (how much room the market will give) is set by the phase, and the levels (where the structure sits) are set by the chart — and the two together decide the size. The trader who sizes by the phase's honesty is the trader the phase cannot surprise."
          ],
          bullets: [
            "The fresh mark-up gives room; the top chops; the mark-down punishes",
            "The phase sets the risk envelope; the structure sets the levels",
            "The same stop in the wrong phase is a different strategy entirely",
            "Size by the phase's honesty — the trader the phase cannot surprise"
          ],
          insight: "The phase sets how much room the market will give — and the trader who sizes by the phase's honesty is the trader the phase cannot surprise."
        },
        {
          eyebrow: "Elite · The transfer",
          title: "The Transition — Where the Wealth Moves",
          lead: "The cycle's greatest wealth transfers happen at the transitions — the moments the crowd's emotions are furthest from the market's reality.",
          body: [
            "At the accumulation-to-mark-up transition, the bottom feels like the end of the world and is the beginning — the crowd sells the despair to the hand that is loading. At the mark-up-to-distribution transition, the top feels like forever and is the end — the crowd buys the euphoria from the hand that is distributing. The transitions are where the wealth moves, and they move from the emotional majority to the prepared minority, every cycle, reliably.",
            "The deeper layer: this is the cycle's most reliable lesson — it does not predict prices, it predicts where the emotional majority will be wrong, and therefore where the wealth will move. The professional's job at every transition is the same: be on the side of the phase that is just beginning, not the one that is ending — because the crowd is always celebrating the ending phase and mourning the beginning one. The transition trade is the cycle's highest-value trade, and the trader who reads the evidence of the turn — the volume, the sentiment, the structure — is the trader who is positioned when the wealth moves."
          ],
          bullets: [
            "The transitions are where the wealth moves — from the emotional majority to the prepared minority",
            "The bottom feels like the end and is the beginning; the top feels like forever and is the end",
            "The cycle predicts where the crowd will be wrong, and therefore where the wealth moves",
            "Be on the side of the phase beginning — the crowd celebrates the one ending"
          ],
          insight: "The transitions are the cycle's highest-value trades — and the trader who reads the evidence of the turn is positioned when the wealth moves."
        },
        {
          eyebrow: "Elite · The check",
          title: "The Four-Question Check",
          lead: "Naming the phase is not a feeling — it is a checklist with evidence, and the evidence has to answer four questions.",
          body: [
            "The professional names a phase by asking four things: Where is price in the larger structure (high, low, mid)? What is volume doing (building, thinning, exploding)? What is the sentiment telling us (despair, hope, euphoria)? And what are the transitions doing (ranges absorbing, breaks confirming)? Four answers, one verdict — and the verdict is only as strong as the weakest evidence.",
            "The deeper layer: the checklist is what separates phase-reading from phase-guessing — the amateur points at a chart and feels 'this looks like a top'; the professional assembles four independent pieces of evidence and lets them disagree before deciding. When the four questions disagree (price near highs but volume thinning and sentiment still cautious), the honest answer is 'transition zone, wait for confirmation' — and saying 'I don't know yet' is the most professional sentence in the chapter. The cycle rewards the trader who can wait for the evidence to line up — and the checklist is the waiting made honest."
          ],
          bullets: [
            "Four questions: structure, volume, sentiment, transitions",
            "The verdict is only as strong as the weakest evidence",
            "Disagreement is an honest 'I don't know yet — wait'",
            "The cycle rewards the trader who waits for the evidence"
          ],
          insight: "Phase-reading is an evidence checklist, not a feeling — and 'I don't know yet' is often the most professional answer."
        },
        {
          eyebrow: "Elite · The identity",
          title: "The Cycle Identity",
          lead: "After the phases, the volume, the sentiment mirror and the transitions — the only thing that survives contact with a live market is the trader who reads the rhythm and trusts the read.",
          body: [
            "The market does not care how many phases you can name, how beautifully you draw the cycle, or how certain you feel about a top. It cares what you do when the range breaks, when the blow-off ignites, when the capitulation comes — and the trader who reads the rhythm with evidence, corrects for their own emotion, and trusts the read when it is unpopular is the one the cycle pays.",
            "The deeper layer: this is why the cycle is identity — every discipline in this Academy lands at the same door: the moment you trust the structure over the feeling, the evidence over the headline, the phase over the mood. The trader who needs the crowd's approval to act is the cycle's reliable customer; the trader who reads the rhythm and stands on the quiet side of the transition is the one the market eventually rewards. The cycle has been running since the first market existed, and it will run long after every chart in this academy is forgotten — the only question is whether you learn to dance to it or keep getting danced by it."
          ],
          bullets: [
            "The market rewards the read that is evidence-based and unpopular",
            "Trust the structure over the feeling, the phase over the mood",
            "The trader who needs the crowd's approval is the cycle's customer",
            "Learn to dance to the rhythm — or keep getting danced by it"
          ],
          insight: "The cycle has outlived every market that ever ran it — the only question is whether you dance to it or get danced by it."
        },
        {
          eyebrow: "Elite · The no-phase",
          title: "No Phase Is Permanent",
          lead: "Every phase feels permanent while you are inside it — and that feeling is the cycle working exactly as designed, keeping the crowd in the wrong place at the wrong time.",
          body: [
            "The bottom feels like the end of the world, the top feels like forever, the range feels like it will never break — each phase's permanence is the emotion of being inside it, and the emotion is the cycle's gravitational pull that keeps the crowd positioned for the phase that is ending. The professional's counter is simple: no phase is permanent, and the evidence of aging is always visible before the turn — the shrinking waves, the fading volume, the sentiment's extremes, the transitions forming.",
            "The deeper layer: trading the transition means trusting the evidence over the feeling — when the structure, volume and sentiment all say the phase is aging, the professional acts even though the phase feels permanent. This is the practical discipline that ties the whole chapter together: the cycle is a clock, the clock is always ticking, and the trader who respects the tick — who never assumes the current phase will last, who watches for the aging and prepares for the transition — is the one who is never surprised by what the market does next. The phase will end. The only question is whether you read the signs before or after."
          ],
          bullets: [
            "Every phase feels permanent — that feeling is the cycle's design",
            "The evidence of aging is visible before the turn, always",
            "Act on the evidence, not on the feeling of permanence",
            "The phase will end — the question is whether you read the signs first"
          ],
          insight: "The phase will end — and the trader who respects the ticking clock is the one never surprised by the chime."
        },
        {
          eyebrow: "Elite · The market's accent",
          title: "The Cycle in Every Market",
          lead: "The four phases run everywhere — stocks, forex, crypto, commodities — but each market speaks the cycle in its own accent, and the accent changes the trade.",
          body: [
            "The stock cycle runs on earnings and the economy's mood; the forex cycle runs on the central banks' rates and the carry; the crypto cycle runs faster and wilder, the phases compressed into months instead of years; the commodity cycle runs on the supply and demand of the physical world. The grammar is the same — accumulation, mark-up, distribution, mark-down — but the pacing and the extremes are each market's own accent, and the accent decides how the phases actually play out.",
            "The deeper layer: the accent changes the trade — the same range in forex and crypto has different volume signatures, the same blow-off in stocks and commodities has different catalysts, and the trader who applies one market's expectations to another misreads the accent as a different cycle. The professional learns the grammar once and the accent per market: the phase is the same, the pace is the market's own, and the timing — the length of the accumulation, the violence of the blow-off, the depth of the mark-down — is the accent that the trader must learn before trading the language. The cycle is the grammar; each market supplies its own vocabulary."
          ],
          bullets: [
            "The four phases are universal; the pacing and extremes are not",
            "Stocks run on earnings, forex on rates, crypto faster, commodities on supply",
            "The accent changes the trade — the same range, two meanings",
            "The cycle is the grammar; each market supplies its own vocabulary"
          ],
          insight: "The cycle is the grammar and each market speaks it in its own accent — learn the accent before you trade the language."
        },
        {
          kind: "pause",
          eyebrow: "Elite · Breathe",
          title: "Reset Before the Test",
          lead: "You've just opened the clock — the memory of money, the accumulation's fingerprints, the spring, mark-up's waves, the blow-off's seduction, distribution's hand, mark-down's cost, capitulation's reset, the nesting, the sentiment mirror, the news at the turns, phase-aware risk, the transitions and the four-question check. Close your eyes for one breath — in for four, out for four — and let the rhythm settle.",
          body: [
            "The next ten questions are the Elite gate: the phases in order, volume fingerprints, the spring, the blow-off, capitulation, the nesting, the sentiment extremes, phase-aware risk and the transitions. They assume you can read the evidence, not just the names. Take the breath. Then prove it."
          ]
        },
        null, null, null, null, null, null, null, null, null, null,
        {
          kind: "close",
          eyebrow: "Elite chapter complete",
          title: "You Read the Rhythm",
          body: [
            "You entered as a namer of phases and leave as a reader of the rhythm: the memory of money, the fingerprints, the spring, the waves, the blow-off, the hidden hand, the costly lesson, the reset, the nesting, the mirror, the catalyst, the phase-aware envelope, the transfers and the four-question check.",
            "This is the Elite difference: not naming the phases, but trading the evidence behind them. You've earned the rhythm. Finish the gate, and the Summit continues in Chapter 12's Elite lane."
          ]
        }
      ]
    }
};
module.exports = C;