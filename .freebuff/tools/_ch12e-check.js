const C = {
    elite: {
      slides: 30,
      quizSlides: [20,21,22,23,24,25,26,27,28,29],
      quiz: [
        { q: "A company's expected cash flows are R10m a year, growing 5% forever, discounted at 10%. Using the perpetuity formula, the terminal value is approximately…",
          options: ["R100m", "R200m — the perpetuity: cash flow ÷ (discount − growth) = 10 ÷ (0.10 − 0.05) = R200m", "R50m", "R10m", "R150m"], answer: 1,
          explain: "The growing perpetuity values the cash flows beyond the forecast: CF ÷ (r − g) = 10m ÷ (0.10 − 0.05) = R200m. The deeper layer: this one formula often carries the majority of a valuation — which is why the assumptions (the growth rate g, the discount rate r) matter more than the arithmetic, and why the professional holds every DCF-derived number loosely, as an estimate with a range, never as a fact." },
        { q: "A stock trades at R120 with earnings per share of R6. Its P/E ratio is…",
          options: ["20 — the price-to-earnings multiple: 120 ÷ 6, the market paying 20 years of current earnings for the stock", "10", "5", "720", "2"], answer: 0,
          explain: "The P/E is the price tag per unit of earnings: 120 ÷ 6 = 20 — the market is paying 20 times the current year's earnings. The deeper layer: the multiple is a comparison tool, not an absolute truth — the same 20 P/E is cheap for a fast-growing business and expensive for a stagnant one, and the professional reads the multiple against the growth, the sector and the history, never in isolation." },
        { q: "You hold a R50,000 position with R25,000 of your own money and R25,000 borrowed on margin. If the position falls 20%, your equity…",
          options: ["Falls 20%", "Falls 40% — the R10,000 loss hits the R25,000 equity: a 40% loss on your money, the leverage doubling the percentage move", "Falls 10%", "Stays the same", "Rises 20%"], answer: 1,
          explain: "The 2x leverage doubles the percentage result: the R10,000 loss (20% of the position) is 40% of the R25,000 equity. The deeper layer: this is the margin arithmetic the beginner discovers after the loss — the leverage was visible in the position size and invisible in the equity's exposure — and the professional computes the equity impact before the entry, because the margin call arrives at the equity, not the position." },
        { q: "Market capitalisation measures…",
          options: ["The company's revenue", "The total market value of the outstanding shares — the price multiplied by the share count, the standard size measure", "The company's debt", "The employees' value", "The annual profit"], answer: 1,
          explain: "Market cap = price × outstanding shares: the market's total price tag on the company. The deeper layer: the cap is a behaviour measure, not just a size label — the small cap moves more because less liquidity cushions it and less coverage prices it, and the professional reads the cap as the risk profile: the same news moves the small cap like a leaf and the mega cap like a boulder." },
        { q: "The dividend investor and the growth investor are different because…",
          options: ["They are the same", "They buy different contracts with the company — the dividend investor owns it for its cash (income, stability, payout), the growth investor owns it for its future (reinvested profits, price appreciation), and each contract demands a different stock", "Growth investors never make money", "Dividends are guaranteed", "The dividend always beats the growth"], answer: 1,
          explain: "The two identities are two contracts: the income investor measures success in cash received and needs stability and yield; the growth investor measures success in price appreciation and needs evidence and patience for volatility. The deeper layer: confusing the contracts is expensive — the income investor who buys a growth stock pays for a future that never arrives, and the growth investor who holds a dividend stock waits for an appreciation that was never promised. Know which contract you hold before you buy." },
        { q: "A stock's sector matters because…",
          options: ["It does not matter", "The sector is the context that decides how the same news lands — an interest rate cut is bullish for growth and REITs, neutral for staples, quietly bearish for banks, and the rotation moves the whole sector regardless of the individual stock", "Sectors only matter for ETFs", "The sector decides the dividend", "The sector only matters for small caps"], answer: 1,
          explain: "The sector is the wind the individual stock sails in: the same news moves different sectors in opposite directions, and the rotation (defensives in slowdowns, cyclicals in recoveries, growth in expansions, value in inflation) moves whole sectors together. The deeper layer: the stock pick is the last step, not the first — the regime sets the sector, the sector sets the wind, and the professional reads the sector before the stock because the great company in the wrong part of the rotation underperforms the mediocre one in the right part." },
        { q: "The secondary market is where…",
          options: ["Companies sell new shares", "Investors trade shares with each other — the everyday market, where the company is not a party to your trade, and the price is the crowd's verdict on the shares it already issued", "The government sets prices", "Dividends are paid", "The company sets the price"], answer: 1,
          explain: "The secondary market is the shareholders' marketplace: everyday trading is investor-to-investor, and the company appears only at the IPO and the occasional capital raise (the primary market). The deeper layer: this reframes the chart — every candle is owners voting on value with their money, not the company 'going up and down' — and the professional reads the tape as a crowd of owners changing their minds, which is the machinery behind every stock move." },
        { q: "Price and intrinsic value differ because…",
          options: ["They are identical", "Price is the auction's verdict — the crowd's opinion, updated every second — while intrinsic value is an estimate of the business's worth, built on assumptions and always a range", "Intrinsic value is set by the exchange", "Price is set by the company", "The difference is always tiny"], answer: 1,
          explain: "Price is what the auction clears at today; intrinsic value is what the business is actually worth, estimated from projections. The deeper layer: the gap between the two is where every stock decision lives — price below value is the opportunity, price above is the risk, and the gap can persist for years because the crowd's opinion is slow to change. The professional holds the estimate loosely — the margin of safety is the admission that the estimate itself can be wrong." },
        { q: "A dual-class share structure means…",
          options: ["Equal votes for all shareholders", "The founders hold a class with many votes per share while the public holds one — control without proportional ownership", "The company has two tickers", "Only two shareholders exist", "All shareholders vote equally on everything"], answer: 1,
          explain: "Dual-class deliberately makes the votes unequal: the founder class keeps control while the public buys the economics. The deeper layer: control is an asset the public is paying for without receiving — the professional checks the structure the way a passenger checks who is driving, because the founder with most of the votes can change strategy, pay themselves or sell the company without the public's approval." },
        { q: "The equity identity is…",
          options: ["Owning any stock that rises", "The trader who remembers every share is a slice of a real business that must actually earn — reading the business before the chart, the value before the price, and the sector before the stock", "Trading only penny stocks", "Ignoring the fundamentals", "Owning only the newest IPO"], answer: 1,
          explain: "The equity identity is the ownership mindset: every share is a claim on a real business, and the claim only pays if the business earns. The deeper layer: the market rewards the trader who reads the ownership claim — the business over the story, the value over the price, the sector over the stock — and the trader who needs the crowd's approval to hold is the market's reliable customer. The stock market has run ownership auctions for centuries; the only question is whether you trade the claim or the noise." }
      ],
      native: [
        {
          eyebrow: "Elite · The claim",
          title: "The Ownership Claim",
          lead: "The Standard chapter taught you the stock market's vocabulary. This lane opens the mathematics and the machinery behind it — the valuation arithmetic, the margin call, the sector rotation, the two contracts and the ownership mindset that ties it all together.",
          body: [
            "Every share is a slice of a real business: a claim on its assets and a share of its profits, standing last in the queue — which is exactly why it owns the growth. The stock market is an ownership auction, and this lane teaches you to read the auction's mathematics and the business behind the ticket.",
            "The ownership mindset is the identity: the business before the chart, the value before the price, the sector before the stock."
          ],
          bullets: [
            "A share is a claim on a real business — last in line, and therefore first in line for the growth",
            "Price is the auction's verdict; value is the estimate — and the gap is the decision",
            "The P/E and the DCF are lenses on the business, never facts about the future",
            "The sector is the wind; the stock is the sail — read the wind before the sail"
          ],
          insight: "The stock market is an ownership auction — and the trader who reads the business behind the ticket is the trader the auction pays."
        },
        {
          eyebrow: "Elite · The two markets",
          title: "The Two Markets",
          lead: "The primary market sells the shares once; the secondary market trades them forever — and knowing which market you are in decides what the chart means.",
          body: [
            "The primary market is the company selling new shares: the IPO, the rights issue, the placement — the only times the company is a party to the transaction. The secondary market is the everyday exchange: investors trading shares with each other, the company absent from the trade, and the price set by the crowd's auction. The two markets are the same shares and two completely different transactions.",
            "The deeper layer: the distinction reframes every chart — the everyday candle is shareholders exchanging ownership among themselves, and the price is their verdict on the company, not the company's own doing. The professional reads the tape as a crowd of owners voting with their money, and reads the primary-market events (the IPO, the raise, the buyback) as the company's rare appearances in its own market — each one a different kind of information than the everyday auction. Know which market you are in, and the chart reads honestly."
          ],
          bullets: [
            "The primary market sells the shares once — the IPO, the raise, the placement",
            "The secondary market trades them forever — investors with investors, the company absent",
            "Everyday candles are owners voting on value, not the company moving",
            "The company's rare appearances — the IPO, the buyback — are a different kind of information"
          ],
          insight: "The primary market sells the shares once and the secondary trades them forever — and knowing which market you are in decides what the chart means."
        },
        {
          eyebrow: "Elite · The verdict",
          title: "The Valuation — Price vs Value",
          lead: "The market has two answers for what a stock is worth — the price and the value — and the distance between them is where every stock decision lives.",
          body: [
            "Price is the auction's verdict, updated every second: the crowd's opinion, made visible. Intrinsic value is the analyst's estimate of the business's worth: the projected cash flows, the growth, the risk — always a range, never a point. The gap between the two is the opportunity and the risk: price below value is the candidate for buying, price above is the warning, and the gap persists because the crowd's opinion is slow to change.",
            "The deeper layer: the two verdicts are separate instruments that must never answer each other's question — a falling price is not automatically a bargain, any more than a rising price is automatically expensive; the only question is where the price stands relative to the value. And because the value is an estimate, the professional holds it loosely: the margin of safety is not caution but the acknowledgement that the estimate itself can be wrong — and the honest answer is always a range, never a point."
          ],
          bullets: [
            "Price is the auction's opinion; value is the estimate of the business's worth",
            "The gap is the decision: below value is the opportunity, above is the risk",
            "The gap persists because the crowd's opinion is slow to change",
            "Hold the estimate loosely — the margin of safety admits the estimate can be wrong"
          ],
          insight: "The two verdicts must never answer each other's question — and the margin of safety is the admission that the estimate itself can be wrong."
        },
        {
          eyebrow: "Elite · The assumptions",
          title: "The DCF — The Assumptions",
          lead: "The DCF looks like arithmetic and is actually judgement — the growth rate, the discount rate and the terminal value are the real numbers, and the answer is only as honest as the assumptions.",
          body: [
            "The DCF projects the cash flows and discounts them back to today's money — and the answer moves with every assumption: change the growth rate by a point and a 'cheap' stock becomes 'expensive'; change the discount rate and a 'strong buy' becomes a 'hold'; and the terminal value — the perpetuity beyond the forecast — often carries the majority of the total. Two honest analysts can value the same company very differently and both be reasonable.",
            "The deeper layer: this is the humility at the heart of valuation — the spreadsheet looks precise and is a story with assumptions, and the assumptions are forecasts of an unknowable future. The professional reads the DCF as a map of the business's value landscape, not a GPS coordinate — and never lets the precision of the output outrank the honesty of the inputs. If the growth assumption is heroic, the valuation is a hope wearing a calculator; if the margin of safety survives the assumption's worst case, the trade can survive the future's surprises."
          ],
          bullets: [
            "The DCF's answer moves with the growth rate, the discount rate and the terminal value",
            "A point of growth changes the verdict — two honest analysts disagree",
            "The spreadsheet is arithmetic; the inputs are judgement",
            "The margin of safety is the admission that the assumptions could be wrong"
          ],
          insight: "A DCF is a map of value's landscape — never a coordinate, and never more honest than its assumptions."
        },
        {
          eyebrow: "Elite · The multiple",
          title: "The P/E — The Multiple",
          lead: "The P/E is the price tag per unit of earnings — and the multiple is a comparison tool, never an absolute truth about cheap or expensive.",
          body: [
            "The P/E divides the price by the earnings per share: the market paying 20 times the current year's earnings. The multiple is a lens for comparison — the same 20 P/E is cheap for a business growing 25% a year and expensive for one growing 2%, and the professional reads the multiple against the growth, the sector's average and the company's own history, never in isolation.",
            "The deeper layer: the multiple is the market's enthusiasm compressed into a number — the high P/E says the market is paying for the future (the growth is priced in), the low P/E says the market is discounting the future (the doubt is priced in) — and the professional reads the enthusiasm with the growth that justifies it or fails to. The P/E never answers 'is this a good business?' — it answers 'how much is the market paying for the earnings, and does the growth justify the price?' — and the trader who asks the second question is the trader the multiple cannot fool."
          ],
          bullets: [
            "The P/E is the price tag per unit of earnings — a comparison lens",
            "The same multiple is cheap for the grower and expensive for the stagnant",
            "The multiple is the market's enthusiasm compressed into a number",
            "The multiple asks 'does the growth justify the price?' — never 'is this a good business?'"
          ],
          insight: "The P/E is the market's enthusiasm in a number — and the trader who reads the growth behind the multiple is the trader the multiple cannot fool."
        },
        {
          eyebrow: "Elite · The loan",
          title: "The Margin — The Loan",
          lead: "Margin is a loan secured by your positions — and the loan's arithmetic doubles the percentage result in both directions, which is the point and the danger.",
          body: [
            "Margin lets you control a position larger than your deposit: the borrowed money amplifies everything. At 2x, a 20% position move is a 40% equity move; at 10x, the same move is 200% — the leverage multiplies the percentage result, and the multiplication works in both directions. The loan also carries a claim: if the equity falls below the maintenance level, the broker can force a sale to cover the loan.",
            "The deeper layer: the margin call arrives at the equity, not the position — the broker's claim is on your money, and the forced sale lands exactly when you are most wrong, at the worst price, at the worst moment. The professional computes the equity impact before the entry: the leverage was visible in the position size and invisible in the equity's exposure, and the trader who sizes the loan by their own drawdown tolerance — never by what the broker offers — is the trader the margin call cannot surprise."
          ],
          bullets: [
            "Margin is a loan secured by your positions — the borrowed capital amplifies everything",
            "At 2x, a 20% move is a 40% equity move — the multiplication works both ways",
            "The margin call arrives at the equity, not the position — the forced sale lands at the worst moment",
            "Size the loan by your own drawdown tolerance — never by what the broker offers"
          ],
          insight: "Margin's arithmetic is simple and merciless — the leverage was visible in the position and invisible in the equity, until the call arrived."
        },
        {
          eyebrow: "Elite · The call",
          title: "The Margin Call — The Math",
          lead: "The margin call is the loan's enforcement — the equity falling below the maintenance level, and the broker's forced sale arriving exactly when you are most wrong.",
          body: [
            "The arithmetic: you hold R50,000 with R25,000 equity and R25,000 borrowed. A 20% fall costs R10,000 — 40% of your equity — and a fall that takes the equity below the maintenance level triggers the call: the broker demands more money or sells the position to cover the loan. The call is not a suggestion; it is the loan's contract, enforced at the market's worst moment for you.",
            "The deeper layer: the margin call is where the leverage's promise meets its bill — the trader who sized the loan for the good days discovers the equity's fragility on the bad ones, and the forced sale converts a recoverable drawdown into a realised loss at the exact bottom. The professional's defence is the equity math done before the entry: the worst-case fall that the equity can survive without the call, and the size that keeps the equity above the maintenance level through the worst realistic move. The call is the loan's bill — and the trader who computed the bill before borrowing is the trader the call cannot collect."
          ],
          bullets: [
            "The call: equity below the maintenance level triggers the forced sale to cover the loan",
            "A 20% position fall is 40% of your equity at 2x — the leverage's arithmetic",
            "The forced sale converts a recoverable drawdown into a realised loss at the bottom",
            "Compute the equity's worst-case survival before borrowing — the call is the bill"
          ],
          insight: "The margin call is the loan's enforcement, arriving at the worst moment — and the trader who computed the bill before borrowing is the trader the call cannot collect."
        },
        {
          eyebrow: "Elite · The ladder",
          title: "The Cap — The Size Ladder",
          lead: "Market cap is the size ladder the market climbs — and each rung is a risk profile, because the size decides the liquidity and the coverage underneath the price.",
          body: [
            "Market cap — price × outstanding shares — sorts the market from micro-cap to mega-cap, and the rung changes the behaviour: the mega cap is institutionally held, deeply covered and slow-moving; the small cap is volatile, lightly covered and fast to react to any news. The same earnings miss that costs the mega cap 2% can cost the small cap 15% in an afternoon — the size is the behaviour.",
            "The deeper layer: the cap is a risk profile, not a label — the small cap's speed is a reward for accepting the gap risk and the illiquidity, never a free upgrade, and the mega cap's calm is the price of the coverage that already priced the information. The professional chooses the rung deliberately: the position that is fine in the deep book of the mega cap is reckless in the thin book of the small cap, because the exit is priced by the depth, not the name. Size does not make a stock safe — it makes its movements slower and more predictable, which is a different thing entirely."
          ],
          bullets: [
            "The cap ladder runs from micro to mega — and the rung is the risk profile",
            "The same news moves the small cap like a leaf and the mega cap like a boulder",
            "The small cap's speed is a reward for the illiquidity, never a free upgrade",
            "Size makes the moves slower and more predictable — not safer"
          ],
          insight: "Market cap is the size ladder and the rung is the risk — and the professional chooses the rung for the behaviour, never for the name."
        },
        {
          eyebrow: "Elite · The context",
          title: "The Sector — The Wind",
          lead: "The stock is the sail and the sector is the wind — and the professional reads the wind before the sail, because the rotation moves the whole sector regardless of the individual stock.",
          body: [
            "Consumer staples and utilities sell food and electricity in every economy — defensive, stable, dividend-heavy. The cyclicals — industrials, materials, discretionary — live and die with the economy's mood. The growth names lead the expansions and get discounted hardest in the inflations; the value names hold the hot regimes with their current earnings and yields. The sector is the context that decides how the same news lands — and the rotation is the market's slow rebalancing between the sectors as the regime changes.",
            "The deeper layer: the professional reads the sector before the stock because the wind dominates the sail — the great company in the wrong part of the rotation underperforms the mediocre one in the right part, and the individual stock's brilliance cannot overcome the sector's headwind. The regime sets the sector (rates favour growth or value, the cycle favours cyclicals or defensives), the sector sets the wind, and the stock is the sail — the pick is the last step, never the first, and the trader who reads the wind first is the trader who is sailing with the rotation instead of against it."
          ],
          bullets: [
            "The sector is the context that decides how the same news lands",
            "The rotation: defensives in slowdowns, cyclicals in recoveries, growth in expansions, value in inflation",
            "The great company in the wrong rotation underperforms the mediocre one in the right one",
            "The regime sets the sector, the sector sets the wind, the stock is the sail"
          ],
          insight: "The stock is the sail and the sector is the wind — and the trader who reads the wind before the sail is the trader the rotation carries."
        },
        {
          eyebrow: "Elite · The rotation",
          title: "Value vs Growth — The Regime's Choice",
          lead: "Inflation and rates decide which kind of earnings the market rewards — and the rotation between value and growth is the market's slow rebalancing between today's cash and tomorrow's promise.",
          body: [
            "Rising inflation and rates discount distant profits harder — the growth stocks' promise gets priced at a higher cost — while the value stocks' current earnings and dividends become relatively more attractive. The same inflation print that sinks a growth stock can lift a value stock, and the rotation follows: energy, materials and banks tend to hold or gain in the hot regimes; long-duration growth tends to fall. The market is not punishing 'growth' — it is repricing the future's cost.",
            "The deeper layer: the rotation is a regime, not a headline — it changes which kind of earnings the market rewards, and it stays changed for months or years while the redistribution plays out. The professional reads the regime before the individual stock: the same company's stock can look cheap or expensive depending on whether the market is rewarding today's cash or tomorrow's promise, and the trader who fights the redistribution is paying the regime's rent while the trader who joins it collects the regime's yield. The value-growth pendulum is the market's long heartbeat, and the trader who reads the regime reads the heartbeat's direction."
          ],
          bullets: [
            "Rising rates discount distant profits harder — the future's cost rises",
            "Value holds the hot regimes; long-duration growth falls — the same print, two outcomes",
            "The rotation is a regime that lasts months, not a headline that lasts a day",
            "Join the redistribution — the pendulum pays the trader who reads its direction"
          ],
          insight: "The value-growth rotation is the market's long heartbeat — and the trader who reads the regime reads the heartbeat's direction."
        },
        {
          eyebrow: "Elite · The income",
          title: "The Dividend — The Income",
          lead: "The dividend is the company's cash distributed — and the income it provides is a different contract with the market than the growth the same company might also offer.",
          body: [
            "The dividend is the share of profits the company pays out to its holders — the cash the business actually distributes, as opposed to the profits it reinvests. The dividend investor owns the company for this cash: stability, yield, the income that arrives without selling. The dividend's health is in the payout — the earnings that cover it, the history that sustains it, the yield it offers relative to the alternatives.",
            "The deeper layer: the dividend is the income identity's scoreboard — the cash received, measured against the price paid — and the professional reads the yield with the sustainability behind it: the 8% yield that the earnings cannot cover is a dividend at risk, while the 3% yield that the earnings cover three times is an income that compounds. The dividend investor and the growth investor are buying different contracts with the same company — the income identity wants the cash now, the growth identity wants the promise later — and each contract must be sized and held with its own patience."
          ],
          bullets: [
            "The dividend is the share of profits the company distributes — the cash without selling",
            "The income identity owns the company for the cash; the growth identity for the future",
            "Read the yield with the sustainability — the uncovered yield is a dividend at risk",
            "The two identities are two contracts — each with its own patience"
          ],
          insight: "The dividend is the income's scoreboard — and the professional reads the cash with the sustainability that pays it."
        },
        {
          eyebrow: "Elite · The engine",
          title: "The Earnings — The Engine",
          lead: "The share price is the auction's verdict, but the earnings are the engine — and the engine is what the verdict is ultimately about, whether the crowd remembers it or not.",
          body: [
            "Earnings are the company's actual profit — the cash the business generates after the costs — and the engine that the valuation, the dividend and the price all hang on: the DCF projects the future earnings, the P/E prices the current ones, the dividend distributes a share of them, and the price eventually follows the earnings' direction, however long the crowd takes to notice. The company that earns grows its claim; the company that does not shrinks it, whatever the chart says today.",
            "The deeper layer: the earnings are the anchor in the noise — the price can depart from the earnings for months or years, and the departure is exactly the gap between the price and the value that the valuation measures. The professional reads the earnings trend as the business's report card: the rising earnings justify the rising price, the falling earnings explain the falling one, and the price that has run far ahead of the earnings is the price the market will eventually correct. The chart is the crowd's opinion; the earnings are the business's fact — and the trader who reads the fact is the trader the opinion cannot permanently fool."
          ],
          bullets: [
            "Earnings are the engine — the DCF projects them, the P/E prices them, the dividend distributes them",
            "The price eventually follows the earnings, however long the crowd takes to notice",
            "The price can depart from the earnings — and the departure is the value gap",
            "The chart is the opinion; the earnings are the fact"
          ],
          insight: "The earnings are the engine behind the verdict — and the trader who reads the fact is the trader the crowd's opinion cannot permanently fool."
        },
        {
          eyebrow: "Elite · The auction",
          title: "The Auction — The Crowd's Opinion",
          lead: "Every stock price is an opinion made visible — the meeting point of buyers and sellers who disagree, and the disagreement is where the value gap lives.",
          body: [
            "Price moves because buyers and sellers hold different opinions about a stock's worth: more buyers than sellers pushes it up as the auction climbs to find the willing sellers; more sellers than buyers pushes it down. The exchange reports the auction; it does not cause the opinions. The candle is the verdict of a crowd that cannot agree — and the disagreement is where every transaction happens and where the value gap (price above or below the estimate) becomes visible.",
            "The deeper layer: the auction psychology is the bridge between the stock chapter and everything you already know — price is the same meeting of fear and greed, conviction and doubt, wearing an ownership costume. The professional reads the crowd's disagreement as the opportunity: the extremes — everyone certain, nobody certain — are where the auction is most likely to have mispriced the business, because the crowd's opinion swings further than the company's fundamentals. The chart is the opinion; the business is the fact; and the distance between them is the trade."
          ],
          bullets: [
            "Price is the meeting point of buyers and sellers who disagree",
            "The exchange reports the auction; it does not cause the opinions",
            "The disagreement is where the value gap becomes visible",
            "The chart is the opinion; the business is the fact; the distance is the trade"
          ],
          insight: "The auction is the crowd's opinion made visible — and the distance between the opinion and the fact is where the stock trade lives."
        },
        {
          eyebrow: "Elite · The toll",
          title: "The Liquidity — The Spread Toll",
          lead: "Every stock trade pays the spread toll — and the toll is the market's quietest cost, which is why the professional prices it before the trade exists.",
          body: [
            "The bid is the highest price a buyer will pay, the ask the lowest a seller will accept, and the spread between them is the toll you cross twice — in and out. On the liquid giant the toll is pennies and nearly invisible; on the thin, quiet stock the toll can swallow a day's move. Liquidity is not a convenience — it is a discount on every ticket, and the depth behind the quote (the shares resting in the book) is what actually meets you on the way out.",
            "The deeper layer: the toll is a cost inside the trade, not around it — the professional includes it in the entry decision before the entry exists: if the expected move does not cover the round-trip toll, the trade does not exist, no matter how bullish the chart looks. The thin stock's wide toll and shallow book demand the larger edge and the smaller size; the liquid giant's pennies allow the finer edges and the larger positions. The beginner counts the profit on the way in and discovers the toll on the way out; the professional prices the toll first, and only then decides whether the road is worth driving."
          ],
          bullets: [
            "The spread is the toll on every round trip — crossed twice",
            "Liquidity is a discount on every ticket — the depth meets you on the way out",
            "If the move does not cover the toll, the trade does not exist",
            "Price the toll first — the beginner discovers it on the way out"
          ],
          insight: "The spread is the stock market's quietest cost — and the professional prices it first, before the road is worth driving."
        },
        {
          eyebrow: "Elite · The whole",
          title: "The Portfolio — The Stock in the Book",
          lead: "The stock is one thread in the portfolio — and the portfolio's risk is the sum of the correlated threads, which is why the stock is never sized alone.",
          body: [
            "The professional manages the stock portfolio as one position: the correlated holdings counted together (the two banks that die in the same rate shock, the three cyclicals that fall in the same slowdown), the uncorrelated spread chosen deliberately, the sector exposure capped, the total risk across everything measured as one number. The single-stock discipline is necessary but not sufficient — the trader with perfect per-stock risk and a correlated book is one sector event from a portfolio-sized loss.",
            "The deeper layer: the portfolio view connects the stock chapter to the risk chapter — the sector is the correlation's source (the same wind moves the whole sector's sails), and the professional reads the book the way a pilot reads the whole panel: the sector exposures, the correlated names, the total risk in the account at every moment. The great single stock in the over-weighted sector is still the over-weighted sector; the diversification is in the uncorrelated threads, never in the ticket count. The account is the only trade that always matters — and the stock is a thread in it, never the whole cloth."
          ],
          bullets: [
            "The stock is one thread — the portfolio's risk is the sum of the correlated threads",
            "The two banks that die in the same shock are one risk wearing two tickets",
            "The sector is the correlation's source — the same wind moves the whole sector's sails",
            "The account is the only trade that always matters"
          ],
          insight: "The stock is a thread in the book, never the whole cloth — and the trader who reads the whole panel is the trader the sector event cannot break."
        },
        {
          eyebrow: "Elite · The identity",
          title: "The Equity Identity",
          lead: "After the ownership claim, the valuation, the margin and the rotation — the only thing that survives contact with a live market is the trader who remembers what they actually own.",
          body: [
            "The market does not care how many multiples you can compute, how precisely you run a DCF, or how certain you feel about a stock. It cares what you do when the earnings gap comes, when the rotation leaves your sector behind, when the crowd's opinion and the business's facts disagree — and the trader who remembers the ownership claim — that every share is a slice of a real business that must actually earn — is the one the market eventually pays.",
            "The deeper layer: this is why the stock market is identity — every discipline in this Academy lands at the same door: trust the business over the story, the value over the price, the sector over the stock, the earnings over the headline. The trader who needs the crowd's approval to hold is the market's reliable customer; the trader who reads the ownership claim and stands on the quiet side of the rotation is the one the machine eventually rewards. The stock market has been running ownership auctions for centuries, and it will run them long after every chart in this academy is forgotten — the only question is whether you learn to trade the claim or keep trading the noise around it."
          ],
          bullets: [
            "The market rewards the trader who remembers what they own",
            "Trust the business over the story, the value over the price, the earnings over the headline",
            "The trader who needs the crowd's approval to hold is the market's customer",
            "Trade the ownership claim — or keep trading the noise around it"
          ],
          insight: "The stock market has run ownership auctions for centuries — and the only question is whether you trade the claim or the noise."
        },
        {
          eyebrow: "Elite · The cycle",
          title: "The Cycle in Stocks",
          lead: "Everything you learned about the market cycle plays out in the stock market — the same four phases, running on the same psychology, on every stock and every index.",
          body: [
            "Accumulation builds quietly at the bottom of the stock chart, mark-up trends with the institutions, distribution disguises itself at the top, and mark-down punishes the latecomers — the same four phases you learned in Chapter 11, running on the same psychology: the crowd forgetting, the institutions positioning, the transitions transferring the wealth. Stocks are businesses living inside the same heartbeat that runs forex, crypto and commodities.",
            "The deeper layer: the cycle in stocks adds the earnings engine to the phase — the earnings season is the stock cycle's catalyst calendar, and the same earnings beat lands differently in accumulation (the confirmation the loading hand needed) than in distribution (the strength the distributing hand sells into). The professional reads the stock through the phase AND the earnings: the phase sets the direction the news will land in, the earnings are the catalyst inside it, and the two together decide how the same headline moves the same stock. The cycle is the grammar; the earnings are the accent — and the trader who reads both reads the stock's full sentence."
          ],
          bullets: [
            "The four phases run through every stock and every index",
            "The same psychology: the crowd forgetting, the institutions positioning",
            "Earnings season is the stock cycle's catalyst calendar",
            "The phase sets the direction; the earnings are the catalyst inside it"
          ],
          insight: "Stocks are businesses living inside the same heartbeat — and the trader who reads the phase and the earnings reads the stock's full sentence."
        },
        {
          eyebrow: "Elite · The check",
          title: "The Ownership Checklist",
          lead: "Before every stock decision, the professional runs the ownership checklist — the business, the value, the sector, the phase and the price, answered with evidence.",
          body: [
            "Five questions, answered before the order: Is the business earning (the earnings trend, the engine)? What is the estimate of its value (the DCF, the multiple, with the assumptions stated)? Which sector wind is it sailing in (the rotation's direction)? Which phase is it in (accumulation, mark-up, distribution, mark-down)? And what is the price relative to the value (the gap, the margin of safety)? Five answers, one decision — and the decision is only as strong as the weakest answer.",
            "The deeper layer: the checklist is what separates the ownership read from the chart guess — the amateur sees the rising line and feels 'it will keep going'; the professional assembles the five pieces of evidence and lets them disagree before deciding. When the answers disagree (the business earning, the value reasonable, but the phase in late distribution with the sentiment euphoric), the honest answer is 'wait' — and the waiting is the discipline that the ownership mindset pays for. The checklist is the ownership claim made practical: every share is a business, and the business is checked before the ticket."
          ],
          bullets: [
            "Five questions: the earnings, the value, the sector, the phase, the price",
            "The decision is only as strong as the weakest answer",
            "Disagreement is an honest 'wait' — the checklist lets the evidence argue",
            "The checklist is the ownership claim made practical"
          ],
          insight: "The ownership checklist is the claim made practical — and the trader who lets the five answers disagree before deciding is the trader the chart cannot rush."
        },
        {
          kind: "pause",
          eyebrow: "Elite · Breathe",
          title: "Reset Before the Test",
          lead: "You've just opened the ownership mathematics — the two markets, the valuation gap, the DCF's assumptions, the multiple, the margin's loan and call, the cap ladder, the sector wind, the value-growth rotation, the dividend contract, the earnings engine, the auction, the spread toll and the portfolio's threads. Close your eyes for one breath — in for four, out for four — and let the claim settle.",
          body: [
            "The next ten questions are the Elite gate: the perpetuity arithmetic, the P/E, the margin math, the cap ladder, the contracts, the rotation, the two markets and the valuation gap. They assume you understand the mathematics, not just the vocabulary. Take the breath. Then prove it."
          ]
        },
        null, null, null, null, null, null, null, null, null, null,
        {
          kind: "close",
          eyebrow: "Elite chapter complete",
          title: "You Trade the Claim",
          body: [
            "You entered as a watcher of stock prices and leave as a reader of ownership: the two markets, the valuation gap, the DCF's assumptions, the multiple, the margin's loan and call, the cap ladder, the sector wind, the value-growth rotation, the dividend contract, the earnings engine, the auction, the spread toll and the portfolio's threads.",
            "This is the Elite difference: not the stock's price, but the business behind it. You've earned the claim. Finish the gate, and the Summit continues in Chapter 13's Elite lane."
          ]
        }
      ]
    }
};
module.exports = C;