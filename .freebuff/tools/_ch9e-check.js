const C = {
    elite: {
      slides: 30,
      quizSlides: [20,21,22,23,24,25,26,27,28,29],
      quiz: [
        { q: "A market order fills because…",
          options: ["The broker guarantees the quoted price", "It consumes liquidity — it takes whatever is resting in the book at the moment it arrives, which is why the fill can be better or worse than the last quote you saw", "It waits for a better price", "It is cancelled if the price moves", "It is rejected in fast markets"], answer: 1,
          explain: "The market order is the consumer: it crosses the spread and takes the resting orders, filling at whatever price is available at that instant. The deeper layer: the fill is decided by the book, not the quote — in a quiet market the fill matches the quote, and in a fast market it can be better (or worse) as the book moves between your click and your arrival. The professional knows the market order's contract: certainty of fill, uncertainty of price." },
        { q: "A limit order placed below the market…",
          options: ["Fills immediately", "Rests in the book as a liquidity provider — it waits to be taken, and if price never reaches it, it expires unfilled", "Becomes a market order at the close", "Is always rejected", "Fills at a worse price than the market"], answer: 1,
          explain: "The limit order is the provider: it rests at the chosen price and waits to be taken — the fill is not guaranteed, and the unfilled order is not a failure but a decision the market never accepted. The deeper layer: the limit order trades certainty of price for uncertainty of fill — the professional uses it when the price matters more than the timing, and knows that an order that never fills was the plan's honest result, not the plan's mistake." },
        { q: "A stop order is triggered when…",
          options: ["The market touches the price", "Price reaches the stop level — the order converts into a market order and fills at the next available price, which in a fast move may be beyond the level", "The broker approves it", "The day closes", "The spread narrows"], answer: 1,
          explain: "The stop order is a trigger: price reaching the level converts it into a market order, and the fill is at whatever price is next available — which is why a stop can fill beyond its level in a fast or gapping move. The deeper layer: the stop's contract is the opposite of the limit's — it guarantees the trigger, not the price — and the professional sizes for the worst realistic fill, never the level itself, because the stop is a market order wearing a trigger's clothes." },
        { q: "Slippage is worst exactly when…",
          options: ["The market is quiet", "The market is moving fastest — the news spike, the breakout through thin liquidity — when the price you saw is already gone by the time your order arrives", "The spread is tightest", "The order is a limit", "The order is placed at noon"], answer: 1,
          explain: "Slippage is the gap between the price you saw and the price you got, and it is largest in the fast moves — the news spike, the thin-market breakout — when the book is moving faster than your order. The deeper layer: this is why the professional avoids market orders into events they cannot read, and prices the worst-case fill into every stop — the fast market is exactly when the naive fill assumption costs the most." },
        { q: "An OCO (one-cancels-the-other) bracket…",
          options: ["Places two orders where one cancels the other — the stop and the target in one bracket, so the trade has both exits standing from the moment of entry", "Doubles the position", "Is a broker error", "Only works for limit orders", "Moves the stop after entry"], answer: 0,
          explain: "The OCO bracket places the stop and the target together — when one fills, the other is cancelled — so the trade's both exits are set at the moment of entry. The deeper layer: the bracket is the plan made mechanical — the exit decisions are made before the trade exists, and the bracket enforces them without the emotions having a vote. The professional's entry and bracket are one order: the trade is not 'in' until both exits are standing." },
        { q: "A trailing stop…",
          options: ["Moves the stop toward price as the trade moves in your favour — locking in profit while giving the runner room to travel", "Moves the stop away from price", "Cancels the trade", "Is only for beginners", "Is the same as a fixed stop"], answer: 0,
          explain: "The trailing stop rides the trade: as price moves in your favour, the stop follows, locking in a growing minimum result while leaving the runner room. The deeper layer: the trailing stop is the management of the trend's uncertainty — it converts the open trade into a 'can't lose much' position once the trail is past breakeven, and it lets the winner run without the trader having to decide the exit in the moment. The trail's distance is a pre-planned choice — too tight and the noise collects it, too loose and it locks in nothing." },
        { q: "The professional's execution edge comes from…",
          options: ["Faster clicks", "Choosing the right order type for the situation — the market order for certainty of fill, the limit for the price, the stop for the trigger, and the bracket for the plan", "Bigger size", "More leverage", "Faster news access"], answer: 1,
          explain: "Execution is not speed — it is choosing the right contract with the market for each moment: the market order where the fill must happen, the limit where the price matters more, the stop where the trigger is the point, the bracket where the plan must be mechanical. The deeper layer: the order type is half the execution, and the other half is knowing what the chosen type will do when the market is moving — the trader who picks the type by habit is executing with a tool chosen for a different job." },
        { q: "The cost of a click is…",
          options: ["Zero — clicks are free", "The spread, the slippage and the swap — the tolls on every round trip, invisible in the ticket but real in the account, and priced into the edge before the trade", "The broker's fee only", "Nothing for limit orders", "The interest on the account"], answer: 1,
          explain: "Every round trip pays the spread, the fast fills pay the slippage, and the overnight holds pay the swap — the click's real cost is the sum of the tolls, and the tolls are the quietest leak in the account. The deeper layer: the professional prices the costs into the expectancy before the trade exists — the edge that survives the tolls is the edge that compounds, and the edge that dies in the tolls was never an edge. The trader who ignores the costs is the trader the costs quietly collect." },
        { q: "A gap that jumps your stop means…",
          options: ["Your stop failed", "The stop converted to a market order and filled at the next available price after the gap — the contract was the trigger, not the price, and the fill is where the market opened", "The broker cheated", "The stop was too tight", "The order was cancelled"], answer: 1,
          explain: "A plain stop is a trigger, not a guarantee: in a gap, it becomes a market order at the open, and the fill is beyond the level — the contract honoured, the price unguaranteed. The deeper layer: this is why the worst-case sizing matters more than the stop's distance — the position must survive the gap, not just the level, and the professional treats 'the stop works' as an assumption that is true until the gap, and the gap as the reason the size was conservative." },
        { q: "The execution identity is…",
          options: ["Clicking as fast as possible", "The trader whose order is always the right contract with the market — certainty when certainty is needed, price when price matters, triggers when the level is the point, and brackets when the plan must be mechanical", "Using market orders exclusively", "Avoiding orders entirely", "Using the same order type for every trade"], answer: 1,
          explain: "The execution identity is the deliberate choice of the order type for each situation — the contract that matches what the moment actually needs. The deeper layer: execution is where the plan becomes real — the best analysis is worth nothing if the order type delivers the wrong contract, and the trader who chooses the type deliberately is the trader whose analysis survives the click. The market does not know what you meant; it executes what the ticket says — and the execution identity is the trader who makes the ticket say exactly what they mean." }
      ],
      native: [
        {
          eyebrow: "Elite · The machine",
          title: "The Execution Machine",
          lead: "The Standard chapter taught you the order types by name. This lane opens the machine that executes them — the consumer and the provider, the fill ladder, the slippage in the fast market, the bracket and the trail, and the cost of every click.",
          body: [
            "Your decision becomes an order, and the order becomes a contract with the market — a contract with its own mechanics, its own costs and its own behaviour in a fast move. The analysis picks the direction; the execution decides whether the direction survives the click.",
            "This lane teaches you to choose the contract deliberately — so that every order you place says exactly what you mean, and does exactly what you expected when the market moves."
          ],
          bullets: [
            "The market order consumes liquidity; the limit provides it; the stop triggers it",
            "The fill is decided by the book and the speed, not the quote you saw",
            "The bracket makes the exit decisions before the trade exists",
            "The click's real cost is the spread, the slippage and the swap"
          ],
          insight: "The analysis picks the direction; the execution decides whether the direction survives the click — and the order type is the contract that decides."
        },
        {
          eyebrow: "Elite · The consumer",
          title: "The Market Order — The Consumer",
          lead: "The market order is the market's consumer — it crosses the spread and takes whatever is resting, trading certainty of fill for uncertainty of price.",
          body: [
            "The market order arrives and consumes: it takes the resting liquidity at the best available price, filling immediately — or as immediately as the market allows. Its contract is certainty of fill, and its price is whatever the book offers at that instant: the quote in a quiet market, something better or worse in a moving one. The market order is the tool of the moment — the stop, the news entry, the exit that must happen.",
            "The deeper layer: the market order's price is decided by the book's state at arrival, which is why the professional does not trust the last quote in a fast market — the quote is the past, and the fill is the present. The consumer's edge is knowing when certainty matters more than price: the exit that must happen, the entry whose timing is the point, the stop that must trigger. The trader who uses the market order for everything is paying certainty's price where patience would have been cheaper; the trader who uses it where certainty is the point is spending it exactly where it is worth the cost."
          ],
          bullets: [
            "The market order consumes the resting liquidity — filling at the available price",
            "Its contract: certainty of fill, uncertainty of price",
            "The fill is decided by the book's state at arrival — the quote is the past",
            "Spend certainty where it matters: the exit that must happen, the trigger that must fire"
          ],
          insight: "The market order trades certainty of fill for uncertainty of price — and the professional spends it exactly where certainty is worth the cost."
        },
        {
          eyebrow: "Elite · The provider",
          title: "The Limit Order — The Provider",
          lead: "The limit order is the market's provider — it rests in the book and waits to be taken, trading certainty of price for uncertainty of fill.",
          body: [
            "The limit order chooses its price and waits: it rests in the book, providing liquidity to the market, and fills only if price arrives to take it. Its contract is certainty of price, and its risk is the unfilled order — the price that never comes. The limit is the tool of patience: the entry at the value zone, the exit at the target, the position built where price is asked to come to you.",
            "The deeper layer: the provider earns the spread that the consumer pays — the limit order's fill is the consumer's cost, which is why the patient provider is the cheaper trader over many round trips. But the provider also carries the risk the consumer does not: the unfilled order, the price that runs past without stopping. The professional chooses the limit where the price is the point and the fill can be waited for; the market order where the fill must happen — and the two choices are the two halves of the same execution discipline: know which contract the moment demands."
          ],
          bullets: [
            "The limit order rests in the book, providing liquidity at its chosen price",
            "Its contract: certainty of price, uncertainty of fill",
            "The provider earns the spread the consumer pays — the patient trader is cheaper",
            "The provider's risk is the unfilled order — the price that never comes"
          ],
          insight: "The limit order trades certainty of price for uncertainty of fill — and the professional knows which contract each moment demands."
        },
        {
          eyebrow: "Elite · The trigger",
          title: "The Stop Order — The Trigger",
          lead: "The stop order is the market's trigger — it waits until price reaches the level, then becomes a market order and fills at whatever comes next.",
          body: [
            "The stop order's contract is the trigger: price touching the level converts it into a market order, and the fill is at the next available price — the level in a quiet market, something beyond it in a fast or gapping one. The stop is the tool of the level: the breakout entry, the invalidation exit, the protective stop that must fire when the level is reached.",
            "The deeper layer: the stop's promise is the trigger, never the price — and the professional sizes for the worst realistic fill because the stop will, at some point, fill worse than the level. The trader who assumes the stop fills at the level is assuming a quiet market forever; the trader who prices the gap into the size is assuming the market's honesty — that the fast move will come, and the fill will be beyond the level. The stop is a market order wearing a trigger's clothes — and the professional reads the clothes, but sizes for the market order underneath."
          ],
          bullets: [
            "The stop waits for the level, then converts to a market order",
            "Its contract: certainty of trigger, uncertainty of fill price",
            "The fill is the level in a quiet market — and beyond it in a fast one",
            "Size for the worst realistic fill — the stop is a market order in disguise"
          ],
          insight: "The stop guarantees the trigger, never the price — and the trader who sizes for the market order underneath is the trader the gap cannot surprise."
        },
        {
          eyebrow: "Elite · The ladder",
          title: "The Fill Ladder",
          lead: "The fill is the product of three ladders — the price ladder, the time ladder and the liquidity ladder — and the market order climbs all three at once.",
          body: [
            "The price ladder is the book's levels — the resting bids and offers stacked in order. The time ladder is the queue — the orders that arrived before yours, standing ahead in line. The liquidity ladder is the depth — how many units sit at each level before the book thins. The market order climbs all three: it takes the best price first, then the next, consuming each level's depth until the order is filled.",
            "The deeper layer: the ladder explains the fills that surprise — the large order that moves the price because it climbed past the thin levels, the fast-market fill beyond the quote because the ladder was moving as you arrived. The professional reads the ladder's shape before the large orders: the deep, wide book fills smoothly; the thin, steep book moves against the order as it climbs. The fill is never just the price — it is the price, the queue and the depth, and the trader who reads the ladder reads the fill before it happens."
          ],
          bullets: [
            "The fill climbs three ladders: price, time and liquidity depth",
            "The large order moves price when it climbs past the thin levels",
            "The fast-market fill is beyond the quote because the ladder was moving",
            "Read the book's shape before the large orders — the fill is the ladder, not just the price"
          ],
          insight: "The fill is the product of price, time and depth — and the trader who reads the ladder reads the fill before it happens."
        },
        {
          eyebrow: "Elite · The fast market",
          title: "Slippage — The Fast Market's Tax",
          lead: "Slippage is the gap between the price you saw and the price you got — and it is largest exactly when the market is moving fastest.",
          body: [
            "In a quiet market, the fill matches the quote. In a news spike or a breakout through thin liquidity, the book moves between your click and your arrival — the market order fills at whatever price is available, which can be beyond the level, beyond the quote, beyond what you were willing to pay. The slippage is the fast market's tax, and it is largest exactly when you need the best fill.",
            "The deeper layer: the professional's defence is threefold — avoid the market order into events you cannot read (the news you cannot price), widen the expected fill during the high-impact releases (the worst case is the plan's case), and remember that a 'guaranteed stop' is a product with a cost, not a feature of the plain order. Slippage is not punishment and not conspiracy — it is the honest price of speed, and the trader who prices it into the plan is the trader the fast market cannot surprise."
          ],
          bullets: [
            "Slippage is the gap between the seen price and the got price",
            "It is largest in the fast moves — when the book is moving faster than your order",
            "Avoid market orders into events you cannot read; widen the expected fill in the releases",
            "Slippage is the honest price of speed — priced into the plan, it cannot surprise"
          ],
          insight: "Slippage is the fast market's tax — and the trader who prices it into the plan is the trader the fast market cannot surprise."
        },
        {
          eyebrow: "Elite · The bracket",
          title: "The Bracket — The Plan Made Mechanical",
          lead: "The OCO bracket is the plan made mechanical — the stop and the target standing together from the moment of entry, one cancelling the other.",
          body: [
            "The OCO (one-cancels-the-other) places both exits at entry: the stop and the target, one cancelling the other when either fills. The trade is never 'in' without both exits standing — the risk is defined, the target is set, and the emotions never get to vote on the exit because the exit was decided before the trade existed. The bracket is the execution of the plan's discipline, made into an order.",
            "The deeper layer: the bracket is the bridge between the psychology chapter and the execution chapter — the pre-written exit is the pre-written decision, and the bracket enforces it mechanically when the moment would argue with it. The trader who enters without the bracket is entering with the exits undecided — and the undecided exit is the exit the moment decides, which is the exit the emotions decide. The professional's entry and bracket are one order: the analysis picks the direction, and the bracket ensures the direction is managed by the plan, not the moment."
          ],
          bullets: [
            "The OCO places both exits at entry — one cancels the other when either fills",
            "The trade is never 'in' without both exits standing",
            "The bracket is the pre-written exit, enforced mechanically",
            "Entry and bracket are one order — the exit was decided before the trade existed"
          ],
          insight: "The bracket is the plan made mechanical — and the trader who enters with both exits standing never lets the moment vote on the exit."
        },
        {
          eyebrow: "Elite · The runner's leash",
          title: "The Trailing Stop",
          lead: "The trailing stop is the runner's leash — it follows the trade in your favour, locking in a growing minimum while giving the winner room to travel.",
          body: [
            "As price moves in your favour, the trailing stop moves with it: the profit already made becomes a floor, and the runner is allowed to keep going as long as the trail is not hit. The trail converts the open trade into a 'can't lose much' position once it is past breakeven, and it lets the winner run without the trader having to decide the exit in the moment — the trail is the exit, decided in advance.",
            "The deeper layer: the trail's distance is a deliberate choice, not a default — too tight, and the normal pullback collects it (the noise takes the runner); too loose, and it locks in nothing (the runner's profit evaporates on the reversal). The professional sets the trail from the structure — beyond the swing that defines the move's breathing room — and treats the trailed stop as a management decision made by the plan, not a reaction to the floating P&L. The runner is the trade's upside; the trail is the leash that lets the upside run without letting it escape."
          ],
          bullets: [
            "The trail follows price in your favour, locking in a growing minimum",
            "Past breakeven, the trailed trade is a 'can't lose much' position",
            "Too tight, the noise collects it; too loose, it locks in nothing",
            "Set the trail from the structure — the leash is the plan's, not the moment's"
          ],
          insight: "The trailing stop lets the winner run on a leash — and the leash's length is decided by the structure, never by the floating P&L."
        },
        {
          eyebrow: "Elite · The gap",
          title: "The Gap — The Jump That Skips Your Level",
          lead: "The gap is the market's skip — price jumps from one level to the next without trading the space between, and every order resting in the gap is filled at the new price, not the old one.",
          body: [
            "The gap happens when the market opens or moves beyond where orders are resting: the weekend close and the news arrives, the market opens beyond the old range, and the stops resting below the old support are filled at the open — beyond their level. The gap is not a failure of the stop; it is the stop's contract — the trigger fired, and the fill was where the market actually was.",
            "The deeper layer: the gap is the execution chapter's black swan — it cannot be predicted, only survived, and the survival is in the sizing: the position that hurts at the stop must merely bruise at the gap. The professional prices the worst-case fill into the size before the trade exists, and treats 'the stop works' as an assumption that is true until the gap — and the gap as the reason the size was conservative. The market does not owe you the level; it owes you the truth of where it opened — and the trader who sizes for the truth is the trader the gap cannot break."
          ],
          bullets: [
            "The gap skips the space between levels — resting orders fill at the new price",
            "The gap is the stop's contract: the trigger fired, the fill was where the market was",
            "The gap cannot be predicted — only survived, and the survival is in the sizing",
            "Price the worst-case fill into the size — the gap is why the size was conservative"
          ],
          insight: "The market does not owe you the level — it owes you the truth of where it opened, and the trader who sizes for the truth is the trader the gap cannot break."
        },
        {
          eyebrow: "Elite · The book",
          title: "The Order Book — The Depth Behind the Price",
          lead: "The price is the surface; the book is the depth — the resting orders at every level, and the book's shape decides how the price moves.",
          body: [
            "The order book is the stack of resting bids and offers: the price ladder, the depth at each level, the walls of liquidity that absorb or repel the flow. A thick book absorbs the market orders smoothly — the price moves little as the orders are consumed. A thin book moves violently — each market order pushes through the shallow levels, and the price skips to find the next depth.",
            "The deeper layer: the book is the execution context — the professional reads its shape before the large decisions: the thick book supports the large size (the fill will be smooth), the thin book warns against it (the fill will move the price). The book also explains the moves: the breakout that runs because the book was thin above the level, the stall that held because the wall was deep. The price is the book's surface — and the trader who reads the book reads the depth behind every move."
          ],
          bullets: [
            "The book is the resting depth behind the price — the ladder, the walls",
            "A thick book absorbs the flow; a thin book moves violently",
            "Read the book before the large size — the fill's smoothness lives in the depth",
            "The price is the book's surface — the depth is the context of every move"
          ],
          insight: "The price is the book's surface and the book is the depth — and the trader who reads the depth reads the moves the surface cannot explain."
        },
        {
          eyebrow: "Elite · The speed",
          title: "The News Order — The Decision Under Speed",
          lead: "The news release is the execution's hardest test — the decision must be made before the data lands, because the moment of the print is too fast to decide in.",
          body: [
            "When the high-impact release prints, the market moves in seconds — the book shifts, the spread widens, the slippage arrives, and the trader who is deciding at that moment is deciding with the market already gone. The professional's defence is the pre-news plan: the decision to trade the release (or not) is made before it, with the levels and the order type chosen in advance — the entry plan, the stop, the size, all standing before the print.",
            "The deeper layer: the news order is the execution discipline's ultimate test because it combines every chapter of this lane — the order type (market for certainty in the fast fill, limit to avoid the slippage), the costs (the widened spread), the bracket (both exits standing), the size (the worst-case fill). The trader who plans the news trades the release with the plan; the trader who decides at the release trades the release with the moment. The print itself is unpredictable — the plan around it is not, and the plan is the only part the professional controls."
          ],
          bullets: [
            "The release moves in seconds — the decision must be made before the print",
            "The pre-news plan: levels, order type, stop, size — standing before the release",
            "The news order combines every execution skill — type, costs, bracket, size",
            "The print is unpredictable; the plan around it is not"
          ],
          insight: "The release is too fast to decide in — and the pre-news plan is the only part of the news the professional controls."
        },
        {
          eyebrow: "Elite · The plan",
          title: "The Execution Plan — The Order in the Plan",
          lead: "The plan does not end at the direction — it ends at the order: the type, the price, the size, the bracket, all chosen before the entry exists.",
          body: [
            "The professional's plan includes the execution: the order type (market where the fill must happen, limit where the price is the point, stop where the level is the trigger), the entry price, the size computed from the risk and the stop, the bracket with both exits standing. The execution is not an afterthought to the analysis — it is the plan's final section, written before the trade exists, because the moment of the entry is too late to choose the contract.",
            "The deeper layer: the execution plan is where the analysis becomes accountable — the direction is an opinion, but the order is a contract, and the contract is where the opinion meets the market's reality. The trader who plans the execution discovers the gaps the analysis hid: the stop that does not fit the budget, the limit that will never fill, the size that the book cannot absorb. The professional writes the execution into the plan so the gaps are found before the money is committed — and the trader who skips the execution plan is the trader who discovers the gaps after the click."
          ],
          bullets: [
            "The plan ends at the order — type, price, size, bracket, chosen before the entry",
            "The execution is the plan's final section, written before the trade exists",
            "The direction is an opinion; the order is a contract",
            "Write the execution into the plan — find the gaps before the click, not after"
          ],
          insight: "The plan does not end at the direction — it ends at the order, and the contract is where the opinion meets the market's reality."
        },
        {
          eyebrow: "Elite · The toll",
          title: "The Cost of the Click",
          lead: "Every click pays a toll — the spread, the slippage, the swap — and the tolls are the quietest leak in the account, priced into the edge before the trade.",
          body: [
            "The spread is the toll on every round trip — paid twice, in and out. The slippage is the fast market's toll — paid when the fill is beyond the quote. The swap is the overnight toll — paid or earned on every position held past the rollover. The three tolls are invisible in the ticket and real in the account — and over many trades, they are the difference between the edge that compounds and the edge that bleeds.",
            "The deeper layer: the professional prices the costs into the expectancy before the trade exists — the edge that survives the tolls is the edge that compounds, and the edge that dies in the tolls was never an edge. The cost awareness also shapes the execution choices: the limit order earns the spread instead of paying it, the liquid pair pays the cheaper toll, the session with the tightest spread is the session with the cheapest toll. The trader who ignores the costs is the trader the costs quietly collect — and the trader who prices them is the trader whose edge is measured after the tolls, which is the only measurement that counts."
          ],
          bullets: [
            "Three tolls on every round trip: the spread, the slippage, the swap",
            "The tolls are invisible in the ticket and real in the account",
            "Price the costs into the expectancy before the trade exists",
            "The edge that survives the tolls is the edge that compounds"
          ],
          insight: "The tolls are the quietest leak in the account — and the trader who prices them is the trader whose edge is measured after the costs, which is the only measurement that counts."
        },
        {
          eyebrow: "Elite · The rejection",
          title: "The Rejected Order",
          lead: "Every trader meets the rejected order — the insufficient margin, the invalid price, the expired order — and the rejection is the market's grammar lesson.",
          body: [
            "The order is rejected for a reason: the margin is insufficient (the size exceeds what the account can hold), the price is invalid (the limit beyond the market's range or the stop in the wrong place), the order expired (the GTC limit never filled and the day ended it), the platform refused it (the bracket misconfigured). The rejection is not noise — it is the market or the platform telling you what the order was actually saying.",
            "The deeper layer: the professional reads the rejection as information about the plan — the margin rejection exposes the size that exceeded the risk budget, the invalid price exposes the level that was never real, the expiry exposes the patience that never got paid. The trader who reads the rejection learns the grammar of orders; the trader who dismisses it repeats the mistake with the money attached. The rejected order is the cheapest lesson the execution chapter offers — it costs nothing but attention, and it teaches the same thing the filled order teaches with the account at stake."
          ],
          bullets: [
            "The rejection has a reason — margin, invalid price, expiry, misconfiguration",
            "The rejection is the market or the platform telling you what the order said",
            "Read the rejection as information about the plan's gaps",
            "The rejected order is the cheapest lesson — it costs attention, not money"
          ],
          insight: "The rejection is the market's grammar lesson — and the trader who reads it learns for free what the filled order teaches with the account at stake."
        },
        {
          eyebrow: "Elite · The ticket",
          title: "The Ticket — The Six Fields",
          lead: "Every field on the ticket is a commitment made out loud — and the ticket read like a contract is the trade understood before the click.",
          body: [
            "The pair (what you are trading), the direction (which side — the same pair, opposite meaning), the size (the risk committed, in money), the stop (where the thesis is wrong), the target (where the thesis is fulfilled) and the order type (the contract with the market). Six fields, one minute, the entire trade decided before the market has a chance to argue. The ticket that cannot be read out loud is a trade that is not understood.",
            "The deeper layer: the ticket is the execution plan made physical — the six fields are the plan's six decisions, and the professional reads them in order, with the stop first because it is the only field that guarantees survival. The trader who skips the stop 'because it will not hit anyway' is the trader who has misunderstood the whole contract; the trader who reads the ticket like a contract — and signs it like one — has stopped trading and started operating. The market does not care what you meant; it executes what the ticket says — and the ticket says exactly what the six fields say, no more, no less."
          ],
          bullets: [
            "Six fields: pair, direction, size, stop, target, order type",
            "The ticket read like a contract is the trade understood before the click",
            "Read the stop first — it is the only field that guarantees survival",
            "The market executes what the ticket says — make it say exactly what you mean"
          ],
          insight: "The ticket is the plan made physical — and the trader who reads it like a contract, with the stop first, has stopped trading and started operating."
        },
        {
          eyebrow: "Elite · The identity",
          title: "The Execution Identity",
          lead: "After the consumer and the provider, the ladder, the slippage, the bracket and the tolls — the only thing that survives contact with a live market is the trader whose order is always the right contract.",
          body: [
            "The market does not care how well you analysed the pair, how certain you are of the direction, or how beautiful the setup looked. It executes what the ticket says — and the trader who chooses the order type deliberately, prices the tolls into the edge, sets the bracket before the entry, and reads the rejection as a lesson is the trader whose analysis survives the click. The execution is where the plan becomes real, and the execution identity is the trader who makes every order say exactly what they mean.",
            "The deeper layer: this is why execution is identity — every discipline in this Academy ends at a click, and the click is the moment the discipline either holds or fails. The trader who plans the execution — the order type, the costs, the bracket, the worst-case fill — is the trader who is never surprised by the fill; the trader who clicks by habit is the trader the fast market and the gap and the tolls collect. The market has been executing orders since the first trade, and it will execute them long after every chart in this academy is forgotten — the only question is whether your orders say what you mean, or whether the market gets to read them for you."
          ],
          bullets: [
            "The market executes what the ticket says — not what you meant",
            "Choose the order type deliberately, price the tolls, set the bracket before the entry",
            "Every discipline ends at a click — and the click is where it holds or fails",
            "Make the orders say what you mean — or let the market read them for you"
          ],
          insight: "The execution is where the plan becomes real — and the trader whose orders say exactly what they mean is the trader the market cannot misread."
        },
        {
          eyebrow: "Elite · The order's journey",
          title: "The Order's Journey — From Click to Fill",
          lead: "Between your click and your fill, the order takes a journey through the machine — and knowing the journey is knowing where the surprises hide.",
          body: [
            "The order leaves your platform, reaches the broker's feed, gets routed to the liquidity, and fills against the resting book — the whole journey in fractions of a second in a liquid market, longer and more treacherous in a thin one. Each leg of the journey can add a cost: the broker's routing, the spread at the moment of arrival, the slippage if the book moved, the rejection if the order was malformed. The fill you see is the journey's end, not its beginning.",
            "The deeper layer: the professional knows the journey because the surprises live in the legs — the news-spike fill that was worse than the quote (the book moved between the legs), the rejected order (the platform refused the contract), the fill that arrived late (the routing was slow). The order's journey is the execution chapter's hidden dimension — the trader who understands it reads the fill as the journey's report, and the trader who ignores it is surprised by every leg. The click is the beginning; the fill is the report — and the report only makes sense with the journey in mind."
          ],
          bullets: [
            "The order journeys from platform to feed to liquidity — in fractions of a second or longer",
            "Each leg can add a cost: routing, spread at arrival, slippage, rejection",
            "The fill is the journey's end, not its beginning",
            "Read the fill as the journey's report — with the journey in mind"
          ],
          insight: "Between the click and the fill, the order travels through the machine — and the trader who knows the journey reads every fill as its report."
        },
        {
          eyebrow: "Elite · The discipline",
          title: "The Click as Commitment",
          lead: "The click is not the end of the analysis — it is the beginning of the commitment, and the commitment is the discipline the whole plan was built for.",
          body: [
            "The click converts the plan into a position: the analysis becomes money, the direction becomes exposure, and the pre-written decisions — the stop, the target, the bracket, the size — become the contract the market will hold you to. The click is the moment the trader stops thinking and starts committing, and the quality of the commitment was decided before the click: the plan, the execution choices, the state check — all of it written before the finger moved.",
            "The deeper layer: the click as commitment is the bridge between every chapter of this Academy — the analysis chooses the direction, the risk chapter sizes it, the psychology chapter protects the state, and the execution chapter chooses the contract — all of it converging on one click that either honours them or betrays them. The trader who clicks by plan is committing the whole Academy's discipline; the trader who clicks by impulse is committing nothing but the impulse. The market does not know which you were — but the account does, and the account is the one that keeps score."
          ],
          bullets: [
            "The click converts the plan into a position — analysis becomes money",
            "The commitment's quality was decided before the click",
            "Every chapter converges on the click — analysis, risk, psychology, execution",
            "Click by plan, committing the whole Academy — or click by impulse, committing nothing"
          ],
          insight: "The click is the beginning of the commitment — and the trader who clicks by plan commits the whole Academy's discipline in that single moment."
        },
        {
          kind: "pause",
          eyebrow: "Elite · Breathe",
          title: "Reset Before the Test",
          lead: "You've just opened the execution machine — the consumer and the provider, the trigger, the fill ladder, the fast market's tax, the bracket, the runner's leash, the gap, the order book, the news decision, the execution plan, the tolls, the rejected order and the six fields. Close your eyes for one breath — in for four, out for four — and let the contracts settle.",
          body: [
            "The next ten questions are the Elite gate: order mechanics, the fill, slippage, the bracket, the trail, the gap, the costs, the ticket. They assume you can choose the contract, not just name the order types. Take the breath. Then prove it."
          ]
        },
        null, null, null, null, null, null, null, null, null, null,
        {
          kind: "close",
          eyebrow: "Elite chapter complete",
          title: "You Choose the Contract",
          body: [
            "You entered as a user of orders and leave as a chooser of contracts: the consumer and the provider, the trigger, the fill ladder, the fast market's tax, the bracket, the runner's leash, the gap, the order book, the news decision, the execution plan, the tolls, the rejected order and the six fields.",
            "This is the Elite difference: not knowing the order types, but choosing the right contract for every moment. You've earned the execution. Finish the gate, and the Summit continues in Chapter 10's Elite lane."
          ]
        }
      ]
    }
};
module.exports = C;