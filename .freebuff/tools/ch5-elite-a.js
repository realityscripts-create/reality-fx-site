    elite: {
      slides: 30,
      quizSlides: [20,21,22,23,24,25,26,27,28,29],
      quiz: [
        { q: "A market order and a limit order differ in their relationship to liquidity because…",
          options: ["A market order is always bigger", "A market order consumes liquidity — it fills at whatever is available — while a limit order provides liquidity, resting in the book to be taken", "A limit order always fills first", "They are identical", "The two order types are interchangeable"], answer: 1,
          explain: "The market order is a liquidity consumer — it crosses the spread and takes the resting orders. The limit order is a liquidity provider — it rests in the book and waits to be taken. The deeper layer: this is the engine of the whole market — every move is consumers taking from providers, and the professional knows which side of the engine their own order is on at all times." },
        { q: "Price frequently revisits the most obvious support or resistance before breaking it because…",
          options: ["Those levels are random", "The obvious level holds the crowd's stops — the liquidity pool sits there, and price is drawn to the pool before the break that consumes it", "Banks like the scenery", "The level is stronger than it looks", "The level was drawn by the exchange"], answer: 1,
          explain: "The obvious level is where the crowd's stops and pending orders are stacked — the liquidity pool. Price is drawn to the pool because the move's fuel is the orders resting there, and the break (or the fakeout) is the consumption of that fuel. The deeper layer: the level is not just a price memory — it is an inventory of orders, and the professional reads the obvious level as the market's scheduled liquidity event." },
        { q: "A breakout's reliability is highest when…",
          options: ["The break happens at night", "The break is confirmed by the retest holding, volume supporting the move, and the higher timeframe agreeing with the direction", "The candles are large", "The news is loud", "The break repeats the previous day's pattern"], answer: 1,
          explain: "The raw break is a claim; the retest that holds is the proof, and volume and the higher timeframe are the corroboration. The deeper layer: the market breaks the level, returns to test it, and the way the retest behaves decides whether the break was real — a held retest is the market paying to defend the new territory, and payment is the only honest confirmation." },
        { q: "An uptrend's momentum is measured most honestly by…",
          options: ["The steepness of the last candle", "The structure — higher highs and higher lows, with the strength in how the pullbacks behave and how the highs are made (matched, extended, or failed)", "The number of green candles", "The news headlines", "The size of the last pullback"], answer: 1,
          explain: "Momentum lives in the structure, not the colours: are the highs extending or stalling? Do the pullbacks hold the higher lows or fail them? The deeper layer: the same rally can be healthy (deep pullbacks that hold, extensions that continue) or exhausted (shrinking highs, failing lows) — and the structure tells you which before any oscillator does. The trend's health is the pattern of its beats, never the size of its last one." },
        { q: "The same strategy that works in a trend will fail in a range because…",
          options: ["Ranges are unlucky", "The regimes are opposite — a trend rewards momentum (breakouts, extensions, riding the move) while a range rewards mean reversion (fading the edges, selling the top of the box), and each strategy is the other regime's donor", "Trends are always longer", "Ranges have no volume", "The market is fundamentally random"], answer: 1,
          explain: "Momentum and mean reversion are the two regimes of movement, and each strategy is the other's food: the breakout trader in a range buys the top and sells the bottom; the range trader in a trend fades the move and gets run over. The deeper layer: reading the regime before the strategy is half the edge — the professional names the market condition first, and only then chooses which strategy the regime pays." },
        { q: "Volume confirms a breakout when…",
          options: ["It drops during the break", "It expands as price moves through the level and continues expanding on the follow-through — the new participants arriving and joining the move", "It stays flat", "It only matters at night", "It matches the previous session's average"], answer: 1,
          explain: "A breakout with expanding volume is the market's crowd joining the new direction — new participants arriving, not just the same hands moving. The deeper layer: volume is the move's fuel gauge — a break on thin volume is one hand pushing through an empty book, while a break with volume is the crowd's decision, and the follow-through's volume decides whether the decision holds." },
        { q: "Every market move is built from…",
          options: ["Random noise with no structure", "Impulses and corrections — the directional push (impulse) followed by the counter-move (correction), and the trend is the sequence of impulses making progress", "Only impulses", "Only corrections", "Only the news headlines"], answer: 1,
          explain: "Movement is a rhythm of impulse and correction: the push in the trend's direction, then the pullback, then the next push. The deeper layer: the professional reads the rhythm, not the individual candle — a correction that holds the structure is the trend breathing; a correction that breaks it is the trend ending, and the difference is decided by the structure the correction respects or violates." },
        { q: "The professional's read of a support level is…",
          options: ["A line the market must respect forever", "A zone of remembered behaviour where demand previously arrived — the more often it has held, the more the market remembers it, and the more liquidity pools there", "A random number", "The broker's opinion", "The average of the last ten closes"], answer: 1,
          explain: "Support is the market's memory of a place where buyers arrived — each hold is a memory, and the memories stack into a zone that the crowd respects and places orders around. The deeper layer: the level's power is the history behind it — a level that held three times carries three memories and a deeper pool of orders, and the professional reads the history before trading the level, because the level is only as strong as the memories that made it." },
        { q: "A fakeout below support that instantly reverses is best understood as…",
          options: ["A market error", "A liquidity event — price swept the stops resting below the level, collected the liquidity, and reversed because the pool was the target, not the level", "The end of the market", "A broker mistake", "A sign that support has permanently failed"], answer: 1,
          explain: "The fakeout below support is the stop-hunt: the obvious level holds the crowd's stops, price sweeps through to collect them, and the collected liquidity is the move's fuel — the reversal follows because the purpose of the visit was the pool, not the direction. The deeper layer: this is why the professional places stops beyond the obvious level's liquidity, not at it — the stop that sits in the pool is the fuel the market was scheduled to collect." },
        { q: "The most important question before trading a move is…",
          options: ["How fast will it move?", "What regime is the market in, and where in that regime is price — the condition and the position decide which strategy pays and where the risk sits", "Who is trading it?", "What is the news saying?", "What is the exact top and bottom?"], answer: 1,
          explain: "The condition (trend or range) decides which strategy the market pays, and the position within the condition (near support in a trend, at the top of a range) decides where the risk sits. The deeper layer: every other question — the entry, the size, the stop — is downstream of these two, and the trader who skips them is trading the market without knowing which game it is playing." }
      ],
      native: [
        {
          eyebrow: "Elite · The engine",
          title: "The Auction Engine",
          lead: "The Standard chapter taught you to name the trend, the levels and the breakouts. This lane teaches you the engine that moves price — the auction of consumers and providers, the liquidity pools, the stop hunts, the regimes, and the rhythm of impulse and correction.",
          body: [
            "Price does not move because it 'wants' to — it moves because orders flow into the book: consumers taking liquidity, providers resting it, and the balance shifting second by second. Every candle is the engine's output, and the engine's fuel is the orders behind the move.",
            "This lane opens the engine room: who consumes, who provides, where the pools sit, and how the market collects the fuel it needs to move."
          ],
          bullets: [
            "Every candle is the output of an auction — consumers taking, providers resting",
            "The move's fuel is the orders in the book, not the news on the screen",
            "Reading movement means reading the engine, not just the candles",
            "The professional knows which side of the auction their own order is on"
          ],
          insight: "Price is the engine's output and orders are its fuel — and the trader who reads the engine reads the move before it prints."
        },
        {
          eyebrow: "Elite · The consumers",
          title: "The Order Flow — Consumers and Providers",
          lead: "Every order in the market is either consuming liquidity or providing it — and the move is the balance between the two, shifting in real time.",
          body: [
            "A market order consumes: it crosses the spread and takes whatever is resting in the book, filling immediately at the available price. A limit order provides: it rests in the book at a chosen price, waiting to be taken. The auction is the meeting — consumers arriving, providers waiting, and the price adjusting until the two sides agree.",
            "The deeper layer: this distinction is the market's entire machinery — a breakout is consumers overwhelming providers at a level; a stall is providers defending faster than consumers arrive. The professional knows which side their own order is on because the two sides have opposite costs and opposite risks: the consumer pays the spread and gets certainty; the provider earns the spread and takes the risk of being run over. The move is not mysterious — it is the balance of these two armies, and every candle is their battle report."
          ],
          bullets: [
            "Market orders consume liquidity — they take what rests in the book",
            "Limit orders provide liquidity — they rest and wait to be taken",
            "A breakout is consumers overwhelming providers; a stall is the reverse",
            "Know which side your order is on — the two sides pay and risk oppositely"
          ],
          insight: "The move is the balance of consumers and providers — and every candle is their battle report."
        },
        {
          eyebrow: "Elite · The pools",
          title: "The Liquidity Pool — Where the Fuel Sits",
          lead: "The market's fuel is not the news — it is the orders resting at the obvious places, and the move is the engine collecting its fuel.",
          body: [
            "The crowd places its stops and pending orders at the obvious levels — below the obvious support, above the obvious resistance, at the round numbers. Those stacked orders are the liquidity pool: a concentrated inventory that the market can consume. The move toward the level is the engine approaching its fuel; the break (or the sweep) is the consumption.",
            "The deeper layer: this reframes every level you have ever drawn — the level is not just a price memory; it is an inventory of orders, and its power is the size of that inventory. The professional reads the obvious level as the market's scheduled liquidity event: price will visit it, the question is whether the visit collects the fuel and reverses (the fakeout) or collects it and continues (the true break). The pool is the reason price goes where the crowd is — and the reason the crowd's stops are the market's fuel."
          ],
          bullets: [
            "The crowd's stops and pending orders stack at the obvious levels",
            "The stacked orders are the liquidity pool — the market's fuel",
            "The level is an inventory of orders, not just a price memory",
            "Price goes where the crowd is — because the crowd's stops are the fuel"
          ],
          insight: "The move is the engine collecting its fuel — and the fuel is the crowd's orders resting at the obvious places."
        },
        {
          eyebrow: "Elite · The hunt",
          title: "The Stop Hunt — The Visit to the Pool",
          lead: "Price does not visit the obvious level for the scenery — it visits for the stops, and the visit's purpose decides what happens after.",
          body: [
            "The stop hunt is the market's most efficient move: price sweeps through the obvious level, triggers the crowd's stops, and the triggered stops become the liquidity that fuels the reversal — or the continuation. The sweep below support that instantly reverses is the classic hunt: the pool below the level was the target, and once collected, the fuel is spent and price returns.",
            "The deeper layer: the stop hunt explains the market's cruelest pattern — the level that 'everyone saw' is the level that gets swept first, because everyone's stops are sitting there. The professional's defence is placement: the stop beyond the obvious level's pool (outside the sweep's likely reach) rather than at it. The market does not hunt stops out of malice — it collects fuel where the fuel is, and the trader who keeps their fuel out of the pool is the trader the hunt cannot feed on."
          ],
          bullets: [
            "Price sweeps the obvious level to trigger the stops resting there",
            "The triggered stops are the fuel for the reversal — or the continuation",
            "The level 'everyone saw' is the level that gets swept first",
            "Place stops beyond the pool — the hunt feeds on fuel that sits in it"
          ],
          insight: "The market visits the obvious level for the stops — and the trader who keeps their fuel out of the pool is the trader the hunt cannot feed on."
        },
        {
          eyebrow: "Elite · The rhythm",
          title: "The Impulse and the Correction",
          lead: "Every move is a rhythm — the push, the pullback, the next push — and the trend is the sequence of impulses making progress.",
          body: [
            "Movement is built from impulses (the directional push) and corrections (the counter-move). In an uptrend, the impulses push higher and the corrections pull back — the trend is the impulses making net progress. The rhythm's health is in the corrections: a correction that holds the structure is the trend breathing; a correction that breaks the higher lows is the trend ending.",
            "The deeper layer: the professional reads the rhythm the way a doctor reads a pulse — not by the strength of any single beat but by the pattern across many. The impulse tells you the push; the correction tells you the trend's health; and the way the correction ends (holding the structure, breaking it) tells you what comes next. The trader who watches only the impulses sees the excitement and misses the diagnosis — the corrections are where the trend's real condition is written."
          ],
          bullets: [
            "Every move is impulse and correction — the push and the pullback",
            "The trend is the impulses making net progress",
            "A correction that holds the structure is the trend breathing",
            "A correction that breaks it is the trend ending"
          ],
          insight: "Read the trend like a pulse — the corrections, not the impulses, are where its real condition is written."
        },
        {
          eyebrow: "Elite · The regimes",
          title: "The Two Regimes — Momentum and Mean Reversion",
          lead: "The market pays two different games, and each strategy is the other regime's donor — naming the regime before the strategy is half the edge.",
          body: [
            "In a trend, the market pays momentum: breakouts, extensions, riding the move, buying the pullback in the trend's direction. In a range, the market pays mean reversion: fading the edges, selling the top of the box, buying the bottom. The strategies are mirror images — the breakout trader in a range buys the top and sells the bottom; the range trader in a trend fades the move and gets run over.",
            "The deeper layer: the regime is the environment your edge lives in, and reading it before the strategy is the first decision of every trade. The same entry that is brilliant in a trend is suicidal in a range, and the difference is invisible on the entry candle — it lives in the condition. The professional names the condition first (trending, ranging, transitioning) and only then chooses which strategy the condition pays — and when the condition is unclear, the professional's strategy is patience."
          ],
          bullets: [
            "Trends pay momentum; ranges pay mean reversion",
            "Each strategy is the other regime's donor",
            "The regime is the environment your edge lives in",
            "Name the condition first — and when unclear, the strategy is patience"
          ],
          insight: "The market pays two different games — and the trader who names the regime before the strategy is the trader the regime pays."
        },
        {
          eyebrow: "Elite · The break",
          title: "The Breakout's Anatomy",
          lead: "A breakout is not a moment — it is a process: the approach, the break, the retest, and the confirmation that the new territory is defended.",
          body: [
            "The breakout's full anatomy: price approaches the level (the fuel gathering), breaks it (the consumers overwhelming the providers), retests it (the market returning to prove the break), and confirms it (the retest holding, the flip respected). The raw break is the claim; the retest is the proof; and the confirmation is the market paying to defend the new territory.",
            "The deeper layer: most breakout traders trade the claim and skip the proof — they enter at the raw break and get shaken out by the retest they never planned for. The professional waits for the process: the break tells you the direction, the retest tells you the price, and the confirmation tells you the conviction. The breakout that completes the whole anatomy is the trade with the risk defined and the direction proven; the break that stalls at the retest is the fakeout wearing a breakout's clothes — and only the process tells the two apart."
          ],
          bullets: [
            "The breakout is a process: approach, break, retest, confirmation",
            "The raw break is the claim; the retest is the proof",
            "The confirmation is the market paying to defend the new territory",
            "Only the process tells the true break from the fakeout"
          ],
          insight: "The breakout is not a moment — it is a process, and the trader who waits for the whole process trades breaks that were proven."
        },
        {
          eyebrow: "Elite · The fuel gauge",
          title: "Volume and the Move",
          lead: "Volume is the move's fuel gauge — and the honest read of any move includes the fuel that powered it.",
          body: [
            "A breakout with expanding volume is the crowd joining the new direction — new participants arriving, not just the same hands moving. A break on thin volume is one hand pushing through an empty book — a move with no fuel behind it. The follow-through's volume decides whether the move holds: the same hands can push price once, but only new participants keep it moving.",
            "The deeper layer: volume is the difference between a move that is believed and a move that is performed. The professional reads volume as the corroboration of price: the level that breaks with volume is the market's decision; the level that breaks without it is one trader's decision. And the reversal's volume matters equally — a top that forms on expanding volume is the exhaustion of the fuel; a bottom that forms on drying volume is the selling spent. Price is the story; volume is the evidence — and the trader who reads the story without the evidence is reading fiction."
          ],
          bullets: [
            "Volume is the fuel gauge — expanding volume is the crowd joining",
            "A break on thin volume is one hand pushing through an empty book",
            "The follow-through's volume decides whether the move holds",
            "Price is the story; volume is the evidence"
          ],
          insight: "The honest read of any move includes the fuel that powered it — and the trader who reads price without volume is reading fiction."
        },
