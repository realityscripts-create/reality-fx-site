    elite: {
      slides: 27,
      quizSlides: [17,18,19,20,21,22,23,24,25,26],
      quiz: [
        { q: "One standard lot is 100,000 units. The pip value of one standard lot of EUR/USD is approximately…",
          options: ["$10 per pip", "$1 per pip", "$100 per pip", "$0.10 per pip"], answer: 0,
          explain: "On EUR/USD, 1 pip = 0.0001 of the price. 100,000 × 0.0001 = $10. Every strategy's expectancy — and every risk decision — starts with this number." },
        { q: "You trade one standard lot of EUR/USD at 1.1000 with 100:1 leverage. The margin required is approximately…",
          options: ["$11,000", "$1,100", "$110,000", "$110"], answer: 1,
          explain: "Margin = position value ÷ leverage = (100,000 × 1.1000) ÷ 100 = $1,100. You control $110,000 of exposure with an $1,100 deposit — that is the loan leverage gives you." },
        { q: "Free margin is…",
          options: ["Equity + used margin", "Balance × leverage", "Equity − used margin", "Balance − equity"], answer: 2,
          explain: "Free margin = equity − used margin — the amount you can still open positions with. Treat it as a warning gauge, not a spending budget." },
        { q: "A margin call is triggered when…",
          options: ["Equity falls below the required margin", "Price hits your stop-loss", "Your balance turns negative", "You close a winning position"], answer: 0,
          explain: "When equity drops below the margin required to hold your positions, the broker starts closing them from the worst — that is the margin call. It is the market taking the loan back." },
        { q: "You go short on EUR/USD. What did you effectively do?",
          options: ["Bought EUR expecting it to rise", "Sold EUR — borrowed it — expecting it to fall", "Sold USD expecting EUR to fall", "Bought USD expecting EUR to fall"], answer: 1,
          explain: "Shorting means selling the base currency you do not own — effectively borrowing it and buying it back later. Your profit is the difference if EUR falls before you repurchase." },
        { q: "Holding a position open past the daily rollover time means…",
          options: ["Your stop-loss gets re-priced", "You pay commission only", "Nothing changes at all", "You pay or receive the overnight interest differential"], answer: 3,
          explain: "Rollover is the daily interest transfer between the two currencies you hold. A carry trade lives on this — and a position held for weeks carries a cost you must price in." },
        { q: "The synthetic EUR/GBP rate is derived as…",
          options: ["EUR/USD ÷ GBP/USD", "EUR/USD × GBP/USD", "GBP/USD ÷ EUR/USD", "EUR/USD + GBP/USD"], answer: 0,
          explain: "EUR/GBP = EUR/USD ÷ GBP/USD. Cross rates are constructed from the majors — which is why pricing discrepancies between them get arbitraged away in seconds." },
        { q: "A stop-limit order…",
          options: ["Becomes a market order the moment it triggers", "Triggers a limit order at the stop price", "Guarantees a fill at any price", "Cancels your open position"], answer: 1,
          explain: "A stop-limit combines a stop trigger with a limit price: when the stop level is hit, a limit order is placed. You control the worst price — but you can also miss the move entirely." },
        { q: "An ECN/STP broker…",
          options: ["Always trades against you", "Sets your prices for you", "Guarantees zero slippage", "Passes your orders through to the interbank market"], answer: 3,
          explain: "ECN/STP brokers route client orders to liquidity providers instead of taking the other side. Your execution model decides who is on the other side of your trade — know it like you know your strategy." },
        { q: "The London–New York overlap matters because…",
          options: ["Both markets are open — peak liquidity and volatility", "Only one market trades during it", "Spreads are at their widest", "Price never moves during it"], answer: 0,
          explain: "When London and New York are both open, the most institutional flow crosses — tighter spreads, real volume, and the moves that carry through the day. Trading the right hours is a decision, not an accident." }
      ],
      native: [
        {
          eyebrow: "Elite · The language",
          title: "Words Are Positions",
          lead: "The market's vocabulary is not decoration. Every word in this chapter is a position you can take — or a mistake you can make. The Elite lane begins with precision, because you cannot manage what you cannot name.",
          body: [
            "A beginner says 'I'm going to buy the market.' A professional says 'I'm long two lots EUR/USD at 1.1050, stop 20 pips, target 60 — risk $200.' The difference is not vocabulary for its own sake. It is the difference between a hope and a plan — and the market prices hopes and plans very differently.",
            "The Elite standard: before you take any trade, you should be able to name its pair, its direction, its lot size, its pip value, its margin, and its cost. If a word comes out fuzzy, the risk behind it is fuzzy too."
          ],
          bullets: [
            "Every mislabeled concept is a mispriced trade",
            "Precision of language is precision of risk",
            "A trader who names things correctly can be taught, reviewed, and improved"
          ],
          callout: "The market doesn't care what you meant. It executes what you ordered.",
          insight: "Words are the first position you take. Choose them like a professional."
        },
        {
          eyebrow: "Elite · The real number",
          title: "Pip Values Are Pair-Specific",
          lead: "A pip is not a universal unit. Its value in your account currency depends on the pair, the lot size, and the rate itself — and every strategy's maths lives or dies on this number.",
          body: [
            "On EUR/USD, one pip is 0.0001 — and on a standard lot of 100,000 units, that pip is worth $10. On USD/JPY, a pip is 0.01, and the value formula runs through the USD/JPY rate. On GBP/USD, the same 100,000 units move $10 per pip, but on USD/CHF or USD/CAD the value shifts with the exchange rate.",
            "Here is the hidden gem: the pip value tells you exactly how many rands or dollars your stop-loss costs before you enter. A 20-pip stop on one standard lot of EUR/USD is $200 of defined risk. If you don't know this number, you aren't managing risk — you're hoping."
          ],
          bullets: [
            "Pip value = lot size × pip size, converted to your account currency",
            "The number changes with the pair — never assume it's universal",
            "Multiply your stop distance by pip value: that is your defined risk, in money"
          ],
          example: "1 standard lot EUR/USD: 100,000 × 0.0001 = $10 per pip. A 20-pip stop = $200 risk. A 0.5 lot halves it to $100.",
          insight: "The professionals convert everything to money before they trade. Pip values are how the chart becomes a P&L."
        },
        {
          eyebrow: "Elite · The unit",
          title: "Lot Size Is a Risk Decision",
          lead: "A lot is a unit of exposure — but how much you trade is not a volume decision. It is a risk decision wearing a volume costume.",
          body: [
            "One standard lot is 100,000 units; a mini lot is 10,000; a micro lot is 1,000. The number matters only because of what it does to your pip value: a standard lot of EUR/USD moves $10 per pip, a mini $1, a micro $0.10. The same 50-pip move is $500, $50, or $5 — depending only on the lot.",
            "The professional's habit: decide your risk in money first, then convert to lots. If your account is $5,000 and your rule is 1% risk, that's $50 — a 20-pip stop on EUR/USD allows a quarter-lot at most. Most beginners do it backwards: they pick the lot, then discover the risk. That order is the whole problem."
          ],
          bullets: [
            "Risk first, lots second — never the reverse",
            "Lot size exists to convert a percentage rule into market exposure",
            "The market pays in pips and bills you in money — the lot is the translator"
          ],
          insight: "Every blown account I've studied had a moment where the lot size was chosen before the risk was defined."
        },
        {
          eyebrow: "Elite · The loan",
          title: "Leverage Is a Loan, Not a Gift",
          lead: "Leverage is borrowed buying power, and margin is the deposit on that loan. It amplifies both sides of the trade — and the loan always gets repaid.",
          body: [
            "At 100:1, $1,100 of margin controls $110,000 of exposure. The broker is not giving you money — they are lending you risk. If the trade goes your way, you keep the profit. If it goes against you, the loan is repaid from your equity, and when your equity runs out, the broker does not wait politely.",
            "The honest maths: a 1% move against a fully-leveraged 100:1 account is a 100% loss. A 1% move against a 10:1 account is a 10% loss. Same market, same move, radically different trader. Leverage did not change the market — it changed your survival odds."
          ],
          bullets: [
            "Margin is the deposit; leverage is the loan; equity is the collateral",
            "Leverage amplifies wins and ruin equally — it has no opinion about which",
            "The question is never 'how much can I control' but 'how much can I lose and still trade tomorrow'"
          ],
          callout: "The broker lends you the rope. The market decides whether it's a swing or a noose.",
          insight: "Use leverage the way a professional uses a knife — as a tool with a handle, not a blade you grab."
        },
        {
          eyebrow: "Elite · The math of ruin",
          title: "Margin, Free Margin, and the Call",
          lead: "Equity, used margin, free margin, margin level — four numbers that decide whether you trade another day. Most beginners learn them the hard way.",
          body: [
            "Equity is your balance plus or minus your floating P&L. Used margin is the collateral locked by your open positions. Free margin is what's left — your capacity to open new positions. Margin level is equity divided by used margin, as a percentage, and it is the gauge the broker watches.",
            "When margin level falls toward the broker's threshold, the margin call fires: the broker begins closing positions, usually starting with the largest loss, until the level is restored. There is no negotiation, no 'one more minute.' The Elite habit: treat free margin as a warning gauge, not a spending budget — and never let a position grow until its margin is the size of your entire account."
          ],
          bullets: [
            "Margin level = equity ÷ used margin — the broker's dashboard on your survival",
            "Free margin is capacity, not an invitation to go bigger",
            "The margin call is the market taking the loan back — you don't get a vote"
          ],
          example: "$5,000 account, $4,900 locked in margin, $100 free → margin level ≈ 102%. One losing pip starts the closing process. That is not a trade; that is a trap you built.",
          insight: "The professionals never meet their margin call, because they've already defined the worst case on every single position."
        },
        {
          eyebrow: "Elite · The mechanics",
          title: "Shorting Is Borrowing",
          lead: "When you go short, you sell something you don't own — which means the market, behind the scenes, lends it to you. Understanding the mechanics changes how you respect the position.",
          body: [
            "You short EUR/USD: you sell euros you don't hold. Your broker effectively borrows them, sells them at the current price, and holds the proceeds. If EUR falls, you buy them back cheaper, return the loan, and keep the difference. If EUR rises, you buy them back more expensively — the loan costs you.",
            "The hidden gem: every short has a long on the other side, and the market balances them in real time. The market is not against you; it is indifferent to you. What it does punish is someone who doesn't understand which side of the loan they're on."
          ],
          bullets: [
            "Short = sell now, buy back later — the loan settles at the end",
            "Every position has a counterparty — the market always balances",
            "Respect the borrowed position: it can move against you without limit in theory"
          ],
          insight: "The market doesn't care if you're long or short. It cares whether you understand the position you're holding."
        },
        {
          eyebrow: "Elite · The daily tax",
          title: "Rollover and the Swap Clock",
          lead: "Every position held past a specific moment each day pays or receives interest — and this quiet mechanism is where carry trades are born and careless positions bleed.",
          body: [
            "At the daily rollover time, the interest rate differential between the two currencies in your pair is applied to your position. If you hold a currency with a higher rate and sell one with a lower rate, you can earn swap; the reverse pays it. On many brokers, the Wednesday rollover is tripled to cover the weekend.",
            "For a scalper closing every position same-day, swap is noise. For a swing or position trader holding for weeks, it is a real cost — or a real income stream. The carry trade is simply this mechanism, deliberately harvested. The Elite habit: know your pair's swap rate before you decide to hold overnight — and never let a swap charge be the surprise that turns a winner into a loss."
          ],
          bullets: [
            "Rollover = the daily interest transfer between two currencies",
            "Wednesday is often triple — the weekend is charged in advance",
            "Holding overnight is a decision with a price tag; price it before you hold"
          ],
          insight: "The professionals read the swap clock like a pilot reads a fuel gauge — before it matters."
        },
        {
          eyebrow: "Elite · The triangulation",
          title: "Cross Rates Are Made, Not Given",
          lead: "EUR/GBP doesn't need a direct market to exist. It is constructed from two majors — and understanding the construction reveals how the whole market is woven together.",
          body: [
            "EUR/GBP ≈ EUR/USD ÷ GBP/USD. Cross rates are derived from the major pairs, which is why a price discrepancy between a cross and its synthetic construction disappears in seconds — arbitrageurs take it. The market's efficiency is not magic; it is people hunting for exactly these gaps.",
            "For you, the lesson is structural: currencies do not trade in isolation. When you trade a cross, you are trading two opinions about two currencies against each other — and the funding, the rollover, and the volatility all flow from that relationship. The Elite read: a move in EUR/GBP is rarely about EUR or GBP alone — it is about the relative strength of both."
          ],
          bullets: [
            "Cross = one major divided by another — the market is a web, not a list",
            "Discrepancies get arbitraged away in seconds — don't chase 'free money'",
            "Trade the cross, but read both currencies behind it"
          ],
          insight: "Every cross is a story about two currencies and their audience — the rest of the market."
        },
        {
          eyebrow: "Elite · The order book",
          title: "Order Types at Depth",
          lead: "Market orders consume liquidity; limit orders provide it; stop orders become market orders the moment they trigger. Each one interacts with the market differently — and each one fills differently.",
          body: [
            "A market order takes whatever price is available — instant, but you pay the spread and any slippage. A limit order states a price you refuse to pay above (or accept below) — patient, and it joins the liquidity pool. A stop order waits for the price to reach a level, then fires as a market order — the classic breakout and stop-loss tool, which means it fills at whatever the market is doing at that moment, not at your level.",
            "The stop-limit combines both: it triggers a limit order at the stop price. You cap the worst price — but in a fast move, price can blow past your limit and you never fill. The Elite distinction: know what each order does to price, and what price does to each order. That awareness is the difference between an intended fill and a surprised one."
          ],
          bullets: [
            "Market = liquidity taken. Limit = liquidity given. Stop = triggered market",
            "Stop-losses fill at market — in a gap, you get the gap, not your level",
            "Choose the order type that matches the move you're actually trading"
          ],
          callout: "The market doesn't know your intent. It only knows your order — and it fills it accordingly.",
          insight: "Half of execution is the order type. The other half is knowing what the order type will do when the market is moving."
        },
        {
          eyebrow: "Elite · The two-way door",
          title: "Bid, Ask, and the Market Maker",
          lead: "You never buy at the same price you sell. The bid-ask spread is the door between you and the market — and the market maker is the one holding it open.",
          body: [
            "You buy at the ask — the higher price. You sell at the bid — the lower one. The difference is the spread, and it is the market maker's wage: they stand ready to take the other side of your trade, managing their inventory and profiting from the flow. On the majors the spread is a few pips; on exotics it can be dozens.",
            "The Elite reframe: the spread is not a broker trick — it is the price of instant liquidity. Every round trip pays it, which is exactly why cost-awareness (from the Chapter 1 Elite lane) is not optional. The professional doesn't fight the spread; they know it, price it into every entry, and trade pairs and hours where it is cheapest."
          ],
          bullets: [
            "Buy the ask, sell the bid — the spread is the toll on every round trip",
            "The market maker earns the spread; you pay it — that's the design, not a bug",
            "Trade the liquid hours and the liquid pairs, and the toll shrinks"
          ],
          insight: "The bid-ask spread is the market's quietest cost and its most constant one."
        },
        {
          eyebrow: "Elite · The fill",
          title: "Slippage Lives Where Liquidity Dies",
          lead: "The price you see and the price you get are two different things when the market moves fast. Slippage is the difference — and it is worst exactly when you need the best fill.",
          body: [
            "In a quiet market, your order fills at or near the quoted price. In a news spike or a breakout through thin liquidity, the market can skip levels — your market order fills at whatever price is available, which may be worse than the last quote you saw. This is why stop-losses can fill beyond their level in fast moves, and why limit orders can sit unfilled while price runs away.",
            "The Elite habits: avoid market orders into news you can't read; widen your expectations during high-impact releases; and remember that a 'guaranteed stop' is a specific product with a cost — a plain stop order carries no guarantee at all. Slippage is not punishment. It is the honest price of speed."
          ],
          bullets: [
            "Slippage = the gap between expected and actual fill — worst in fast markets",
            "A stop order fills at market; a guaranteed stop is a different, paid product",
            "Know your market's liquidity hours, and trade your orders accordingly"
          ],
          insight: "In fast markets, the price you get is a negotiation with liquidity. Prepare for the negotiation before you enter."
        },
        {
          eyebrow: "Elite · The clock",
          title: "Session Mathematics",
          lead: "The forex market is open nearly around the clock — but it is not alive around the clock. Liquidity, volatility, and spreads all follow the session clock.",
          body: [
            "The four major sessions — Sydney, Tokyo, London, New York — overlap only at specific hours, and the overlaps are where the flow concentrates. The London–New York overlap is the crown: both the world's biggest liquidity pools are open, spreads tighten, and the day's real moves often begin. Tokyo–London carries Asia's hand-off; the middle of the New York session and the Sydney lull are where markets sleep.",
            "The Elite read: your strategy has a home time. A London-breakout scalper trades hours the Sydney trader never sees. A position trader can ignore the clock entirely and let rollover be their only cost. Trading the right hours is a decision, not an accident — and knowing your session's personality is part of knowing your strategy."
          ],
          bullets: [
            "Overlaps = liquidity, tight spreads, and the real moves",
            "London–New York is the day's peak — know when it is on your chart",
            "Match your strategy to its best hours, and size down outside them"
          ],
          insight: "The market has a heartbeat. Trade when it's strongest, and rest when it sleeps."
        },
        {
          eyebrow: "Elite · The counterparty",
          title: "Your Broker: Friend or Foe?",
          lead: "Someone is always on the other side of your trade. Knowing who — and how they earn — changes how you read your fills, your platform, and your risk.",
          body: [
            "Market makers quote prices and take the other side of your order; their model can profit when you lose, which is a conflict to understand, not to fear. ECN/STP brokers route your orders to the interbank market and earn commission or a markup on the spread; their model doesn't depend on your losses. Neither is automatically evil — but each has an incentive structure, and a professional knows which one they're trading through.",
            "The Elite habit: know your execution model like you know your strategy — what your broker earns, how they route, whether they have a dealing desk, and what their re-quotes or execution gaps mean. The broker is your gateway, not your partner and not your enemy. The market is the only counterparty that matters — and it never told you who it is."
          ],
          bullets: [
            "Market maker = takes the other side; ECN/STP = passes you through",
            "Understand the incentive structure — it shapes your fills",
            "The broker is infrastructure. Trade like you know what's behind the counter"
          ],
          insight: "You don't need to love your broker. You need to understand their model — and never confuse it with the market."
        },
        {
          eyebrow: "Elite · The hidden gem",
          title: "The Terminology of Thought",
          lead: "Here is the hidden gem this lane exists to hand you: the market's language is a thinking tool. Every concept you name precisely is a decision you can audit.",
          body: [
            "'Guaranteed stop' and 'stop order' are different products. 'Leverage' and 'margin' are different numbers. 'Volatility' and 'risk' are different dangers. 'Balance' and 'equity' are different truths about your account — balance is what you started with, equity is what you'd have right now if everything closed. A trader who blurs these words will make decisions as blurred as the words.",
            "The Elite difference is not more vocabulary — it is sharper vocabulary. When your words are precise, your journal entries are precise, your reviews are precise, and your improvements are precise. Fuzzy language is not a style; it is a leak. The trader who names things correctly can be taught, reviewed, and improved — and that trader is the one who compounds."
          ],
          bullets: [
            "Balance ≠ equity ≠ free margin — each is a different truth about your account",
            "A precise word is a precise decision; a fuzzy word is a hidden leak",
            "The journal is only as sharp as the language it's written in"
          ],
          callout: "Trade in the language of professionals, and you will start thinking in it.",
          insight: "Precision of language is the cheapest edge in the market — and the most ignored."
        },
        {
          eyebrow: "Elite · The foundation",
          title: "The Base of the Pyramid",
          lead: "Everything this course builds — risk management, analysis, execution, psychology — sits on the vocabulary you now hold. This is the base of the pyramid, and bases take weight.",
          body: [
            "Later chapters will ask you to compute position size, read a candle, manage a drawdown, and journal a losing day. Every one of those skills assumes this language is automatic: pairs, pips, lots, leverage, margin, rollover, sessions, order types. The trader who hesitates on the words will hesitate on the decisions — and hesitation in a fast market has a price.",
            "The meta-trade, stated plainly: you cannot manage what you cannot name. Name the position, name the risk, name the cost, name the session — and the market, which rewards precision, starts paying you for it. The Summit continues in Chapter 3's Elite lane, where the same sharpening turns economics into an edge."
          ],
          bullets: [
            "The language is the foundation — everything later builds on it",
            "Automatic vocabulary means automatic risk awareness",
            "This lane exists to make the words second nature before the money is real"
          ],
          insight: "Professionals are not smarter — they are more precise. Precision is trainable, and you just trained it."
        },
        {
          kind: "pause",
          eyebrow: "Elite · Breathe",
          title: "Reset Before the Test",
          lead: "You've just absorbed the mechanics most traders never learn — the loan, the tax, the clock, the order book. Close your eyes for one breath — in for four, out for four — and let the machinery settle.",
          body: [
            "The next ten questions are the Elite gate for terminology: pip values, margin, rollover, triangulation, order depth. They assume you understood the mechanics, not memorised the words. Take the breath. Then prove it."
          ]
        },
        null, null, null, null, null, null, null, null, null, null,
        {
          kind: "close",
          eyebrow: "Elite chapter complete",
          title: "You Speak the Machine's Language",
          body: [
            "You entered with words and leave with mechanics: pip values that become money, leverage that is a loan, the margin call, the swap clock, the cross-rate web, the order book, and the broker behind the counter.",
            "This is the Elite difference: not more definitions, but the layer of understanding Standard assumes you don't need yet. You've earned the maths of the language. Finish the test, and the Summit continues in Chapter 3's Elite lane."
          ]
        }
      ]
    }
