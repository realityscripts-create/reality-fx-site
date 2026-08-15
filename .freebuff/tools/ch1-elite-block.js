    elite: {
      slides: 27,
      quizSlides: [17,18,19,20,21,22,23,24,25,26],
      quiz: [
        { q: "A strategy wins 40% of the time. Average win is +3R, average loss is −1R. What is the expectancy per trade?",
          options: ["+0.6R", "+1.2R", "+0.2R", "−0.6R"], answer: 0,
          explain: "Expectancy = (0.40 × 3R) − (0.60 × 1R) = +0.6R per trade. Positive expectancy is the whole game — everything else is execution of that edge." },
        { q: "At a 1:2 reward-to-risk ratio, the breakeven win rate (before costs) is…",
          options: ["50%", "33.3%", "66.7%", "25%"], answer: 1,
          explain: "Breakeven = risk ÷ (risk + reward) = 1 ÷ 3 ≈ 33.3%. You only need to win one in three to break even — and costs (the spread tax) push that number higher." },
        { q: "Why does most retail forex volume NOT move price?",
          options: ["Retail orders are a rounding error next to interbank flow", "Banks ignore retail entirely"], answer: 0,
          explain: "The $7.5 trillion a day is mostly interbank and institutional flow. Your order is a liquidity event, not a price mover — which is why your edge must be structural, not size-based." },
        { q: "A 50/50 strategy at 1:1 reward-to-risk, trading through a 1-pip spread, will over many trades…",
          options: ["Lose the spread on every round trip", "Break even exactly", "Win slightly"], answer: 0,
          explain: "Every round trip pays the spread. A strategy with zero edge but 100% cost loses exactly the spread per trade — costs are the house edge you must overcome." },
        { q: "The Kelly criterion gives the bet size for maximum long-run growth. Why do professionals use far less than full Kelly?",
          options: ["Volatility drag: geometric growth is lower than arithmetic, and full Kelly risks ruin", "Because they are scared"], answer: 0,
          explain: "Full Kelly maximises long-run growth but with brutal swings — one bad streak can ruin you before the maths pays. The geometric mean is always below the arithmetic mean; sizing down smooths the curve and keeps you alive." },
        { q: "Volatility and risk are different. Which statement is accurate?",
          options: ["Volatility is price movement; risk is the probability of permanent loss", "They are exactly the same thing"], answer: 0,
          explain: "Volatility is noise you can survive; risk is the chance of losing capital you can't get back. Confusing them makes traders overtrade (chasing volatility) or freeze (fearing it)." },
        { q: "Honest base rates: studies of real retail forex client data typically show that the majority of traders…",
          options: ["Lose money over time", "Break even", "Win consistently"], answer: 0,
          explain: "Across brokers publishing real client performance, 70%+ of retail traders lose. The base rate is against you — the only way to beat it is process, risk control and a real edge. Knowing the number is the first step to not being it." },
        { q: "Second-order thinking means…",
          options: ["Anticipating what everyone else will do, and how that shapes price", "Copying the first setup you see"], answer: 0,
          explain: "Most traders ask 'what will the market do?' Professionals ask 'what does the crowd believe, and what happens when they're wrong?' That second question is where institutional money lives." },
        { q: "The same strategy in a trending market versus a ranging market will…",
          options: ["Have different expectancy — the strategy must fit the regime", "Perform identically"], answer: 0,
          explain: "Trend-following bleeds in ranges; mean-reversion dies in trends. Regime is the environment your edge lives in — reading it before you trade is half the edge itself." },
        { q: "The 'meta-trade' — the highest-leverage trade available to any trader — is…",
          options: ["Improving your own process and discipline", "Finding a bigger account"], answer: 0,
          explain: "A bigger account with a broken process is just a bigger donation. The trader with a written plan, defined risk and honest review has an edge no market condition can take away — that's the trade that pays forever." }
      ],
      native: [
        {
          eyebrow: "Elite · Beyond the asset",
          title: "The Market Is a Probability Machine",
          lead: "Forget everything the ads promise. The market is not a prediction engine — it is a machine that redistributes money according to probabilities. Your job is not to be right. Your job is to be on the right side of the maths.",
          body: [
            "A single trade is a roll of the dice with tilted odds. The tilt is your edge — and it only shows over many rolls. This is the first truth of the Elite lane: you cannot judge a single trade, a single day, or even a single week. You judge the process across a statistically meaningful sample.",
            "The beginner asks 'will this trade work?' The professional asks 'does this system work over 200 trades?' One question leads to gambling; the other leads to compounding."
          ],
          bullets: [
            "One trade proves nothing; 200 trades reveal the truth",
            "If your edge is real, a losing streak is just noise inside a winning distribution",
            "The market pays the process, not the prediction"
          ],
          callout: "The market doesn't care if you're right. It pays whoever survives the maths.",
          insight: "Judge every decision by process, every system by sample size. That single habit separates professionals from everyone else."
        },
        {
          eyebrow: "Elite · The only number",
          title: "Expectancy — the Only Number That Matters",
          lead: "Every strategy has one number that tells you whether it deserves your money: expectancy — the average result of one trade, computed across the distribution.",
          body: [
            "Expectancy = (win rate × average win) − (loss rate × average loss). If it's positive, the strategy has an edge. If it's zero, you're paying the spread to gamble. If it's negative, no amount of discipline can save it.",
            "Here is the hidden gem most traders never calculate: you can lose more often than you win and still compound beautifully. A 40% win rate at 3R average win and 1R average loss gives +0.6R per trade. Ten trades: +6R. A hundred: +60R. The win rate was irrelevant — the expectancy was the edge."
          ],
          bullets: [
            "Expectancy is computed BEFORE you trade, not after",
            "A positive-expectancy system with a bad week is fine; a negative system with a good week is a trap",
            "Write your expectancy down. If you can't compute it, you don't have an edge — you have a hope"
          ],
          example: "Win 40% of the time, average win +3R, average loss −1R → 0.40×3 − 0.60×1 = +0.6R per trade. Over 100 trades: +60R.",
          insight: "This is the maths that makes risk management sacred — because risk management is what turns a positive expectancy into real money."
        },
        {
          eyebrow: "Elite · The players",
          title: "Who Actually Moves Price",
          lead: "Not you. Not the person you're copying on social media. Price is moved by the institutions that hold the liquidity — and understanding that ladder changes how you read every chart forever.",
          body: [
            "At the top sit central banks and the biggest commercial banks, managing national currencies and client flow. Below them, the funds — hedge funds, asset managers, prop desks — placing institutional-size orders. Below them, the brokers who aggregate retail. And at the bottom: retail traders, thousands of small orders that are a rounding error to the machine.",
            "This hierarchy is why your orders get filled so easily. Someone is always on the other side — usually a professional with a bigger plan than your stop. That isn't scary; it's clarifying. It means your edge must be structural: better risk, better process, better maths. Not bigger bets."
          ],
          bullets: [
            "Institutions are the price; retail rides the liquidity they create",
            "Your stop-loss is a liquidity event to someone else — placing it thoughtfully matters",
            "Never fight a hierarchy you can't see — trade the structure it leaves behind"
          ],
          callout: "The market is a room full of people bigger than you. Your edge is not fighting them — it's joining their maths.",
          insight: "Most retail losses aren't bad analysis — they're being on the wrong side of the flow, repeatedly, without knowing it."
        },
        {
          eyebrow: "Elite · The illusion",
          title: "The $7.5 Trillion Illusion",
          lead: "You've heard the number: $7.5 trillion trades in forex every day. What almost nobody tells you is what that number actually is — and what it isn't.",
          body: [
            "The overwhelming majority of that volume is interbank, derivative and speculative flow — banks hedging, funds rotating, algorithms transacting. Very little of it is 'physical' currency being exchanged for goods. The forex market is not the world's largest marketplace for money; it is the world's largest marketplace for opinion.",
            "What does that mean for you? Price moves on opinion, expectation and liquidity — not on 'true value' in any ordinary sense. Your edge lives in the gap between what people expect and what actually happens. That gap is where every professional trade is made."
          ],
          bullets: [
            "Most volume is speculation, not commerce",
            "Price is a consensus of expectations, updated every second",
            "Your edge: be on the side of the update, not the crowd's static opinion"
          ],
          insight: "When you understand the market as a machine of opinion, the charts stop being mysterious and start being a live poll of everyone's beliefs."
        },
        {
          eyebrow: "Elite · The truth",
          title: "The Zero-Sum Truth",
          lead: "Forex is closer to zero-sum than almost any market you can trade. For every winner there is a loser — and after costs, it's actually negative-sum. Someone has to be wrong, and mostly, it's the unprepared.",
          body: [
            "This sounds grim. It is actually liberating. If the market were a rising tide that lifted everyone, there would be no skill in it — just participation. Because it's zero-sum, your edge is worth something. Because it's negative-sum after costs, your edge has to be real.",
            "The philosophical heart of the Elite lane: the market owes you nothing. Every rand you take from it, you take with process. Every rand it takes from you, it takes because you handed it over without one. That asymmetry is the entire profession — and it's why this course teaches risk before reward."
          ],
          bullets: [
            "Zero-sum before costs; negative-sum after — costs must be beaten, not ignored",
            "Your edge is only real if it survives transaction costs",
            "The market's mercy is a myth; its maths is not"
          ],
          callout: "The market doesn't owe you anything. Everything you take from it, you take with process.",
          insight: "Zero-sum is the cleanest argument for discipline ever written: if you don't have an edge, you're the donation."
        },
        {
          eyebrow: "Elite · The hidden gem",
          title: "Liquidity Is the Real Asset",
          lead: "Here is the secret the Elite lane exists to teach: the most valuable thing in the market is not price direction. It is liquidity. Institutions don't trade for pips — they trade where the money is, and the money is wherever orders cluster.",
          body: [
            "Think about your stop-loss. The moment it triggers, it becomes a sell order — liquidity for someone on the other side. The market is drawn to liquidity like water to a low point: price hunts the levels where stops and orders pile up, because that's where the fuel is. This is why price 'returns' to obvious levels, why breakouts accelerate, why support and resistance feel magnetic.",
            "Once you see the market as a liquidity machine instead of a direction contest, your entire chart reading changes. Levels aren't magic — they're memories of where real orders sat, and magnets for the ones to come."
          ],
          bullets: [
            "Your stop is someone else's opportunity — place it where you'd want to trade against it",
            "Price hunts liquidity: clustered stops, obvious levels, breakout fuel",
            "Think in liquidity, and direction becomes a consequence, not a guess"
          ],
          insight: "The traders who understand liquidity don't predict the market — they position where the market is being pulled."
        },
        {
          eyebrow: "Elite · The tax",
          title: "The Bid-Ask Tax",
          lead: "The spread is not a detail. It is a tax on every round trip you take — and it is the single most underestimated cost in all of trading.",
          body: [
            "Here is the maths that humbles beginners: a 50/50 strategy at 1:1 reward-to-risk, trading through a 1-pip spread, loses exactly the spread per round trip over time. Zero edge, full cost. The breakeven win rate is not 50% — it's 50% plus the cost. At a wider spread, or on a scalp, the tax can eat a third of your edge before you even enter.",
            "This is why the Elite lane demands cost-awareness as a core skill: know your spread, your commission, your slippage, and your swap. A strategy that looks profitable on a clean chart can be dead on arrival once the tax is paid."
          ],
          bullets: [
            "Breakeven win rate = risk ÷ (risk + reward), then add the cost",
            "The tighter your style's time horizon, the louder the tax",
            "If your edge doesn't beat the tax, it isn't an edge — it's a donation with extra steps"
          ],
          example: "1:2 reward-to-risk needs 33.3% wins to break even. Add a 2% cost drag and you need closer to 40% — a 20% raise in the difficulty of the game.",
          insight: "Professionals know their all-in cost per round trip to the fraction of a pip. It's boring. It's also why they survive."
        },
        {
          eyebrow: "Elite · The distinction",
          title: "Volatility Is Not Risk",
          lead: "These two words are used as if they were the same. They are not — and confusing them is one of the most expensive mistakes in trading.",
          body: [
            "Volatility is how much price moves — the size of the swings, the noise. Risk is the probability of permanent loss — the chance that a position, a strategy, or an account never comes back. A volatile market can be low-risk if your position is small and your stop is sound. A calm market can be high-risk if you're over-leveraged and over-exposed.",
            "The trader who confuses them does one of two things: overtrades to 'capture volatility' and gets chopped to pieces, or hides from movement entirely and never builds an edge. The professional measures both separately — and sizes against risk, not against volatility."
          ],
          bullets: [
            "Volatility = how much it moves. Risk = what it can cost you permanently",
            "Small size + wide stop = low risk in a volatile market",
            "Big size + tight stop = high risk even in a quiet market",
            "Size against risk, never against the excitement"
          ],
          insight: "The market's swings are weather; your position size is the boat. The boat is the only thing you control."
        },
        {
          eyebrow: "Elite · The maths of growth",
          title: "The Kelly Criterion — and Why We Don't Full-Kelly",
          lead: "There is a formula that tells you the mathematically optimal bet size for maximum long-run growth. Its name is Kelly — and the professional's relationship with it is the most important sizing lesson in the course.",
          body: [
            "Kelly says: bet a fraction of your capital equal to your edge divided by your odds. Sounds perfect. But here's the catch the formula's fans forget — full Kelly assumes you can survive the swings. The geometric reality is brutal: if you lose 50% once, you need 100% to recover. A single bad streak at full Kelly can take you out of the game before the maths pays you.",
            "This is why the Academy's standard is 1–2% risk per trade — a fraction of even conservative Kelly. It trades a little long-run growth for massive survival. The trader who survives every drawdown is the trader who is still compounding when the market turns their way. Asymmetry, again: you can't win the game in one trade, but you can lose it in one. Guard that side."
          ],
          bullets: [
            "Geometric mean is always below arithmetic mean — volatility drag is real",
            "Full Kelly maximises growth but risks ruin; fractional Kelly trades speed for survival",
            "1–2% risk isn't timid — it's the optimal long-run strategy once survival is priced in"
          ],
          insight: "The market rewards the patient and taxes the desperate. Kelly is the maths of that sentence."
        },
        {
          eyebrow: "Elite · The honest number",
          title: "The Base Rate of Trading",
          lead: "Before you trade a single real rand, you deserve to know the honest numbers. The base rate is against you — and facing it is the first act of professionalism.",
          body: [
            "Brokers who publish real client performance data consistently show the majority of retail traders lose money over time — in most studies, 70% or more. Not because the market is rigged. Because the base rate reflects unpreparedness: no edge, no risk control, no process, and costs that quietly bleed the account.",
            "The Elite response is not despair — it's defiance with maths. You are not required to be part of the base rate. You are required to do what the base rate does not: compute your expectancy, size your risk, follow your plan, review honestly. That is not a slogan. It is a checklist with data behind it."
          ],
          bullets: [
            "Most retail traders lose — that's the environment you're trading in, not a personal judgement",
            "The base rate is beaten by process, not by prediction",
            "Knowing the number is the first step to not being it"
          ],
          callout: "You don't beat the base rate by being smarter. You beat it by being more systematic.",
          insight: "The professional doesn't hope to beat the odds — they rebuild the odds in their favour, one controlled decision at a time."
        },
        {
          eyebrow: "Elite · The environment",
          title: "Regime Thinking",
          lead: "The market is not one thing. It cycles through regimes — trending, ranging, volatile, quiet — and your strategy's expectancy changes with the regime. Most losing streaks aren't broken strategies; they're good strategies in the wrong weather.",
          body: [
            "A trend-following approach bleeds in a range. A mean-reversion approach dies in a trend. The same setup that printed money in March can lose it in June — not because it broke, but because the regime changed. This is why the Elite lane teaches you to name the regime before you trade it.",
            "The market is always telling you what it is. Wide ranges that hold their boundaries, breaks that follow through, volatility that compresses before it explodes — the chart is a report on its own behaviour. Read the report, and your strategy stops being a guess and starts being a tool used in the right conditions."
          ],
          bullets: [
            "Name the regime first: trend, range, or transition",
            "A strategy is a tool — tools work in the right conditions",
            "When the regime changes, your size and frequency change with it"
          ],
          insight: "The market doesn't owe you the same conditions twice. Adapt, or be adapted."
        },
        {
          eyebrow: "Elite · The philosophy",
          title: "Second-Order Thinking",
          lead: "The beginner asks one question: what will the market do? The professional asks the question behind the question: what does everyone else believe, and what happens when they're wrong?",
          body: [
            "First-order thinking is the crowd's game — everyone sees the same news, the same chart, the same 'obvious' trade. Second-order thinking asks what the crowd's action will create. When everyone is certain of a direction, the fuel for the move is spent — the crowd has already positioned. The professional asks: who's left to buy, and who's already sold?",
            "In forex, second-order thinking shows up as reading positioning: when sentiment reaches euphoric extremes, the smart money is quietly doing the opposite of what feels safest. Not because they 'know the future' — because they know the crowd has run out of fuel. That's a probability edge, not a crystal ball."
          ],
          bullets: [
            "First-order: what will happen? Second-order: what will everyone else's reaction cause?",
            "Extreme consensus is a warning sign, not a confirmation",
            "Trade the gap between expectation and reality — that's where the money moves"
          ],
          callout: "The crowd is usually right about direction and usually wrong about timing. Timing is where the professionals live.",
          insight: "Second-order thinking is the difference between reading the news and reading the room."
        },
        {
          eyebrow: "Elite · The invisible costs",
          title: "The Invisible Costs",
          lead: "Beyond the spread sits a family of costs nobody advertises — and together they can turn a 'profitable' strategy into a losing one while the chart looks perfect.",
          body: [
            "Slippage — the gap between the price you wanted and the price you got, worst in fast markets. Commission and swap, which compound on every position held overnight. And the psychological cost: the mistakes, the revenge trades, the hesitation — each with a price tag in pips. The full cost of trading is spread + commission + slippage + swap + you.",
            "The Elite habit: know your all-in cost per round trip to the fraction of a pip, and subtract it from your expectancy before you trust it. If a strategy's edge is thinner than its costs, it isn't a strategy — it's a hobby with fees."
          ],
          bullets: [
            "Slippage is worst exactly when you need the best fill — the news, the spike, the breakout",
            "Costs compound; a 2% drag over 100 trades is a different game than one trade",
            "Subtract your all-in cost from expectancy before you believe it"
          ],
          insight: "The market doesn't tax your intelligence. It taxes your execution — and the tax is invisible until you look."
        },
        {
          eyebrow: "Elite · The data",
          title: "Sentiment as Data — Reading Positioning",
          lead: "The crowd's emotions are not something to feel — they are something to read. Positioning is data, and it's among the most honest data in the market.",
          body: [
            "When everyone is bullish, the buyers are already in — who's left to push price higher? When everyone is bearish, the sellers are spent, and the fuel for a bounce is building. Extreme sentiment isn't a signal to fade blindly — it's a flag that the crowd's fuel is running low, which changes the probability of what happens next.",
            "The Elite distinction you must hold: your own fear and greed are the thing to control; the crowd's fear and greed are the thing to read. The trader who confuses them is the trader who says 'I'm scared, so the market must be scared' — and exits into the exact move they should have ridden."
          ],
          bullets: [
            "Positioning is fuel — extreme consensus means the tank is nearly empty",
            "Read the crowd's emotions; control your own",
            "Sentiment is a context tool, never a standalone signal"
          ],
          insight: "Learn to read positioning, not your pulse. The gap between them is where the professionals operate."
        },
        {
          eyebrow: "Elite · The meta-trade",
          title: "The Meta-Trade",
          lead: "Every lesson in this Elite lane has been building to one conclusion: the highest-leverage trade you will ever place is not a currency pair. It is your own process.",
          body: [
            "Think about the maths honestly. A trader with a written plan, defined risk, and honest review has an edge that no market condition can take away. A trader with a big account and no process has a donation with a timetable. Which one is more likely to survive the base rate? The answer is not close.",
            "This is why the Academy is built the way it is — the reflection periods, the integrity monitor, the journal, the laboratory, the badges. Every mechanism is a tool for the meta-trade: turning you into the kind of trader whose process compounds. The market is the opponent; discipline is the game."
          ],
          bullets: [
            "The meta-trade is improving the trader — you are the asset that compounds",
            "Process beats prediction, always, in the long run",
            "Every lesson is a trade; every trade is a lesson — the meta-trade is both"
          ],
          callout: "You are not trying to beat the market. You are trying to become the kind of trader the market can't break.",
          insight: "The greatest edge in trading is the trader who keeps showing up, keeps reviewing, and keeps improving. That's the trade that pays forever."
        },
        {
          kind: "pause",
          eyebrow: "Elite · Breathe",
          title: "Reset Before the Test",
          lead: "You've just absorbed more genuine depth than most traders ever learn. Close your eyes for one breath — in for four, out for four — and let the maths settle.",
          body: [
            "The next ten questions are the Elite gate: expectancy, costs, regime, positioning. They assume you understood the concepts, not memorised the words. Take the breath. Then prove it."
          ]
        },
        null, null, null, null, null, null, null, null, null, null,
        {
          kind: "close",
          eyebrow: "Elite chapter complete",
          title: "You Now See the Machine",
          body: [
            "You entered the market and left with the machine's blueprints: probability, expectancy, liquidity, cost, regime, positioning — and the meta-trade that sits above them all.",
            "This is the Elite difference: not harder versions of the same facts, but the layer of understanding the Standard course assumes you don't need yet. You've earned the maths. Finish the test, and the Summit continues in Chapter 2's Elite lane."
          ]
        }
      ]
    },
