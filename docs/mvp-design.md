Step 1 – Define **what “simplest voting” means** for our contract.

Let’s target:

* One poll at a time
* Fixed options: `Yes` / `No`
* Anyone can vote once
* Tally stored on-chain

Next step, we’ll adapt the bboard state type to hold this poll + tallies.


----------------


Here is **Step 1: Minimal edit** to turn bboard into a *Yes/No voting contract* (50-word explanation).

---

## ✅ Step 1 — Replace board state with voting state

We change:

* `state` → store poll open/closed
* `message` → store optional poll question
* Add tallies: `yesCount`, `noCount`
* Remove ownership logic
* Remove `takeDown`; replace with `voteYes` and `voteNo`

Here is the **minimal structural edit**:

```compact
export enum PollState {
  OPEN,
  CLOSED
}

export ledger pollState: PollState;
export ledger question: Maybe<Opaque<"string">>;
export ledger yesCount: Counter;
export ledger noCount: Counter;
```

Constructor:

```compact
constructor() {
  pollState = PollState.OPEN;
  question = none<Opaque<"string">>();
}
```

Now we can add `voteYes` and `voteNo` circuits next.

---

If you want, I’ll give **Step 2: adding vote circuits** in another 50 words.
