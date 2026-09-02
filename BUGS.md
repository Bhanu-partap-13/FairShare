# Bugs found

Add one section per issue. Bug 1 is filled in to show the format — fix it, then write what you changed. Copy the blank template for the rest.

Keep this file in the repo and **commit it** with your fixes.

---

## Bug 1

**How to reproduce:** Open the app. The expense list says “Newest first”. The first row is Wine (7 Mar). Board game (15 Mar) is further down.

**What is wrong:** The list is showing oldest expenses first. Newest should be at the top.

**What I changed:** In `src/components/ExpenseList.jsx`, flipped the sort order from `dateValue(a.date) - dateValue(b.date)` to `dateValue(b.date) - dateValue(a.date)` so newest expenses sort first. In `src/lib/format.js`, updated `dateValue` to reliably convert string and Date objects to numeric timestamps.

---

## Bug 2

**How to reproduce:** Look at the Balances panel for any member who paid more than their share (e.g. Ben or Carlos).

**What is wrong:** Members who paid more than their share are shown in red with the label “owes $X.XX”, while members who spent less than their share are shown in green with “is owed $X.XX”. The labels and styling are inverted.

**What I changed:** In `src/components/BalancesPanel.jsx`, corrected the conditional check so that a positive balance (`bal > 0.005`) displays `is owed` with the green `.owed` style, and a negative balance (`bal < -0.005`) displays `owes` with the red `.owe` style.

---

## Bug 3

**How to reproduce:** Check an expense where the payer is not included in the split, such as seed expense "Uber to airport" ($60 paid by Diya, split between Aisha and Ben). Diya is credited only $30 instead of $60.

**What is wrong:** `computeBalances` in `src/lib/balances.js` contains a check `!(exp.paidBy in shares)` that subtracts `amount / n` from the payer's balance. When someone pays for a bill they didn't consume, they should be reimbursed in full. This bug also broke the closed-group invariant where net balances across all members sum to zero.

**What I changed:** Removed the erroneous penalty check and deduction from `computeBalances` in `src/lib/balances.js` so payers get full credit for payments made for others.

---

## Bug 4

**How to reproduce:** In the Filter section, select any person in the "Paid by" dropdown (e.g. "Aisha Khan").

**What is wrong:** All expenses disappear and the list displays “No expenses match these filters.”, even when that member has paid expenses in the list.

**What I changed:** In `src/App.jsx`, changed `e.paidBy !== paidBy` to `Number(e.paidBy) !== Number(paidBy)` to fix the type mismatch between string option values from the `<select>` element and numeric member IDs on expenses.

---

## Bug 5

**How to reproduce:** Filter expenses (e.g. by category "Fun" or search query) and click "Delete" on any row, or edit the amount input.

**What is wrong:** A completely different expense is deleted or updated. This is because the sorted and filtered list index was passed to the reducer, which applied `splice` or updated `state.expenses[action.index]`.

**What I changed:** Updated `DELETE_EXPENSE` and `UPDATE_EXPENSE` reducer cases in `src/state/store.js` to operate by expense `id` rather than array `index`. Updated `src/App.jsx` and `src/components/ExpenseList.jsx` to pass `id` and use `key={expense.id}`.

---

## Bug 6

**How to reproduce:** Create expenses such that a debtor owes the exact same amount that a creditor is owed (for example, Person A owes $50 and Person B is owed $50).

**What is wrong:** The "Settle up" panel shows no transfers between them. The algorithm contained an empty `else` block when `d.amount === c.amount` that incremented pointers without creating a transfer.

**What I changed:** In `src/lib/settle.js`, restructured the loop using `Math.min(d.amount, c.amount)` to always create a transfer of the matching amount, ensuring no balances are dropped.

---

## Bug 7

**How to reproduce:**

**What is wrong:**

**What I changed:**

---
