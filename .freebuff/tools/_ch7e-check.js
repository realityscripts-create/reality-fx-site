const C = {
    elite: {
      slides: 30,
      quizSlides: [20,21,22,23,24,25,26,27,28,29],
      quiz: [
        { q: "A 50% drawdown requires what gain to recover?",
          options: ["50%", "100% — the recovery needed is always larger than the loss, because the base it compounds from is smaller", "75%", "25%", "Never recoverable"], answer: 1,
          explain: "A 50% loss turns R100 into R50; recovering R50 needs R50 on top of R50 = 100%. The asymmetry is brutal and compounding: a 30% drawdown needs 43% to recover; a 60% needs 150%. The deeper layer: this is why drawdown control is the first number — the loss is not just the money lost, it is the larger recovery required, and the deeper the hole, the steeper the climb out." },
        { q: "Risk of ruin is…",
          options: ["The probability of a bad day", "The probability that a losing streak exhausts the account before the edge can pay — and it rises with size and falls with the number of losing trades the account can survive", "The broker's risk", "Always zero for a good strategy", "The probability of a good day"], answer: 1,
          explain: "Risk of ruin is the endgame probability: given the strategy's edge and the account's size relative to per-trade risk, how likely is a streak that ends the account? The deeper layer: it is why 1% risk is the professional standard — at 1%, a brutal 20-loss streak costs 18% of the account and the trader survives to trade the edge; at 5%, the same streak is a 64% hole from which recovery is nearly impossible. The size is not about the single trade — it is about the probability of surviving the streaks that the edge's own statistics guarantee." },
        { q: "The 1% risk standard exists because…",
          options: ["It is a round number", "It balances the two requirements — enough size to matter when right, and enough survival to be right many times: a risk level that lets the account survive the losing streaks the edge guarantees", "Brokers require it", "It maximizes short-term profit", "It is the smallest possible risk"], answer: 1,
          explain: "The 1% standard is the balance point: small enough that a normal losing streak costs the account little, large enough that the edge's gains compound meaningfully. The deeper layer: the exact number matters less than the principle — the risk per trade must be small relative to the account's ability to survive streaks, and the professional derives their number from their own drawdown tolerance and win rate, not from the round figure. The standard is the survival rule wearing a percentage." },
        { q: "Position size is best computed as…",
          options: ["The largest lot the broker allows", "Risk ÷ stop distance — the money you are willing to lose divided by the distance to the stop, converted into units, so every trade risks the same percentage regardless of the setup", "A fixed lot every time", "The account balance divided by ten", "The pip value multiplied by the leverage"], answer: 1,
          explain: "Position sizing is the bridge between the risk percentage and the market's geometry: risk ÷ stop distance = size. A trade with a 20-pip stop and a trade with a 60-pip stop risk the same money only if the sizes differ — and the professional's size adapts to the stop, never the reverse. The deeper layer: this is what makes the stop sacred — the size is derived from it, so the stop cannot be moved 'just a little' without silently changing the risk the size was built to hold." },
        { q: "The Kelly criterion's lesson for the professional is…",
          options: ["Bet full Kelly for maximum growth", "The maths of optimal growth — and the reason to bet far below it: full Kelly maximizes long-run growth on paper but risks ruin in practice, so the professional sizes at a fraction", "Kelly is a technical indicator", "Kelly replaces the stop", "Kelly is the broker's commission"], answer: 1,
          explain: "Kelly computes the size that maximizes long-run growth from the edge's true odds — and the catch is that the odds are estimates, the future is different from the past, and full Kelly's swings can ruin the account before the maths pays. The deeper layer: the professional's lesson is the shape of the idea — the optimal size is derived from the edge, it is never a guess, and the executed size is a fraction of the derived one. The trader who sizes by feel is guessing the number Kelly exists to replace." },
        { q: "Two positions in correlated pairs are…",
          options: ["Two independent risks", "One risk wearing two tickets — the positions move together, so the portfolio's true risk is the sum of the correlated moves, not the sum of the individual risks", "Safer than one position", "Never allowed", "Exactly half the risk of one position"], answer: 1,
          explain: "Correlation is the portfolio's hidden multiplier: EUR/USD and GBP/USD move together against the dollar, so holding both is not diversification — it is one exposure in two tickets, and the 'spread' of risk the trader felt is an illusion. The deeper layer: the professional counts correlated positions as one risk when sizing, and treats genuine diversification (unrelated markets, uncorrelated strategies) as the only kind that reduces the portfolio's risk. The illusion of spread is how accounts get blown by 'diversified' portfolios that were never diversified." },
        { q: "Tail risk is…",
          options: ["The risk of small losses", "The risk of the rare, extreme move — the event the normal distribution calls impossible, which arrives often enough that the trader who ignores it eventually meets it", "The risk of the spread", "Only relevant to options traders", "The risk of holding a position too long"], answer: 1,
          explain: "Tail risk is the fat tail — the crash, the gap, the news event that sits far outside the recent range and arrives more often than the models suggest. The deeper layer: the normal-sized trade is fine until the tail, and the tail is exactly when the risk matters most — which is why the professional's worst-case test is not 'what if the stop works' but 'what if the gap jumps the stop'. The position sized for the normal move must also survive the tail — because the tail does not announce itself." },
        { q: "Scaling out of a winning trade is…",
          options: ["Always wrong", "A management decision — taking partial profits at the first target reduces exposure and locks in gains while the runner rides for the bigger target, with the remaining size sized to survive the journey", "A sign of fear", "The same as closing", "Only allowed on losing trades"], answer: 1,
          explain: "Scaling is the management of the trade's life: the first target's partial locks in the win and removes the risk of that portion, while the runner carries the remaining (smaller) risk toward the bigger objective. The deeper layer: the professional treats the scale as a pre-planned decision — the partial at target one, the runner's stop moved to breakeven — decided in the plan, not at the moment. The trade that scales with a plan reduces risk as the trade matures; the trade that scales by fear sells the winner at the first wiggle and keeps the loser to the end." },
        { q: "The day's and week's maximum loss limits exist because…",
          options: ["The broker requires them", "The single-trade stop protects one trade, but the streak is the real risk — the daily and weekly limits stop the tilted sequence before the account pays for the emotion", "They reduce profits", "They are only for beginners", "They are required by the platform"], answer: 1,
          explain: "The per-trade stop protects the trade; the daily and weekly limits protect the sequence. A trader can take five 'correctly sized' losing trades in a tilted afternoon and still do real damage — the sequence is the risk the daily limit exists to cap. The deeper layer: the limits are the psychological architecture from Chapter 6 made numeric — the stop after the loss, the reset, the 'no more trades today' rule, all converted into a number the trader cannot argue with. The professional who hits the daily limit does not 'feel like continuing' — the rule decides, and the rule was written when the account was calm." },
        { q: "The professional's risk identity is…",
          options: ["Risking everything on the best idea", "The trader who survives — the one whose first question is always 'what is the worst case and can I survive it?', because the account that survives the streaks and the tails is the account that compounds the edge", "Never losing money", "Avoiding all risk", "Risking nothing until the setup is perfect"], answer: 1,
          explain: "Risk management is not avoiding risk — it is the architecture that lets the edge compound: the size that survives the streaks, the stop that survives the gaps, the limits that survive the tilted days, the correlation that survives the illusion. The deeper layer: the trader who asks the worst-case question first is the trader who is still in the game when the edge pays — and the trader who asks 'how much can I make?' first is the trader the tails collect. The survival question is not fear; it is the professional's first question, because every other question is downstream of it." }
      ],
      native: [
        {
          eyebrow: "Elite · The first number",
          title: "The First Number",
          lead: "The Standard chapter taught you the rules — 1%, the stop, the limits. This lane opens the mathematics behind them: why the recovery is steeper than the loss, why the size is derived from the stop, and why the survival question comes before every other question.",
          body: [
            "Risk management is not a set of rules to follow — it is a set of numbers to understand: the recovery curve, the risk of ruin, the Kelly fraction, the correlation multiplier, the tail. The rules are the rules because the numbers say so.",
            "This lane derives the rules from the mathematics, so that the discipline is understood — and understanding is the only discipline that survives the streak."
          ],
          bullets: [
            "A 50% loss needs 100% to recover — the recovery is always steeper than the loss",
            "The size is derived from the stop — never the reverse",
            "Risk of ruin falls with size and survival — the streak is the real risk",
            "The first question is always the worst case — can I survive it?"
          ],
          insight: "Risk management is a set of numbers before it is a set of rules — and the trader who understands the numbers is the trader the rules survive for."
        },
        {
          eyebrow: "Elite · The recovery",
          title: "Drawdown Mathematics — The Recovery Curve",
          lead: "The loss is not just the money lost — it is the larger recovery required, and the curve gets steeper the deeper the hole.",
          body: [
            "The mathematics of recovery is asymmetric: a 10% loss needs 11% to recover, a 30% needs 43%, a 50% needs 100%, a 60% needs 150%. The deeper the drawdown, the steeper the climb — and the climb is made harder by the fact that the drawdown usually happens in exactly the conditions that make recovery hardest (the tilted trader, the shaken confidence, the shrinking account).",
            "The deeper layer: this is why drawdown control is the first discipline — the goal is not to avoid losing (impossible) but to keep the holes shallow enough that recovery is arithmetic rather than heroic. The professional's drawdown budget is set before the streak: the maximum hole the account is allowed to dig, and the size that makes the hole's depth predictable. The trader who watches the recovery curve watches the account's real fuel gauge — the depth of the hole, not the height of the recent wins."
          ],
          bullets: [
            "10% needs 11%, 30% needs 43%, 50% needs 100% — the climb steepens",
            "The recovery is harder exactly when it is needed most",
            "Keep the holes shallow enough that recovery is arithmetic, not heroic",
            "Set the drawdown budget before the streak — and size to make the hole predictable"
          ],
          insight: "The recovery curve is the account's real fuel gauge — and the professional keeps the holes shallow because the climb out steepens with every percent."
        },
        {
          eyebrow: "Elite · The endgame",
          title: "Risk of Ruin — The Probability of the End",
          lead: "The account's real enemy is not the losing trade — it is the losing streak, and the probability that the streak exhausts the account before the edge pays.",
          body: [
            "Risk of ruin is the endgame probability: given the strategy's edge and the account's size relative to per-trade risk, how likely is a streak that ends the account? The number falls as the risk per trade falls and as the account's survival capacity rises — and it is never zero, because the edge's statistics guarantee losing streaks, and the only question is whether the account survives them.",
            "The deeper layer: this is the mathematics that makes 1% sacred — at 1% risk, a twenty-loss streak costs about 18% of the account and the trader lives to trade the edge; at 5%, the same streak is a 64% hole and recovery is nearly impossible; at 10%, the streak ends the account. The size is not about the single trade's pain — it is about the probability of surviving the streaks that the strategy's own statistics schedule. The trader who sizes for the good days is betting against the streak; the trader who sizes for the streak is betting with the mathematics."
          ],
          bullets: [
            "Risk of ruin: the probability that a streak ends the account before the edge pays",
            "It is never zero — the edge's statistics guarantee losing streaks",
            "1% survives a 20-loss streak; 10% ends the account",
            "Size for the streak, not the good days"
          ],
          insight: "The account's real enemy is the streak, not the single loss — and the size decides whether the streak is a cost of business or the end of it."
        },
        {
          eyebrow: "Elite · The derivation",
          title: "The 1% Standard, Derived",
          lead: "The 1% is not a round number — it is the balance point between two requirements that pull in opposite directions.",
          body: [
            "The size must be large enough to matter when the edge pays — a risk so small that wins are meaningless is a strategy that cannot compound. And the size must be small enough to survive the streaks — a risk so large that a normal losing run ends the account is a strategy that cannot exist long enough to pay. The 1% standard sits at the balance: meaningful when right, survivable when wrong.",
            "The deeper layer: the professional derives their own number from the same trade-off — their win rate, their average R, their drawdown tolerance — and the derivation is the discipline: the number is computed, not chosen. The trader who picks 2% because they 'feel confident' is choosing the size the streak will argue with; the trader who computes 0.8% from their own statistics is choosing the size the streak cannot break. The standard is the survival rule wearing a percentage — and the percentage is derived, never declared."
          ],
          bullets: [
            "Large enough to matter when right; small enough to survive when wrong",
            "The 1% is the balance point, not a round number",
            "Derive your own number from your win rate, your R, your tolerance",
            "The derived number is the discipline — the declared one is the hope"
          ],
          insight: "The size is the balance point between meaning and survival — and the derived number is the only one the streak cannot argue with."
        },
        {
          eyebrow: "Elite · The bridge",
          title: "Position Sizing — The Money Math",
          lead: "The risk percentage is an idea; the position size is the bridge that converts it into units — and the bridge is built from the stop's distance.",
          body: [
            "Position size = risk money ÷ stop distance. The money you are willing to lose (1% of the account) divided by the distance to the stop (in price), converted into units — so every trade risks the same percentage regardless of the setup. The 20-pip stop and the 60-pip stop risk the same money only because the sizes differ — and the size adapts to the stop, never the reverse.",
            "The deeper layer: this is the bridge that makes the stop sacred — because the size is derived from it, moving the stop 'just a little' silently changes the risk the size was built to hold. The trader who widens the stop without resizing has doubled the risk without noticing; the trader who understands the bridge sees the risk change in the size itself. The professional's ticket is read in three numbers that must agree: the risk percent, the stop distance and the size — and when any one of them changes, the other two must be recomputed."
          ],
          bullets: [
            "Size = risk ÷ stop distance — converted into units",
            "The 20-pip and 60-pip stops risk the same money only because sizes differ",
            "The size adapts to the stop — never the reverse",
            "Widening the stop without resizing is doubling the risk silently"
          ],
          insight: "The position size is the bridge between the risk and the market's geometry — and the bridge is built from the stop, which is why the stop is sacred."
        },
        {
          eyebrow: "Elite · The measure",
          title: "The R-Multiple — Measuring in R",
          lead: "The professional measures trades in R — the risk unit — because R is the only measure that compares a 20-pip trade to a 200-pip trade honestly.",
          body: [
            "R is the amount risked on the trade: a trade risking R100 that gains R300 is a +3R trade, and one that loses the full R100 is a −1R trade. Measuring in R strips away the size and the pair and the price — every trade becomes a number on the same scale, and the account's history becomes a distribution of R multiples that can be analysed honestly.",
            "The deeper layer: R is the language of the edge — expectancy in R (the average of the multiples), the win rate in R, the streak in R, all comparable across every trade the trader ever takes. The trader who thinks in pips compares apples and oranges; the trader who thinks in R sees the strategy's true shape — the few big +R wins, the many small −R losses, the expectancy that decides everything. The journal in R is the professional's scoreboard, and the R distribution is the strategy's fingerprint."
          ],
          bullets: [
            "R is the amount risked — a +3R trade gained three times the risk",
            "R strips away size, pair and price — every trade on one honest scale",
            "Expectancy in R: the average of the multiples, the strategy's fingerprint",
            "The journal in R is the professional's scoreboard"
          ],
          insight: "R is the only measure that compares trades honestly — and the R distribution is the strategy's true fingerprint."
        },
        {
          eyebrow: "Elite · The multiplier",
          title: "Correlation Risk — The Portfolio Illusion",
          lead: "The portfolio's risk is not the sum of the tickets — it is the sum of the correlated moves, and correlation is the hidden multiplier.",
          body: [
            "Two positions in correlated pairs move together: EUR/USD and GBP/USD against the dollar, the majors in the same news, the risk assets in the same risk-off event. Holding both is not diversification — it is one exposure in two tickets, and the portfolio's true risk is the sum of the correlated moves, not the sum of the individual risks. The trader who feels 'spread out' across five correlated positions is carrying one risk five times.",
            "The deeper layer: the professional counts correlated positions as one risk when sizing — the portfolio's exposure is measured by the correlation, not the ticket count — and treats genuine diversification (unrelated markets, uncorrelated strategies) as the only kind that reduces the portfolio's risk. The illusion of spread is how accounts get blown by 'diversified' portfolios that were never diversified: five positions that all die in the same risk-off event were never five risks. The portfolio is the real trade — and the real trade is measured by what moves together."
          ],
          bullets: [
            "Correlated positions are one risk wearing multiple tickets",
            "The portfolio's risk is the sum of the correlated moves",
            "Count correlated positions as one risk when sizing",
            "Genuine diversification is uncorrelated — the ticket count is the illusion"
          ],
          insight: "The portfolio is the real trade — and its risk is measured by what moves together, never by the number of tickets."
        },
        {
          eyebrow: "Elite · The tail",
          title: "Tail Risk — The Event the Models Miss",
          lead: "The normal distribution calls the crash impossible — and the crash arrives anyway, often enough that the trader who ignores it eventually meets it.",
          body: [
            "Tail risk is the fat tail: the gap, the crash, the news event that sits far outside the recent range. The normal-sized move happens most of the time; the tail happens rarely — and the rare is exactly when the risk matters most, because the tail is when the stops gap, the liquidity vanishes and the 'impossible' price prints. The position sized for the normal move is the position that meets the tail unprepared.",
            "The deeper layer: the professional's worst-case test is never 'what if the stop works' — it is 'what if the gap jumps the stop'. The size must survive the worst fill, not the ideal one: the position that would hurt at the stop must merely bruise at the gap. The tail does not announce itself, and the models that call it impossible are the models the tail feeds on. The trader who sizes for the tail is not pessimistic — they are the only one whose account is still standing when the tail arrives."
          ],
          bullets: [
            "Tail risk: the rare, extreme move the models call impossible",
            "The tail is when stops gap and liquidity vanishes",
            "The worst-case test: what if the gap jumps the stop?",
            "Size for the worst fill — the tail is the only account that is still standing"
          ],
          insight: "The models call the crash impossible — and the trader who sizes for it is the only one whose account is still standing when it arrives."
        },
        {
          eyebrow: "Elite · The surprise",
          title: "The Black Swan — The Market's Surprise",
          lead: "The event nobody predicted arrives with the largest impact — and the risk architecture that survives it is built before it, not during it.",
          body: [
            "The black swan is the event outside the model: the announcement, the default, the shock that the recent range never hinted at. Its defining feature is its timing — it arrives exactly when everyone is positioned for the opposite, which is what makes its impact so violent. The trader who plans for the normal range is the trader the black swan catches at full size.",
            "The deeper layer: the professional's defence is not prediction (the swan is unpredicted by definition) — it is the architecture built before the event: the size that survives the gap, the risk that is small enough to lose and continue, the portfolio that does not depend on the market behaving. The swan's victims are never the traders who predicted it — they are the traders whose size, leverage and positioning assumed it would not come. The black swan tests not forecasting but architecture: the trader with the survivable size is the trader the swan merely bruises, and the bruised trader is the one who trades the aftermath."
          ],
          bullets: [
            "The black swan is the event outside the model — and its timing is its weapon",
            "It catches the traders positioned for the opposite, at full size",
            "The defence is architecture, not prediction",
            "The swan tests size and positioning — not forecasting"
          ],
          insight: "The black swan is unpredicted by definition — and the trader who survives it is the one whose architecture was built before it."
        },
        {
          eyebrow: "Elite · The scale",
          title: "Scaling — In and Out",
          lead: "The full-size entry and the full-size exit are choices, not defaults — and the professional's scaling decisions are made in the plan, before the moment.",
          body: [
            "Scaling in builds the position in tranches: the first entry at the level, the add on the confirmation, the final size only when the thesis is proven — each tranche reducing the average entry's risk. Scaling out manages the exit: the partial at the first target locks in the win and reduces exposure, while the runner rides for the bigger objective with the remaining size. Both are management decisions with a plan.",
            "The deeper layer: the professional's scaling is pre-planned because the moment decides against the plan — the trader who decides to scale in the moment scales by emotion, adding to the loser and selling the winner. The plan's scaling rules are simple and mechanical: the tranches at the levels, the partials at the targets, the runner's stop moved to breakeven — decided when the account was calm, executed when it is not. The scale is the trade's life cycle, and the trader who scripts the cycle is the trader who never improvises under pressure."
          ],
          bullets: [
            "Scaling in builds the position in tranches — each add reducing the average entry",
            "Scaling out locks the win and lets the runner ride",
            "The moment decides against the plan — script the scale in advance",
            "The scale is the trade's life cycle, and the scripted cycle survives the moment"
          ],
          insight: "The full-size entry and exit are choices, not defaults — and the scripted scale is the trade's life cycle, executed by the calm self."
        },
        {
          eyebrow: "Elite · The sequence",
          title: "The Maximum Loss — The Day's and Week's Limits",
          lead: "The single-trade stop protects one trade — the daily and weekly limits protect the sequence, and the sequence is the real risk.",
          body: [
            "A trader can take five 'correctly sized' losing trades in a tilted afternoon and still do real damage — the per-trade stop was respected each time, and the account still bled. The sequence is the risk the daily limit exists to cap: the maximum loss for the day, and for the week, beyond which trading stops regardless of the setup. The limits are the tilt protocol from the psychology chapter, made numeric.",
            "The deeper layer: the limits work because they remove the decision — the tilted trader cannot argue with a number that was set when the account was calm. The daily limit converts the 'stop after the loss' rule into a hard wall, and the weekly limit converts the 'step away for the week' rule into arithmetic. The professional who hits the limit does not 'feel like continuing' — the rule decides, and the rule was written by the version of the trader who was not tilted. The sequence is where accounts are actually lost, and the limits are the only defence that cannot be argued with mid-sequence."
          ],
          bullets: [
            "Five 'correctly sized' losses in an afternoon still bleed the account",
            "The daily and weekly limits cap the sequence, not the single trade",
            "The limits are the tilt protocol made numeric",
            "The tilted trader cannot argue with a number set when calm"
          ],
          insight: "The sequence is where accounts are actually lost — and the daily and weekly limits are the only defence that cannot be argued with mid-sequence."
        },
        {
          eyebrow: "Elite · The equation",
          title: "The Edge and the Risk — Expectancy with Costs",
          lead: "The strategy's edge is not its win rate — it is its expectancy, and the expectancy is only real after every cost has been subtracted.",
          body: [
            "Expectancy = (win rate × average win) − (loss rate × average loss), and the honest version subtracts the costs: the spread, the swap, the slippage — the tolls on every round trip. A strategy that wins 60% of the time can still have negative expectancy if the wins are small and the costs are real; a strategy that wins 40% can compound if the R ratio is right. The win rate is a headline; the expectancy is the truth.",
            "The deeper layer: the expectancy is computed before the trade, not after — and it is the only number that tells you whether the strategy deserves capital at all. The professional trades the expectancy, not the recent wins: the strategy with the positive expectancy and a bad week is fine; the strategy with the negative expectancy and a good week is the trap. And because costs are part of the equation, the professional trades where the costs are cheapest — the liquid pairs, the right hours, the order types that pay the smallest toll. The edge is the expectancy after costs — and the trader who skips the costs is the trader the costs quietly collect."
          ],
          bullets: [
            "Expectancy = (win rate × avg win) − (loss rate × avg loss) — minus the costs",
            "A 60% win rate can still lose; a 40% win rate can compound",
            "The win rate is the headline; the expectancy is the truth",
            "Compute the expectancy before the trade — and trade where the toll is cheapest"
          ],
          insight: "The edge is the expectancy after costs — and the trader who skips the costs is the trader the costs quietly collect."
        },
        {
          eyebrow: "Elite · The whole",
          title: "The Portfolio — The Sum of the Risks",
          lead: "The account does not lose trade by trade — it loses as a portfolio, and the portfolio's risk is the sum of its parts after correlation, not before.",
          body: [
            "The professional manages the account as one position: the correlated exposures counted together, the uncorrelated ones spread, the total risk per day and per week capped, the drawdown budget respected across everything. The single-trade discipline is necessary but not sufficient — the trader with perfect per-trade risk and a correlated book is one event from a portfolio-sized loss.",
            "The deeper layer: the portfolio view is where the chapters connect — the psychology protects the sequence, the sizing protects the trade, and the portfolio protects the account: the sum of the correlated risks, the cap on the total exposure, the drawdown budget that ends the session. The professional reads the portfolio the way a pilot reads the whole instrument panel — not the single gauge but the pattern across them, and the pattern that matters is the total risk in the account, in every correlated direction, at every moment. The account is the only trade that always matters."
          ],
          bullets: [
            "The account loses as a portfolio — correlated exposures counted together",
            "Perfect per-trade risk with a correlated book is one event from disaster",
            "The portfolio view connects the chapters — psychology, sizing, structure",
            "The account is the only trade that always matters"
          ],
          insight: "The account is the only trade that always matters — and the professional reads the whole panel, never the single gauge."
        },
        {
          eyebrow: "Elite · The first rule",
          title: "The Survival Standard",
          lead: "Every rule in this chapter is a branch of one rule — survive — and the trader who survives the streaks and the tails is the trader the edge eventually pays.",
          body: [
            "The size that survives the streak, the stop that survives the gap, the limits that survive the tilted day, the correlation that survives the illusion, the worst-case question asked before the best-case hope — every discipline in this chapter is the survival standard wearing a different costume. The account that is still standing when the edge pays is the account that compounds; the account that was leveraged for the good days is the account the streak collects.",
            "The deeper layer: survival is not the opposite of ambition — it is the precondition of it. The trader who survives the bad times is the trader who is present for the good ones, and the compounding happens across the whole curve, not the exciting part. The professional's first question is always the worst case — 'what is the maximum I can lose, and can I survive it?' — because every other question is downstream of it. The survival standard is the first rule because it is the rule the account cannot trade without: the dead account has no edge, no strategy, no comeback — and the trader who protects the account first is the trader who is always in the game."
          ],
          bullets: [
            "Every rule is the survival standard wearing a different costume",
            "Survival is the precondition of ambition — present for the good times",
            "The first question is always the worst case — can I survive it?",
            "The dead account has no edge — protect the account first"
          ],
          insight: "Survival is not the opposite of ambition — it is the precondition of it, and the first question is always the worst case."
        },
        {
          eyebrow: "Elite · The identity",
          title: "The Risk Identity",
          lead: "After the mathematics, the recovery curve, the ruin probability and the survival standard — the only thing that survives contact with a live market is the trader who asks the worst-case question first.",
          body: [
            "The market does not care how precisely you can compute a position size, how well you understand the recovery curve, or how certain you are that this trade will work. It cares what you do when the streak arrives, when the gap jumps the stop, when the correlated book dies together, when the daily limit is hit and the temptation to continue is loud — and the trader who asks the worst-case question first, who sized for the streak and the tail, who set the limits when calm, is the one the market cannot break.",
            "The deeper layer: this is why risk is identity — every discipline in this Academy is executed by the same account, and the account that survives is the account that compounds. The trader who asks 'how much can I make?' first is the trader the tails collect; the trader who asks 'what is the worst case and can I survive it?' first is the trader who is still in the game when the edge pays. The market has been collecting the under-sized, the over-leveraged and the survivable-in-theory since the first trade — and it will keep collecting them long after every chart in this academy is forgotten. The only question is whether you trade with the survival standard built in, or learn it the way the market teaches everything else: after the account has paid for the lesson."
          ],
          bullets: [
            "The market cannot break the trader who asked the worst-case question first",
            "The account that survives is the account that compounds",
            "The 'how much can I make' question is the one the tails collect",
            "Trade with the survival standard built in — or pay for the lesson"
          ],
          insight: "The market collects the over-sized and the survivable-in-theory — and the only defence ever built is the survival standard, built before the streak, not after it."
        },
        {
          eyebrow: "Elite · The territory",
          title: "The Stop's Territory",
          lead: "The stop is not a number — it is a statement about where the thesis is wrong, and its territory is the structure that made the trade.",
          body: [
            "The stop belongs beyond the structure that defines the trade: past the swing that made the setup, past the level's far side, past the pattern's neckline — because the stop's job is to mark where the thesis is wrong, not where the noise lives. A stop inside the structure is a stop the market's own tests will collect; a stop beyond it is a stop that lets the trade breathe and marks the invalidation honestly.",
            "The deeper layer: the stop's distance is a risk decision AND a structural decision — it must be far enough to survive the market's tests (structural) and small enough to fit the risk budget (mathematical), and the two requirements meet in the position size. The trade that cannot fit both — the stop too tight for the structure, or too wide for the budget — is a trade that should not exist, whatever the chart says. The professional sets the stop first, from the structure, and lets the size adapt to the distance — the stop is the thesis's boundary, and the thesis comes before the ticket."
          ],
          bullets: [
            "The stop marks where the thesis is wrong — beyond the structure, not inside the noise",
            "A stop inside the structure is collected by the market's own tests",
            "The stop must fit both the structure and the risk budget — or the trade should not exist",
            "Set the stop first, from the structure — the size adapts to the distance"
          ],
          insight: "The stop is a statement about where the thesis is wrong — and the thesis comes before the ticket, always."
        },
        {
          eyebrow: "Elite · The budget",
          title: "The Risk Budget — The Account's Drawdown Plan",
          lead: "The account has a budget like any business — the maximum it is allowed to lose in a day, a week, a streak — and the budget is set before the streak, not during it.",
          body: [
            "The risk budget is the account's financial plan: the daily loss limit, the weekly loss limit, the maximum drawdown the account is allowed to reach, and the size that makes those limits predictable. The budget converts the survival standard into numbers the trader cannot argue with mid-streak — the tilted trader cannot negotiate with a budget that was set when the account was calm.",
            "The deeper layer: the budget is the bridge between the psychology chapter and the risk chapter — the daily limit is the tilt protocol made numeric, and the drawdown cap is the recovery curve made policy. The professional's budget is written down, reviewed, and treated as binding: the day ends at the daily limit, the week ends at the weekly limit, and the account's maximum drawdown is a line that is never crossed because the size was set to make crossing it impossible. The budget is not pessimism — it is the financial version of the survival standard: the account that respects its budget is the account that is still trading when the edge pays."
          ],
          bullets: [
            "The risk budget: daily limit, weekly limit, maximum drawdown — set before the streak",
            "The budget is the tilt protocol made numeric",
            "The day ends at the daily limit — the budget is binding",
            "The account that respects its budget is the account still trading when the edge pays"
          ],
          insight: "The risk budget is the survival standard made numeric — and the account that respects it is the account that survives to compound."
        },
        {
          eyebrow: "Elite · The illusion",
          title: "The Win Rate Illusion",
          lead: "The win rate is the most seductive number on the scoreboard — and the least informative, because the edge lives in the R-multiples, not the percentages.",
          body: [
            "A strategy that wins 40% of the time with a 3R average win and a 1R average loss compounds beautifully — expectancy +0.6R per trade. A strategy that wins 70% with a 0.3R average win and a 1R average loss loses steadily — expectancy −0.1R per trade. The win rate was irrelevant; the R-multiples were everything. The scoreboard that shows 70% can be the scoreboard of a losing strategy.",
            "The deeper layer: the win rate illusion is why the professional measures in R and reviews the expectancy, not the percentage — the strategy's truth is the average of the R-multiples across a meaningful sample, and the win rate is the headline that sells the wrong story. The trader who chases win rate cuts winners early (to keep the percentage high) and holds losers (to avoid the red mark) — the two behaviours the asymmetry already produces, reinforced by a scoreboard that rewards them. The professional's scoreboard is the expectancy in R — and the win rate is a number on it, never the number."
          ],
          bullets: [
            "40% win rate at 3R compounds; 70% at 0.3R loses steadily",
            "The edge lives in the R-multiples, never the percentages",
            "Chasing win rate produces exactly the behaviours the asymmetry loves",
            "The scoreboard is the expectancy in R — the win rate is a number on it"
          ],
          insight: "The win rate is the least informative number on the scoreboard — the edge lives in the R-multiples, and the expectancy is the truth."
        },
        {
          kind: "pause",
          eyebrow: "Elite · Breathe",
          title: "Reset Before the Test",
          lead: "You've just derived the risk mathematics — the recovery curve, the risk of ruin, the 1% balance, the size bridge, the R-multiple, the correlation multiplier, the tail, the black swan, the scaling script, the sequence limits, the expectancy with costs, the portfolio sum and the survival standard. Close your eyes for one breath — in for four, out for four — and let the numbers settle.",
          body: [
            "The next ten questions are the Elite gate: recovery maths, ruin probability, the derived size, R-multiples, correlation, the tail, the limits, expectancy with costs. They assume you understand the numbers, not just the rules. Take the breath. Then prove it."
          ]
        },
        null, null, null, null, null, null, null, null, null, null,
        {
          kind: "close",
          eyebrow: "Elite chapter complete",
          title: "You Derived the Rules",
          body: [
            "You entered as a follower of rules and leave as a mathematician of risk: the recovery curve, the ruin probability, the derived 1%, the size bridge, the R-multiple, the correlation multiplier, the tail, the black swan, the scaling script, the sequence limits, the expectancy with costs, the portfolio sum and the survival standard.",
            "This is the Elite difference: not following the rules, but understanding the numbers that made them. You've earned the mathematics. Finish the gate, and the Summit continues in Chapter 8's Elite lane."
          ]
        }
      ]
    }
};
module.exports = C;