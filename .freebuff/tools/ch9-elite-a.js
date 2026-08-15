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
