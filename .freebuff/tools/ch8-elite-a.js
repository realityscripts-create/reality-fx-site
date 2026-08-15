    elite: {
      slides: 30,
      quizSlides: [20,21,22,23,24,25,26,27,28,29],
      quiz: [
        { q: "EUR/USD trades at 1.0800 and USD/JPY at 150.00. The EUR/JPY cross is approximately…",
          options: ["1.0800", "150.00", "162.00 — EUR/JPY ≈ 1.0800 × 150.00, the cross rate built from the two legs through the dollar", "13.90", "141.00"], answer: 2,
          explain: "The cross rate is arithmetic: EUR/JPY = EUR/USD × USD/JPY = 1.0800 × 150.00 ≈ 162.00. The deeper layer: crosses are made, not given — the market prices every cross through its dollar legs, and understanding the construction lets you sanity-check any quote and see which two economies the pair actually represents." },
        { q: "One standard lot of EUR/USD has a pip value of roughly $10, while one standard lot of USD/JPY (at 150.00) has a pip value of roughly…",
          options: ["$100", "$6.67 — the pip is 0.01 of the quote, so 100,000 × 0.01 ÷ 150.00 ≈ $6.67, and the value changes as the rate changes", "$10", "$1", "$15"], answer: 1,
          explain: "Pip value for USD/JPY = (100,000 × 0.01) ÷ rate = 1,000 ÷ 150 ≈ $6.67 — and it moves with the rate: as USD/JPY rises, the pip value falls. The deeper layer: the same 'one pip' is different money on different pairs and different days, which is exactly why the position size must be computed per pair, never assumed from the lot." },
        { q: "The carry trade profits when…",
          options: ["The funding currency appreciates", "The yield differential persists — you earn the interest difference between the higher-yielding currency you buy and the lower-yielding one you fund, while the exchange rate stays stable or moves in your favour", "The market is ranging", "The spread widens", "The pair's volatility rises"], answer: 1,
          explain: "The carry is the interest differential: buy the high-yielder, fund in the low-yielder, and collect the difference every day it persists. The deeper layer: carry is a slow, daily income that can be erased in a day by the exchange rate — the carry trade's real risk is the reversal, which is why the professional separates the yield from the currency move and treats the carry as a bonus, never the thesis." },
        { q: "EUR/USD and GBP/USD both rally when the dollar weakens. The professional reads this as…",
          options: ["Two independent moves", "One dollar move wearing two tickets — the pairs share the dollar as the quote currency, so their co-movement is correlation, not coincidence", "A reason to double the position", "Random noise", "A sign the dollar is breaking down"], answer: 1,
          explain: "Both pairs quote the dollar — EUR/USD and GBP/USD are two expressions of the same dollar strength or weakness. The deeper layer: the correlation is structural, and the trader who treats the two as independent risks is carrying one dollar exposure twice — the correlation matrix is the map of these shared exposures, and the professional reads it before sizing anything." },
        { q: "A pair's quote currency is…",
          options: ["The one being bought", "The currency the price is expressed in — the base currency is the unit being bought or sold, and the quote is the currency it is priced against", "Always the dollar", "The stronger economy", "The one with the higher interest rate"], answer: 1,
          explain: "EUR/USD at 1.0800 means one euro is worth 1.0800 dollars — the euro is the base (the unit), the dollar is the quote (the price). The deeper layer: reading the quote correctly is reading which economy is the unit and which is the price — and the professional always knows which side of the pair they are actually trading, because buying EUR/USD is buying the euro, not 'the pair'." },
        { q: "An exotic pair like USD/ZAR typically has…",
          options: ["The tightest spread", "A wider spread and thinner liquidity than the majors — the toll is higher because the market is thinner and the risk of holding is greater", "The same spread as the majors", "No spread at all", "A spread that disappears at noon"], answer: 1,
          explain: "The exotics carry wider spreads and thinner books — the market maker demands a bigger toll for the greater risk of a thin, volatile market. The deeper layer: the spread ladder (majors tightest, crosses wider, exotics widest) is a live map of liquidity — and the professional who trades the exotics prices the wider toll into the plan before the entry, because the toll that is invisible in the quote is the toll that eats the edge." },
        { q: "The US dollar is at the centre of the forex web because…",
          options: ["It is the strongest currency", "Most of the world's trade, debt and reserves are denominated in dollars — so most pairs quote it, and most crosses are built through it", "The brokers prefer it", "It is the newest currency", "It has the lowest interest rate"], answer: 1,
          explain: "The dollar's central role is structural: international trade, sovereign debt and central-bank reserves are overwhelmingly dollar-denominated, which is why most major pairs quote it and most crosses are priced through it. The deeper layer: the dollar's centrality means a dollar move ripples through the whole web at once — the professional reads the dollar index as the web's hub, because the hub's move is the move every spoke feels." },
        { q: "In a risk-off event, the professional expects…",
          options: ["The high-yield currencies to rally", "A flight to safety — the yen, the Swiss franc and the dollar (as reserve) tend to firm while the high-yield and commodity currencies sell off", "All pairs to rally", "No movement at all", "The commodity currencies to lead the rally"], answer: 1,
          explain: "Risk-off is the market's mood swing: fear sells the high-yield and commodity currencies (AUD, NZD, ZAR) and buys the traditional havens (JPY, CHF, USD). The deeper layer: the safe-haven behaviour is correlation in action — the whole web rotates in one direction when the mood turns, and the professional reads the mood from the crosses before the individual pairs, because the pair is a sentence and the mood is the paragraph." },
        { q: "The most honest way to choose which pairs to trade is…",
          options: ["The pair with the most news", "Matching the pair to your strategy and your hours — the pair's volatility, spread and session liquidity must fit the edge, because the same strategy is a different instrument on a different pair", "The pair with the lowest price", "The pair your broker advertises", "The pair with the most followers"], answer: 1,
          explain: "The pair is an instrument with a personality — its volatility, spread, session activity and reaction to news — and the strategy must fit that personality or the strategy will be reshaped by it. The deeper layer: the scalper needs the tight-spread liquid majors in the active sessions; the swing trader can carry the wider crosses; the news trader needs the pairs that react to their data. Choosing the instrument is choosing the environment the edge lives in — and the professional's pair list is a deliberate selection, never a default." },
        { q: "The professional reads a currency pair as…",
          options: ["One instrument with one price", "A sentence about two economies — the base's strength versus the quote's weakness, expressed continuously in the exchange rate, and the sentence only makes sense with the macro paragraph around it", "A random walk", "A broker product", "A number with no meaning"], answer: 1,
          explain: "Every pair is two economies in a constant conversation: the exchange rate is the scoreboard of their relative strength. The deeper layer: the professional reads the pair as a sentence — 'the euro is stronger than the dollar because rates and data favour it' — and the sentence only makes sense with the macro paragraph (rates, data, sentiment, carry) around it. The trader who reads the pair as a price is reading one word of the sentence; the trader who reads the two economies behind it is reading the whole story." }
      ],
      native: [
        {
          eyebrow: "Elite · The web",
          title: "The Currency Web",
          lead: "The Standard chapter taught you to read a pair. This lane opens the web the pairs are woven from — the two economies in every quote, the crosses built through the dollar, the correlation matrix, the carry, the spread ladder and the safe-haven rotations.",
          body: [
            "There is no such thing as a currency in isolation — every currency exists only in relation to another, and the web of those relations is the forex market: each pair a sentence about two economies, each cross a made-up number, each move a message about the whole web's mood.",
            "This lane teaches you to read the web, not just the pairs — so that every quote you see carries its full context."
          ],
          bullets: [
            "Every pair is two economies in a constant conversation",
            "The cross rates are made, not given — built through the dollar",
            "The dollar is the hub — its move is the move every spoke feels",
            "Correlation is the web's structure — and the portfolio's hidden risk"
          ],
          insight: "There is no currency in isolation — only the web, and the pair is the sentence you read on it."
        },
        {
          eyebrow: "Elite · The two economies",
          title: "The Base and the Quote",
          lead: "Every quote is a comparison — the base currency priced in the quote currency — and the comparison is the market's running scoreboard of two economies.",
          body: [
            "EUR/USD at 1.0800 says one euro is worth 1.0800 dollars: the euro is the base (the unit being bought or sold), the dollar is the quote (the price it is expressed in). The rate moves when the two economies' relative strength moves — the euro firming, the dollar weakening, or both — and the scoreboard updates continuously.",
            "The deeper layer: reading the quote correctly is knowing which side you are actually trading — buying EUR/USD is buying the euro, not 'the pair' — and knowing which economy's data moves the quote: the euro data moves the base, the dollar data moves the quote, and the pair moves when either changes the comparison. The professional always reads the quote as a comparison between two economies, never as a single instrument — because the sentence only makes sense when you know both subjects."
          ],
          bullets: [
            "The base is the unit; the quote is the price it is expressed in",
            "The rate is the scoreboard of two economies' relative strength",
            "Buying EUR/USD is buying the euro — know which side you are on",
            "Euro data moves the base; dollar data moves the quote; the comparison moves the pair"
          ],
          insight: "Every quote is a comparison between two economies — and the sentence only makes sense when you know both subjects."
        },
        {
          eyebrow: "Elite · The construction",
          title: "The Cross Rate — The Made-Up Number",
          lead: "The crosses are not quoted out of thin air — they are built from the dollar legs, and understanding the construction is understanding the pair.",
          body: [
            "EUR/JPY = EUR/USD × USD/JPY: the market prices every cross through its dollar legs, and the cross is the arithmetic product of the two. The construction is why the cross moves when either leg moves — a firming euro, a weakening yen, or a dollar move that shifts both — and it is why the cross's behaviour is traceable to the two economies behind the legs.",
            "The deeper layer: knowing the construction lets the professional sanity-check any quote — a cross that does not line up with its legs is a quote to question — and read the cross's drivers: EUR/JPY is the euro's story against the yen's story, with the dollar's move rippling through both. The cross is a made-up number, but it is made up honestly — from the two legs, through the hub, and the trader who reads the construction reads the pair's true anatomy."
          ],
          bullets: [
            "The cross = the product of its dollar legs — EUR/JPY = EUR/USD × USD/JPY",
            "The cross moves when either leg moves — or when the dollar moves both",
            "The construction lets you sanity-check any quote",
            "Read the anatomy: the cross is two economies through the hub"
          ],
          insight: "The crosses are made, not given — built honestly from the dollar legs, and the trader who reads the construction reads the pair's true anatomy."
        },
        {
          eyebrow: "Elite · The hub",
          title: "The Dollar's Role",
          lead: "The dollar sits at the centre of the web — not because it is the strongest currency, but because the world's trade, debt and reserves are priced in it.",
          body: [
            "International trade invoices in dollars, sovereign debt is issued in dollars, and central banks hold their reserves in dollars — which is why most major pairs quote the dollar and most crosses are priced through it. The dollar's centrality is structural, not sentimental: the web is built with the dollar as its hub because the world's economy is.",
            "The deeper layer: the hub's move is the move every spoke feels — when the dollar strengthens, the dollar-quoted pairs (EUR/USD, GBP/USD, AUD/USD) all feel it at once, and the crosses carry it through. The professional reads the dollar index as the web's central gauge — the hub's direction sets the web's rotation, and the individual pair is the hub's move filtered through one pair's specific story. The trader who watches only the pairs misses the hub; the trader who watches the hub reads every pair with its context."
          ],
          bullets: [
            "The dollar is the hub because the world's trade, debt and reserves are priced in it",
            "Most majors quote the dollar; most crosses are built through it",
            "The hub's move is the move every spoke feels",
            "Read the dollar index — the hub's direction sets the web's rotation"
          ],
          insight: "The web is built with the dollar as its hub — and the trader who reads the hub reads every pair with its context."
        },
        {
          eyebrow: "Elite · The arithmetic",
          title: "Pip Values Across Pairs",
          lead: "One pip is different money on every pair — and the difference is the arithmetic that decides the size before the trade.",
          body: [
            "On EUR/USD, a pip (0.0001) of a standard lot is $10 — the pip value is the quote's smallest unit times the size. On USD/JPY at 150.00, a pip (0.01) of a standard lot is 100,000 × 0.01 ÷ 150 ≈ $6.67 — and the value moves as the rate moves, falling as USD/JPY rises. The same 'one pip' is different money on different pairs and different days.",
            "The deeper layer: the pip value is the bridge between the price and the risk — the position size is computed from the pip value, which means the size must be recomputed for every pair and every rate, never assumed from the lot. The professional's mental arithmetic converts the stop's distance in pips into money in the account before the trade exists — and the trader who skips the conversion is the trader who discovers the money after the stop was hit."
          ],
          bullets: [
            "On EUR/USD a pip is $10 per standard lot; on USD/JPY it is ~$6.67 and moving",
            "Pip value = the quote's smallest unit × size, converted through the rate",
            "The same pip is different money on different pairs and different days",
            "Compute the size from the pip value — never assume from the lot"
          ],
          insight: "One pip is different money on every pair — and the arithmetic that converts it into account money is the size's foundation."
        },
        {
          eyebrow: "Elite · The ladder",
          title: "The Spread Ladder",
          lead: "Majors tightest, crosses wider, exotics widest — the spread ladder is a live map of liquidity, and the toll is priced into the plan before the entry.",
          body: [
            "The majors trade with the tightest spreads — the deepest books, the most market makers, the cheapest toll. The crosses trade wider — the books are thinner and the risk of holding is greater. The exotics are widest of all — the thin, volatile markets demand the biggest toll for the risk of making a market in them. The ladder is the market's own pricing of liquidity.",
            "The deeper layer: the toll that is invisible in the quote is the toll that eats the edge — the scalper's edge measured in pips can be consumed entirely by an exotic's spread, while the same edge on a major survives. The professional prices the toll before the entry: the pair's spread is part of the trade's cost, and the trade only exists if the expected move covers the round-trip toll. The ladder is the map — and the trader who reads it chooses the tolls their edge can afford."
          ],
          bullets: [
            "The spread ladder: majors tightest, crosses wider, exotics widest",
            "The ladder is the market's own pricing of liquidity",
            "The invisible toll is the toll that eats the edge",
            "Price the toll before the entry — the trade exists only if the move covers it"
          ],
          insight: "The spread ladder is a live map of liquidity — and the trader who reads it chooses the tolls their edge can afford."
        },
        {
          eyebrow: "Elite · The yield",
          title: "The Carry — The Interest Differential",
          lead: "Every pair carries an interest difference — and the carry is the daily income (or cost) that runs in the background of every position held overnight.",
          body: [
            "Buy the higher-yielding currency and fund in the lower-yielder, and the account collects the interest difference every day the position is held — the carry. The carry trade is the slow, daily income of the interest differential; its mirror is the negative carry paid when the position is on the wrong side of the differential. The swap line on your ticket is the carry made visible.",
            "The deeper layer: carry is a small, daily flow that can be erased in a day by the exchange rate — the carry trader's real risk is the reversal, not the yield. The professional separates the yield from the currency move: the carry is a bonus when the direction agrees, a headwind when it does not, and never the thesis itself. The trader who holds for the carry is collecting pennies in front of a steamroller unless the currency's direction is the actual reason for the position."
          ],
          bullets: [
            "The carry is the interest difference, collected daily on overnight positions",
            "Positive carry is income; negative carry is the daily cost",
            "A day of exchange-rate move can erase a year of carry",
            "The carry is a bonus or a headwind — never the thesis"
          ],
          insight: "The carry is the slow income of the interest differential — and the trader who treats it as the thesis is collecting pennies in front of the steamroller."
        },
        {
          eyebrow: "Elite · The matrix",
          title: "The Correlation Matrix",
          lead: "The pairs do not move alone — they move in a web of co-movement, and the matrix is the map of who moves with whom.",
          body: [
            "EUR/USD and GBP/USD share the dollar — their correlation is structural, and they move together more often than not. AUD/USD and NZD/USD share the commodity story — the antipodean twins. USD/JPY and the risk mood share the safe-haven flow. The correlation matrix is the table of these co-movements, and it changes with the regime — correlations rise in stress and fall in calm.",
            "The deeper layer: correlation is the portfolio's hidden risk — the trader with five 'different' pairs that all share the dollar is carrying one exposure five times, and the matrix is the map that reveals it. The professional reads the matrix before sizing anything: the correlated positions counted as one risk, the genuine diversification found in the pairs that actually diverge, and the regime's change in correlation treated as a change in risk. The pairs are not independent instruments — they are the web's threads, and the matrix is the web's structure."
          ],
          bullets: [
            "The dollar pairs share the dollar; the antipodeans share the commodity story",
            "Correlation rises in stress and falls in calm",
            "Five correlated pairs are one exposure five times",
            "Read the matrix before sizing — the web's threads move together"
          ],
          insight: "The pairs are the web's threads — and the matrix is the map of who moves with whom, and therefore what the portfolio really risks."
        },
